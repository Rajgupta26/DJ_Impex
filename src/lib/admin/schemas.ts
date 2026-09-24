import { z } from "zod";

/**
 * The shapes stored in /data/*.json.
 *
 * Every read is validated against these, so a hand-edited file that has drifted
 * fails loudly at the API boundary instead of silently rendering undefined all
 * over the panel.
 */

const isoDate = z.string().min(4, "Please use a date.");

export const imageSchema = z.object({
  id: z.string(),
  /** Web path under /public, e.g. "/uploads/1712-swiss-lace.jpg". */
  src: z.string().min(1),
  title: z.string().trim().min(1, "Please add a title.").max(120),
  alt: z.string().trim().min(1, "Alt text is required.").max(240),
  category: z.string().trim().max(60).default(""),
  caption: z.string().trim().max(400).default(""),
  /** Set only for files this panel wrote, so delete knows what it may remove. */
  fileName: z.string().nullable().default(null),
  sizeBytes: z.number().int().nonnegative().nullable().default(null),
  uploadedAt: isoDate,
});

export const blogSchema = z.object({
  id: z.string(),
  slug: z
    .string()
    .trim()
    .min(1, "Please add a slug.")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lower case letters, numbers and hyphens only."),
  title: z.string().trim().min(1, "Please add a title.").max(160),
  excerpt: z.string().trim().max(400).default(""),
  /** Shown above the title on the published post, beside the reading time. */
  category: z.string().trim().max(60).default(""),
  content: z.string().default(""),
  coverImage: z.string().trim().default(""),
  author: z.string().trim().max(80).default(""),
  publishedDate: isoDate,
  status: z.enum(["draft", "published"]).default("draft"),
  updatedAt: isoDate,
});

export const enquirySchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().max(160).default(""),
  subject: z.string().trim().max(200).default(""),
  message: z.string().trim().max(4000).default(""),
  date: isoDate,
  status: z.enum(["unread", "read", "replied"]).default("unread"),
});

export type AdminImage = z.infer<typeof imageSchema>;
export type AdminBlog = z.infer<typeof blogSchema>;
export type AdminEnquiry = z.infer<typeof enquirySchema>;

export type BlogStatus = AdminBlog["status"];
export type EnquiryStatus = AdminEnquiry["status"];

export const BLOG_STATUSES: readonly BlogStatus[] = ["draft", "published"];
export const ENQUIRY_STATUSES: readonly EnquiryStatus[] = ["unread", "read", "replied"];

/** The fields a client may send when creating or editing. Ids and stamps are ours. */
export const imagePatchSchema = imageSchema
  .pick({ title: true, alt: true, category: true, caption: true })
  .partial();

export const blogInputSchema = blogSchema.omit({ id: true, updatedAt: true });
export const blogPatchSchema = blogInputSchema.partial();

export const enquiryPatchSchema = enquirySchema.pick({ status: true }).partial();

export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
