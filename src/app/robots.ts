import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The TBC checklist and the admin panel are for the team, not for search
      // engines. /admin also sends a noindex header of its own.
      disallow: ["/_todo", "/admin", "/api/admin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
