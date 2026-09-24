import "server-only";

/**
 * The storage contract behind the admin panel.
 *
 * Two implementations: the local filesystem, and Vercel Blob. The panel does
 * not know which one it is talking to.
 *
 * Documents carry a `version`. A write states the version it expects to
 * overwrite, and the driver refuses if the stored document has moved on. That
 * is what makes concurrent edits safe on a host that runs several instances,
 * where an in-process lock protects nothing.
 */

export type StoredDoc = {
  text: string;
  /** Opaque: an ETag on Blob, null when the document does not exist yet. */
  version: string | null;
};

export type StoredMedia = {
  stream: ReadableStream<Uint8Array>;
  contentType: string;
};

export interface StorageDriver {
  /** Named in error messages and on the dashboard, so the operator knows where the data is. */
  readonly label: string;
  /** Whether writes are expected to work here at all. */
  readonly writable: boolean;

  readDoc(key: string): Promise<StoredDoc | null>;
  /** Throws VersionConflict when `expected` no longer matches what is stored. */
  writeDoc(key: string, text: string, expected: string | null): Promise<void>;

  readMedia(name: string): Promise<StoredMedia | null>;
  writeMedia(name: string, bytes: Buffer, contentType: string): Promise<void>;
  deleteMedia(name: string): Promise<void>;
}

/** Raised by writeDoc when another writer got there first. `mutate` retries. */
export class VersionConflict extends Error {
  constructor() {
    super("The document changed while this edit was in flight.");
    this.name = "VersionConflict";
  }
}
