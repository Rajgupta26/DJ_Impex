import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The TBC checklist is for the team, not for search engines.
      disallow: ["/_todo"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
