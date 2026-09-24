import { NextResponse } from "next/server";
import { z } from "zod";

import { StoreError } from "./store";

/** File-backed routes must never be cached or prerendered. */
export const dynamic = "force-dynamic";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400, fieldErrors?: Record<string, string>) {
  return NextResponse.json({ error: message, fieldErrors }, { status });
}

/**
 * One place that turns a thrown thing into a response.
 * A store failure carries its own status; anything else is a real bug, so it is
 * logged in full and reported without its internals.
 */
export function handleError(scope: string, error: unknown) {
  if (error instanceof StoreError) {
    console.error("[admin:%s] %s", scope, error.message, error.cause ?? "");
    return fail(error.message, error.status);
  }
  console.error("[admin:%s] unexpected failure:", scope, error);
  return fail("Something went wrong on the server.", 500);
}

/** Validate a JSON body, returning either the value or a 400 with field errors. */
export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<{ data: T; response?: never } | { data?: never; response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { response: fail("Expected a JSON body.", 400) };
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { response: fail("Please check the highlighted fields.", 400, fieldErrors) };
  }
  return { data: result.data };
}
