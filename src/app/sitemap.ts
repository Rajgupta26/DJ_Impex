import type { MetadataRoute } from "next";

import { getJournalPosts } from "@/lib/journal";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Core public marketing pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/nabeen`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/nabeen-x-ali-nuhu`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/journal`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // All published journal articles (MDX + admin published posts)
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getJournalPosts();
    postEntries = posts.map((post) => {
      let lastModified = now;
      if (post.publishedAt) {
        const parsed = new Date(post.publishedAt);
        if (!isNaN(parsed.getTime())) {
          lastModified = parsed;
        }
      }

      return {
        url: `${SITE_URL}/journal/${post.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });
  } catch (err) {
    console.error("[sitemap] Failed to load journal posts:", err);
  }

  return [...staticPages, ...postEntries];
}
