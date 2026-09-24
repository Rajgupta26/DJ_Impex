import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { blogSchema, enquirySchema, imageSchema } from "./schemas";
import { blogSeed, enquirySeed, imageSeed } from "./seed";

/**
 * A JSON file per collection, read and written with fs/promises. No database:
 * that is a deliberate constraint of this panel.
 *
 * Two things this module exists to get right:
 *
 *  1. Writes are atomic. We write a sibling temp file and rename it over the
 *     target, because rename(2) is atomic within a filesystem. A plain
 *     writeFile that is interrupted half way leaves a truncated file, and a
 *     truncated JSON file is a lost collection, not a damaged row.
 *
 *  2. Read-modify-write is serialised per file. Two requests that both read,
 *     both edit a different row and both write would leave only the second
 *     one's change. Every mutation goes through `mutate`, which chains onto the
 *     file's in-flight promise.
 *
 * The lock is per process, which is all a single Node server needs. It does not
 * survive a serverless host running several instances, and on a read-only
 * filesystem (Vercel's, outside /tmp) every write here fails. See
 * brand-kit/docs/05-open-questions.md.
 */

export const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
export const UPLOAD_URL_BASE = "/uploads";

export type CollectionName = "images" | "blogs" | "enquiries";

type Definition<T> = { schema: z.ZodType<T>; seed: () => T[] };

const definitions = {
  images: { schema: imageSchema, seed: imageSeed },
  blogs: { schema: blogSchema, seed: blogSeed },
  enquiries: { schema: enquirySchema, seed: enquirySeed },
} as const satisfies Record<CollectionName, Definition<unknown>>;

type Row<N extends CollectionName> = z.infer<(typeof definitions)[N]["schema"]>;

/** Anything a caller can act on: a bad file, a full disk, a read-only mount. */
export class StoreError extends Error {
  readonly status: number;
  constructor(message: string, status = 500, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "StoreError";
    this.status = status;
  }
}

function filePath(name: CollectionName): string {
  return path.join(DATA_DIR, `${name}.json`);
}

function isMissing(error: unknown): boolean {
  return (error as NodeJS.ErrnoException | null)?.code === "ENOENT";
}

async function ensureDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    throw new StoreError(`Could not create ${path.relative(process.cwd(), dir)}.`, 500, {
      cause: error,
    });
  }
}

/** Write via a temp file so the target is either the old file or the new one. */
async function writeJson(target: string, value: unknown): Promise<void> {
  await ensureDir(path.dirname(target));
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    await rename(temp, target);
  } catch (error) {
    await unlink(temp).catch(() => {});
    throw new StoreError(`Could not save ${path.basename(target)}. The file system may be read only.`, 500, {
      cause: error,
    });
  }
}

async function loadRows<N extends CollectionName>(name: N): Promise<Row<N>[]> {
  const target = filePath(name);
  const definition = definitions[name];

  let text: string;
  try {
    text = await readFile(target, "utf8");
  } catch (error) {
    if (!isMissing(error)) {
      throw new StoreError(`Could not read ${name}.json.`, 500, { cause: error });
    }
    // First run, or someone deleted the file: seed it and carry on.
    const seeded = definition.seed() as Row<N>[];
    await writeJson(target, seeded);
    return seeded;
  }

  if (!text.trim()) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new StoreError(`${name}.json is not valid JSON, so it was left untouched.`, 500, {
      cause: error,
    });
  }

  const result = z.array(definition.schema).safeParse(parsed);
  if (!result.success) {
    throw new StoreError(
      `${name}.json does not match the expected shape: ${z.prettifyError(result.error)}`,
      500,
    );
  }
  return result.data as Row<N>[];
}

/** One promise chain per collection: the serialisation point for writes. */
const chains = new Map<CollectionName, Promise<unknown>>();

function queue<T>(name: CollectionName, task: () => Promise<T>): Promise<T> {
  const previous = chains.get(name) ?? Promise.resolve();
  const next = previous.then(task, task);
  // Keep the chain alive past a rejection so one failure does not wedge the file.
  chains.set(
    name,
    next.catch(() => undefined),
  );
  return next;
}

export function readCollection<N extends CollectionName>(name: N): Promise<Row<N>[]> {
  return queue(name, () => loadRows(name));
}

/**
 * Read, transform and write under the collection's lock.
 * The callback returns the next array, plus anything the caller wants back.
 */
export async function mutate<N extends CollectionName, R>(
  name: N,
  fn: (rows: Row<N>[]) => Promise<{ rows: Row<N>[]; result: R }> | { rows: Row<N>[]; result: R },
): Promise<R> {
  return queue(name, async () => {
    const rows = await loadRows(name);
    const { rows: next, result } = await fn(rows);
    await writeJson(filePath(name), next);
    return result;
  });
}

export function newId(): string {
  return randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Resolve an upload file name to an absolute path, refusing anything that does
 * not sit directly inside public/uploads. Delete takes a name from a JSON row,
 * and a row could have been hand-edited to "../../src/app/page.tsx".
 */
export function resolveUpload(fileName: string): string | null {
  if (!fileName || fileName.includes("/") || fileName.includes("\\") || fileName.includes("\0")) {
    return null;
  }
  const resolved = path.resolve(UPLOAD_DIR, fileName);
  if (path.dirname(resolved) !== path.resolve(UPLOAD_DIR)) return null;
  return resolved;
}

export async function deleteUpload(fileName: string | null): Promise<void> {
  if (!fileName) return;
  const target = resolveUpload(fileName);
  if (!target) return;
  try {
    await unlink(target);
  } catch (error) {
    // A missing file is the desired end state. Anything else is worth a line.
    if (!isMissing(error)) console.error("[admin] Could not delete upload %s:", fileName, error);
  }
}

export async function saveUpload(originalName: string, bytes: Buffer): Promise<string> {
  await ensureDir(UPLOAD_DIR);
  const extension = path.extname(originalName).toLowerCase();
  const stem =
    path
      .basename(originalName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";
  const fileName = `${Date.now()}-${stem}${extension}`;
  const target = resolveUpload(fileName);
  if (!target) throw new StoreError("That file name cannot be used.", 400);
  try {
    await writeFile(target, bytes);
  } catch (error) {
    throw new StoreError("Could not write the file to public/uploads.", 500, { cause: error });
  }
  return fileName;
}
