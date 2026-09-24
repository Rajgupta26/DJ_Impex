import "server-only";

import { createReadStream } from "node:fs";
import { mkdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import { VersionConflict, type StorageDriver, type StoredDoc, type StoredMedia } from "./driver";

/**
 * The local filesystem: data/*.json for documents, public/uploads for media.
 * This is what runs in development and on any host with a real disk.
 *
 * Writes go to a sibling temp file and are renamed over the target, because
 * rename(2) is atomic within a filesystem. A writeFile interrupted half way
 * leaves truncated JSON, which loses a collection rather than a row.
 *
 * The version is the file's modification time and size. It is not as strong as
 * an ETag -- two writes inside the same millisecond that produce the same
 * length would compare equal -- but it catches the case that matters, an edit
 * made against a document that has since been rewritten.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function isMissing(error: unknown): boolean {
  return (error as NodeJS.ErrnoException | null)?.code === "ENOENT";
}

function docPath(key: string): string {
  // Keys look like "collections/blogs.json"; only the basename is used.
  return path.join(DATA_DIR, path.basename(key));
}

/** Refuse anything that is not a plain name directly inside the uploads folder. */
export function safeMediaPath(name: string): string | null {
  if (!name || name.includes("/") || name.includes("\\") || name.includes("\0")) return null;
  const resolved = path.resolve(UPLOAD_DIR, name);
  if (path.dirname(resolved) !== path.resolve(UPLOAD_DIR)) return null;
  return resolved;
}

async function versionOf(target: string): Promise<string | null> {
  try {
    const info = await stat(target);
    return `${info.mtimeMs}-${info.size}`;
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

async function writeAtomic(target: string, body: Buffer | string): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(temp, body);
    await rename(temp, target);
  } catch (error) {
    await unlink(temp).catch(() => {});
    throw error;
  }
}

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export const fileSystemDriver: StorageDriver = {
  label: "the local file system",
  writable: true,

  async readDoc(key) {
    const target = docPath(key);
    try {
      const text = await readFile(target, "utf8");
      return { text, version: await versionOf(target) };
    } catch (error) {
      if (isMissing(error)) return null;
      throw error;
    }
  },

  async writeDoc(key, text, expected) {
    const target = docPath(key);
    if (expected !== null && (await versionOf(target)) !== expected) throw new VersionConflict();
    await writeAtomic(target, text);
  },

  async readMedia(name): Promise<StoredMedia | null> {
    const target = safeMediaPath(name);
    if (!target) return null;
    try {
      await stat(target);
    } catch (error) {
      if (isMissing(error)) return null;
      throw error;
    }
    return {
      stream: Readable.toWeb(createReadStream(target)) as ReadableStream<Uint8Array>,
      contentType: CONTENT_TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream",
    };
  },

  async writeMedia(name, bytes) {
    const target = safeMediaPath(name);
    if (!target) throw new Error("That file name cannot be used.");
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeAtomic(target, bytes);
  },

  async deleteMedia(name) {
    const target = safeMediaPath(name);
    if (!target) return;
    try {
      await unlink(target);
    } catch (error) {
      // A missing file is the desired end state.
      if (!isMissing(error)) throw error;
    }
  },
};

export type { StoredDoc };
