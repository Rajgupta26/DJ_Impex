import { z } from "zod";

/**
 * Schema for brand-kit/content/site.json: the single source of truth for facts.
 *
 * Every fact carries a status:
 *   confirmed - use as-is
 *   tbc       - render it, but show the dev-only TBC tag when NEXT_PUBLIC_SHOW_TODO=true
 *   hold      - never render, in any environment
 */
export const statusSchema = z.enum(["confirmed", "tbc", "hold"]);
export type Status = z.infer<typeof statusSchema>;

const fact = <T extends z.ZodTypeAny>(value: T) =>
  z.object({
    value,
    status: statusSchema,
    source: z.string().optional(),
    note: z.string().optional(),
  });

export const siteSchema = z.object({
  brand: z.object({
    company: fact(z.string()).extend({ short: z.string() }),
    brand: fact(z.string()),
    logoTagline: fact(z.string()),
    tagline: fact(z.string()),
    brandPromiseSignoff: fact(z.string()),
    founded: fact(z.number()),
    starExportHouse: fact(z.string()),
    makeInIndia: fact(z.boolean()),
    designsCount: fact(z.string()),
    markets: fact(z.string()),
  }),
  contact: z.object({
    phonePrimary: z.object({
      display: z.string(),
      e164: z.string(),
      status: statusSchema,
      note: z.string().optional(),
    }),
    phoneSecondary: z.object({
      display: z.string(),
      e164: z.string(),
      status: statusSchema,
      note: z.string().optional(),
    }),
    whatsapp: z.object({
      e164: z.string(),
      prefill: z.string(),
      status: statusSchema,
      note: z.string().optional(),
    }),
    emailPrimary: fact(z.string()),
    emailAdmin: fact(z.string()),
    emailSecondary: fact(z.string()),
    address: z.object({
      lines: z.array(z.string()),
      mapsQuery: z.string(),
      status: statusSchema,
      note: z.string().optional(),
    }),
    website: fact(z.string().url()),
  }),
  brandFilm: z.object({
    _note: z.string().optional(),
    status: statusSchema,
    source: z.string().url(),
    caption: z.string(),
    /** Filenames inside public/video. The section falls back to a placeholder
        until the client sends the file. */
    file: z.string(),
    poster: z.string(),
  }),
  wear2care: z.object({
    _note: z.string().optional(),
    status: statusSchema,
    recipients: z.string(),
    photos: z.array(z.object({ file: z.string(), alt: z.string() })),
  }),
  social: z.array(
    z.object({
      name: z.string(),
      handle: z.string().nullable(),
      url: z.string().url().nullable(),
      status: statusSchema,
      note: z.string().optional(),
    }),
  ),
  navigation: z.array(z.object({ label: z.string(), href: z.string() })),
  trustMarks: z.array(z.object({ label: z.string(), status: statusSchema })),
  ratings: z.object({
    googleRating: z.object({
      value: z.string().nullable(),
      candidates: z.array(z.string()),
      status: statusSchema,
      note: z.string().optional(),
    }),
    happyCustomers: z.object({
      value: z.string().nullable(),
      status: statusSchema,
      note: z.string().optional(),
    }),
  }),
  testimonials: z.object({
    _note: z.string().optional(),
    items: z.array(
      z.object({
        quote: z.string(),
        name: z.string().nullable(),
        role: z.string(),
        status: statusSchema,
      }),
    ),
  }),
  fabricTypes: z.object({
    _note: z.string().optional(),
    status: statusSchema,
    items: z.array(
      z.object({
        slug: z.string(),
        name: z.string(),
        line: z.string(),
        highlight: z.string().optional(),
      }),
    ),
  }),
  signatureLines: z.object({
    _note: z.string().optional(),
    status: statusSchema,
    fourLines: z.array(z.object({ name: z.string(), products: z.array(z.string()) })),
    brochurePairs2023: z.array(z.string()),
  }),
  popup: z.object({
    _note: z.string().optional(),
    status: statusSchema,
    line: z.string(),
    cta: z.string(),
    delaySeconds: z.number(),
  }),
  values: z.array(z.string()),
  socialCause: z.object({
    headline: z.string(),
    body: z.string(),
    campaign: z.string(),
    percentage: z.object({
      value: z.string().nullable(),
      status: statusSchema,
      note: z.string().optional(),
    }),
    status: statusSchema,
  }),
});

export type Site = z.infer<typeof siteSchema>;
export type FabricType = Site["fabricTypes"]["items"][number];
export type Testimonial = Site["testimonials"]["items"][number];
export type SocialLink = Site["social"][number];
export type TrustMark = Site["trustMarks"][number];
export type NavItem = Site["navigation"][number];

/** True when a fact may be rendered at all. `hold` facts never render. */
export function isVisible(status: Status): boolean {
  return status !== "hold";
}

/** Keep only the items whose status is not `hold`. */
export function visible<T extends { status: Status }>(items: readonly T[]): T[] {
  return items.filter((item) => isVisible(item.status));
}
