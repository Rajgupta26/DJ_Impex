import type { MetadataRoute } from "next";

import { getPosts, getSite } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Deduplicated and filtered: exclude hash anchors like /#journal from sitemap XML
  const hrefs = [
    ...new Set(
      ["/", ...getSite().navigation.map((item) => item.href)].filter(
        (href) => !href.startsWith("/#"),
      ),
    ),
  ];

  const pages = hrefs.map((href) => ({
    url: href === "/" ? SITE_URL : `${SITE_URL}${href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: href === "/" ? 1 : 0.8,
  }));

  const posts = getPosts().map((post) => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    lastModified: post.dateStatus === "tbc" ? now : new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
