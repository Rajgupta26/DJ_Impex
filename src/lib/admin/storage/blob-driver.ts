import "server-only";

import { BlobNotFoundError, BlobPreconditionFailedError, del, get, put } from "@vercel/blob";

import { VersionConflict, type StorageDriver, type StoredMedia } from "./driver";

/**
 * Vercel Blob: the store that survives a deploy.
 *
 * The site runs on Vercel, whose filesystem is read-only outside /tmp and
 * rebuilt on every push, so the filesystem driver cannot hold anything there.
 * This driver keeps the same shape -- JSON documents and image files -- in a
 * private Blob store instead.
 *
 * Two details that matter:
 *
 *  - `useCache: false` on every read. Blob serves through a CDN by default, and
 *    an admin panel that shows a stale list after a save is worse than a slow
 *    one. Writes set cacheControlMaxAge to 0 for the same reason.
 *
 *  - Documents are written with `ifMatch`, so a write fails rather than
 *    silently overwriting an edit made since the read. That is genuine
 *    compare-and-swap across instances, which no in-process lock can provide.
 *
 * The store is private: nothing here is readable without the token. Uploaded
 * images reach the browser through /media, which streams them deliberately.
 */

const MEDIA_PREFIX = "uploads/";

/**
 * `get` hands back a weak validator (`W/"abc"`) for a blob the CDN may have
 * cached, while `head` and `ifMatch` use the strong one (`"abc"`). The hash is
 * the same; only the form differs. Left as read, every conditional write is
 * rejected with an ETag mismatch, which the store then reports as a collection
 * being edited too fast to save -- so this strips the prefix on the way in and
 * the version a caller holds is always the strong form.
 */
function strongEtag(etag: string): string {
  return etag.replace(/^W\//, "");
}

function mediaKey(name: string): string | null {
  if (!name || name.includes("/") || name.includes("\\") || name.includes("\0")) return null;
  return `${MEDIA_PREFIX}${name}`;
}

export const blobDriver: StorageDriver = {
  label: "Vercel Blob",
  writable: true,

  async readDoc(key) {
    try {
      // get resolves to null for a missing blob on some paths and throws
      // BlobNotFoundError on others, so both are handled.
      const result = await get(key, { access: "private", useCache: false });
      if (!result || result.statusCode !== 200) return null;
      return {
        text: await new Response(result.stream).text(),
        version: strongEtag(result.blob.etag),
      };
    } catch (error) {
      if (error instanceof BlobNotFoundError) return null;
      throw error;
    }
  },

  async writeDoc(key, text, expected) {
    try {
      await put(key, text, {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
        // No expected version means "this document should not exist yet", which
        // is the seeding path. Two instances seeding at once write the same
        // bytes, so letting both through is harmless.
        ...(expected === null ? {} : { ifMatch: expected }),
      });
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) throw new VersionConflict();
      throw error;
    }
  },

  async readMedia(name): Promise<StoredMedia | null> {
    const key = mediaKey(name);
    if (!key) return null;
    try {
      const result = await get(key, { access: "private" });
      if (!result || result.statusCode !== 200) return null;
      return { stream: result.stream, contentType: result.blob.contentType };
    } catch (error) {
      if (error instanceof BlobNotFoundError) return null;
      throw error;
    }
  },

  async writeMedia(name, bytes, contentType) {
    const key = mediaKey(name);
    if (!key) throw new Error("That file name cannot be used.");
    await put(key, bytes, {
      access: "private",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  },

  async deleteMedia(name) {
    const key = mediaKey(name);
    if (!key) return;
    try {
      await del(key);
    } catch (error) {
      // Already gone is the desired end state.
      if (!(error instanceof BlobNotFoundError)) throw error;
    }
  },
};
