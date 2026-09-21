import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

import { parseDoc, type ParsedDoc } from "@/lib/markdown";
import { siteSchema, type Site } from "@/lib/site";

/**
 * Every fact and every line of copy is read from brand-kit/content at build time.
 * Nothing is duplicated into a component: change a content file, and the site changes.
 */
const CONTENT_DIR = path.join(process.cwd(), "brand-kit", "content");
const JOURNAL_DIR = path.join(CONTENT_DIR, "journal");

function read(file: string): string {
  return fs.readFileSync(file, "utf8");
}

let siteCache: Site | null = null;

/** The facts file, validated. A schema failure stops the build, which is the point. */
export function getSite(): Site {
  if (siteCache) return siteCache;
  const raw = JSON.parse(read(path.join(CONTENT_DIR, "site.json")));
  const parsed = siteSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`brand-kit/content/site.json failed validation:\n${z.prettifyError(parsed.error)}`);
  }
  siteCache = parsed.data;
  return siteCache;
}

export type PageSlug = "home" | "about" | "vision" | "nabeen" | "nabeen-x-ali-nuhu" | "contact";

const pageCache = new Map<PageSlug, ParsedDoc>();

/** A page brief from brand-kit/content/{slug}.md, parsed into sections and fields. */
export function getPage(slug: PageSlug): ParsedDoc {
  const cached = pageCache.get(slug);
  if (cached) return cached;
  const doc = parseDoc(matter(read(path.join(CONTENT_DIR, `${slug}.md`))).content);
  pageCache.set(slug, doc);
  return doc;
}

/* ---- The Fabric Journal --------------------------------------------------- */

export const postFrontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  suggestedTitle: z.string().optional(),
  titleStatus: z.enum(["confirmed", "tbc", "hold"]).optional(),
  slug: z.string(),
  excerpt: z.string(),
  category: z.string(),
  publishedAt: z.string(),
  dateStatus: z.enum(["confirmed", "tbc", "hold"]).optional(),
  coverImage: z.string(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
  }),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type Post = PostFrontmatter & {
  body: string;
  readingMinutes: number;
};

let postsCache: Post[] | null = null;

/** All journal posts, newest first. */
export function getPosts(): Post[] {
  if (postsCache) return postsCache;
  const files = fs.readdirSync(JOURNAL_DIR).filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const { data, content } = matter(read(path.join(JOURNAL_DIR, file)));
    const parsed = postFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `brand-kit/content/journal/${file} frontmatter failed validation:\n${z.prettifyError(parsed.error)}`,
      );
    }
    if (parsed.data.slug !== file.replace(/\.mdx$/, "")) {
      throw new Error(`brand-kit/content/journal/${file}: slug "${parsed.data.slug}" does not match the filename.`);
    }
    return {
      ...parsed.data,
      body: content,
      readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    } satisfies Post;
  });

  posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));
  postsCache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

/**
 * The title to render. Where the client's title is flagged `tbc` and a better one
 * is suggested in the frontmatter, we keep the client's and surface the suggestion
 * on /_todo rather than silently rewriting their words.
 */
export function postTitle(post: Post): string {
  return post.title;
}
