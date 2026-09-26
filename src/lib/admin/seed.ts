import { getGalleryImages } from "@/lib/content";

import type { AdminBlog, AdminEnquiry, AdminImage } from "./schemas";

/**
 * Starting rows, written the first time a collection is read.
 *
 * The images are read from public/images/gallery, so the panel starts with a
 * row for every swatch on the site and each one can be edited or removed. The three posts mirror the
 * MDX in brand-kit/content/journal, so nothing here invents a claim about the
 * business; they are seeded as drafts because the journal itself is still built
 * from the MDX files, not from this panel. The enquiries are sample rows and are
 * meant to be deleted once real ones arrive.
 */

export function imageSeed(): AdminImage[] {
  const uploadedAt = "2026-09-24T09:00:00.000Z";

  // Read from the folder rather than a hand-written list, so the panel starts
  // out holding a row for every swatch the site actually ships with. A
  // hard-coded subset meant the gallery showed ten tiles while the panel listed
  // four of them, and the six it did not list could not be managed at all.
  return getGalleryImages().map((image) => ({
    id: `img-${image.src.replace(/^.*\//, "").replace(/\.[^.]+$/, "")}`,
    src: image.src,
    title: image.name,
    alt: image.alt,
    category: "",
    caption: "",
    usage: "gallery" as const,
    // Null: the file is part of the project, not something this panel wrote, so
    // deleting the row hides the tile and leaves the file alone.
    fileName: null,
    sizeBytes: null,
    uploadedAt,
  }));
}

export function blogSeed(): AdminBlog[] {
  const updatedAt = "2026-09-24T09:00:00.000Z";
  return [
    {
      id: "blog-identify-lace",
      slug: "how-to-identify-high-quality-lace-fabric",
      category: "Guide",
      title: "How to identify high-quality lace fabric",
      excerpt:
        "Not all lace is created equal. Here is what to check in the base, the embroidery and the weight before you buy.",
      content:
        "## Start with the base\n\nHold the piece to the light. A fine base is even, with no thin patches between motifs.\n\n## Then the embroidery\n\nRun a thumb across the stitching. Good embroidery sits flat and does not catch.\n\n## Finally the weight\n\nWeight tells you how the fabric will hang once it is cut.",
      coverImage: "/images/gallery/03-white-jacquard.jpg",
      author: "Nabeen editorial",
      publishedDate: "2026-09-21",
      status: "draft",
      updatedAt,
    },
    {
      id: "blog-swiss-lace-guide",
      slug: "swiss-lace-complete-guide-for-african-fashion",
      category: "Reference",
      title: "Swiss lace: a complete guide for African fashion",
      excerpt:
        "Why Swiss lace is prized for senator wear, agbada and kaftans, and what separates a fine piece from an ordinary one.",
      content:
        "## What makes it Swiss\n\nThe name describes a method and a standard of finishing, not only an origin.\n\n## Why it suits a warm climate\n\nAn open base moves air while the embroidery carries the structure.",
      coverImage: "/images/gallery/09-sky-circle-jacquard.jpg",
      author: "Nabeen editorial",
      publishedDate: "2026-09-21",
      status: "draft",
      updatedAt,
    },
    {
      id: "blog-nigeria-lace-2026",
      slug: "best-mens-lace-fabrics-in-nigeria-2026",
      category: "Market guide",
      title: "Best men's lace fabrics in Nigeria (2026 guide)",
      excerpt:
        "Austrian, Swiss and cotton-based embroidered lace: what sets each apart, and what to look for when you choose.",
      content:
        "## The three families\n\nEach behaves differently once it is tailored.\n\n## Choosing between them\n\nStart from the garment, then work back to the cloth.",
      coverImage: "/images/gallery/08-champagne-check.jpg",
      author: "Nabeen editorial",
      publishedDate: "2026-09-21",
      status: "draft",
      updatedAt,
    },
  ];
}

export function enquirySeed(): AdminEnquiry[] {
  return [
    {
      id: "enq-sample-1",
      name: "Sample enquiry, Lagos",
      email: "sample.lagos@example.com",
      subject: "Swiss lace, wholesale quantities",
      message:
        "Sample row. Please send your current Swiss lace range with minimum order quantities for Lagos.",
      date: "2026-09-22T11:20:00.000Z",
      status: "unread",
    },
    {
      id: "enq-sample-2",
      name: "Sample enquiry, Dubai",
      email: "sample.dubai@example.com",
      subject: "Jacquard shirting, retail",
      message: "Sample row. Interested in jacquard shirting for a retail store. What is available?",
      date: "2026-09-20T07:05:00.000Z",
      status: "read",
    },
    {
      id: "enq-sample-3",
      name: "Sample enquiry, Mumbai",
      email: "sample.mumbai@example.com",
      subject: "Visit to the Mangaldas Market office",
      message: "Sample row. Would like to visit the office this week to see swatches in person.",
      date: "2026-09-18T15:40:00.000Z",
      status: "replied",
    },
  ];
}
