import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CLAUDE.md here is the client brief, not a generated file.
  agentRules: false,
  // A stray package-lock.json sits above this folder; pin the root to this project.
  turbopack: { root: __dirname },
  // The overlay sits exactly where the floating actions do; it hides review screenshots.
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 only serves qualities declared here. 88 is the hero and page-hero
    // photography; 75 is the default for everything else.
    qualities: [75, 88],
  },
  poweredByHeader: false,
};

export default nextConfig;
