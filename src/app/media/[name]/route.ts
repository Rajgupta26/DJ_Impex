import { storage } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

/**
 * Serves an image uploaded through the admin panel.
 *
 * It exists because the Blob store is private: nothing in it is reachable
 * without the token, and the token stays on the server. This route is the one
 * deliberate opening, and it only ever reads a single file name under the
 * uploads prefix -- never a document, never a path with a separator in it.
 *
 * It sits outside /admin on purpose. These are website images, and the
 * next/image optimiser fetches them server-side without the browser's
 * credentials, so putting them behind the admin password would break every
 * thumbnail the moment one was set.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  let media;
  try {
    media = await storage().readMedia(decodeURIComponent(name));
  } catch (error) {
    console.error("[media] Could not read %s:", name, error);
    return new Response("Not available.", { status: 500 });
  }

  if (!media) return new Response("Not found.", { status: 404 });

  return new Response(media.stream, {
    headers: {
      "content-type": media.contentType,
      // The file name carries a timestamp and is never rewritten, so this is
      // safe to cache hard. A replacement gets a new name and a new URL.
      "cache-control": "public, max-age=31536000, immutable",
      "content-disposition": "inline",
      "x-content-type-options": "nosniff",
    },
  });
}
