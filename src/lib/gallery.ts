import "server-only";

import { getGalleryImages, type GalleryImage } from "@/lib/content";
import { readCollection } from "@/lib/admin/store";

/**
 * The World of Nabeen tiles: the swatches that ship with the site, followed by
 * anything uploaded through the admin panel.
 *
 * The shipped set is curated and stays first, so uploading does not reshuffle
 * the grid the agency laid out. Only panel uploads marked as gallery images are
 * appended: a cover uploaded from the blog editor shares this library but is
 * not a swatch. The seeded rows point at files already in
 * public/images/gallery and would otherwise appear twice.
 */
export async function getGalleryTiles(): Promise<GalleryImage[]> {
  const shipped = getGalleryImages();
  const taken = new Set(shipped.map((image) => image.src));

  let uploaded: GalleryImage[] = [];
  try {
    uploaded = (await readCollection("images"))
      .filter((image) => image.usage === "gallery" && image.fileName && !taken.has(image.src))
      .map((image) => ({ src: image.src, name: image.title, alt: image.alt }));
  } catch (error) {
    // The home page is not worth failing over a gallery addition.
    console.error("[gallery] Could not read images from the admin store:", error);
  }

  return [...shipped, ...uploaded];
}
