import "server-only";

import type { AdminBlog } from "./schemas";

/**
 * The fields the blog editor no longer asks for.
 *
 * Slug, excerpt and author were removed from the form at the agency's request.
 * Slug and excerpt are still needed -- one is the post's URL, the other is its
 * card summary, the standfirst on the post page and its meta description -- so
 * they are worked out here instead of being left empty.
 */

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/**
 * A slug nobody else is using, suffixed if the obvious one is taken.
 *
 * The writer cannot edit the slug any more, so a second post called "Swiss
 * lace" must not fail with a message about a field that is not on screen.
 */
export function uniqueSlug(rows: AdminBlog[], base: string, excludeId?: string): string {
  const taken = new Set(rows.filter((row) => row.id !== excludeId).map((row) => row.slug));
  const root = base || "post";
  if (!taken.has(root)) return root;
  for (let n = 2; n < 1000; n += 1) {
    const candidate = `${root}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${root}-${Date.now()}`;
}

/**
 * The first real paragraph of the post, for the card and the meta description.
 *
 * Headings, list markers, quote markers and inline emphasis are stripped, so
 * the summary reads as prose rather than as Markdown. Cut on a word boundary:
 * a description ending mid-word looks broken in a search result.
 */
export function deriveExcerpt(content: string, limit = 200): string {
  const paragraph = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#"));

  if (!paragraph) return "";

  const text = paragraph
    .replace(/^[>\-*]\s+/gm, "")
    .replace(/^\d+[.)]\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/[*`_]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : limit).trimEnd()}…`;
}
