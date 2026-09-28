/**
 * Shrink an image in the browser before it is uploaded.
 *
 * Vercel refuses a request body over about 4.5MB and does so in front of the
 * route, so the reply is plain text and the panel could only report "the server
 * returned 413". A photograph straight off a phone is routinely 5-12MB, which
 * made uploading one impossible and unexplainable at the same time.
 *
 * Resizing here fixes both ends of that. The upload fits comfortably inside the
 * limit, and the site stops being handed 12-megapixel originals it would only
 * scale down to a few hundred pixels anyway.
 *
 * Anything already small enough is passed through untouched, so an image
 * prepared properly by a designer is not re-encoded and degraded.
 */

/** Comfortably inside Vercel's ~4.5MB body limit, leaving room for the form. */
const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;

/** Bigger than any slot on the site, and still sharp on a 2x display. */
const MAX_EDGE = 2400;

export type PreparedImage = { file: File; resized: boolean; from: number; to: number };

export async function prepareImage(file: File): Promise<PreparedImage> {
  const original = file.size;

  // Vector and animated formats do not survive a canvas round trip, and GIFs
  // would lose their animation. Leave them alone and let the server decide.
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) {
    return { file, resized: false, from: original, to: original };
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // An unreadable image is the server's problem to report, not this helper's.
    return { file, resized: false, from: original, to: original };
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const needsWork = scale < 1 || original > MAX_UPLOAD_BYTES;
  if (!needsWork) {
    bitmap.close();
    return { file, resized: false, from: original, to: original };
  }

  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return { file, resized: false, from: original, to: original };
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // WebP first: it keeps transparency, which a PNG logo needs, and is smaller
  // than JPEG at the same quality. Safari and older browsers that cannot encode
  // it hand back null or a PNG, so JPEG is the fallback for photographs.
  const webp = await toBlob(canvas, "image/webp", 0.86);
  const jpeg = webp ? null : await toBlob(canvas, "image/jpeg", 0.86);
  const chosen = webp ?? jpeg;

  if (!chosen || chosen.size >= original) {
    // Re-encoding made it no smaller, so the original is the better upload --
    // unless it is too big to send at all, in which case it is still worth a try
    // and the server will explain itself.
    return { file, resized: false, from: original, to: original };
  }

  const extension = chosen.type === "image/webp" ? "webp" : "jpg";
  const stem = file.name.replace(/\.[^.]*$/, "") || "image";
  const next = new File([chosen], `${stem}.${extension}`, { type: chosen.type });
  return { file: next, resized: true, from: original, to: next.size };
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob && blob.type === type ? blob : null), type, quality);
  });
}

/** "4.2MB", for telling someone what just happened to their file. */
export function mb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
