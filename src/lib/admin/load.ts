import "server-only";

import { readCollection, StoreError, type CollectionName } from "./store";

/**
 * A page-friendly read: never throws, so the page can decide what to render
 * without wrapping JSX in a try/catch (which would not catch render errors
 * anyway, only the read).
 */
export async function loadCollection<N extends CollectionName>(
  name: N,
): Promise<
  { ok: true; rows: Awaited<ReturnType<typeof readCollection<N>>> } | { ok: false; message: string }
> {
  try {
    return { ok: true, rows: await readCollection(name) };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof StoreError ? error.message : `data/${name}.json could not be read.`,
    };
  }
}
