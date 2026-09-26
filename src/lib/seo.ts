import type { Metadata } from "next";

import { getSite } from "@/lib/content";

/**
 * The address the site tells the world it lives at: every canonical link, Open
 * Graph URL, sitemap entry and JSON-LD reference is built from it.
 *
 * It used to be hard-coded to https://www.djimpex.in, which returns 404 -- the
 * domain is registered but not pointed at this deployment, and djimpex.in
 * itself redirects to an expired-subscription page on the old host. Every page
 * was therefore telling search engines that its canonical version lived at a
 * dead URL, which is enough on its own to keep the site out of an index, and
 * every shared link showed a broken preview image.
 *
 * So it is no longer a guess. NEXT_PUBLIC_SITE_URL wins when it is set, which
 * is what to use the moment the real domain is attached. Otherwise Vercel's own
 * production domain is used, which is always a URL that actually resolves.
 * Localhost is the last resort, for a plain checkout.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  // Set by Vercel to the project's production domain: the custom one once it is
  // attached, the .vercel.app one until then. The non-public name is safe here
  // because every caller is server-side (metadata, sitemap, robots, JSON-LD),
  // so this does not depend on the "expose system environment variables"
  // project setting being on.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  return "http://localhost:3001";
}

export const SITE_URL = resolveSiteUrl();

/** "{Page} | Nabeen® Luxury Fabrics by DJI" */
export function pageTitle(title: string): string {
  return `${title} | Nabeen® Luxury Fabrics by DJI`;
}

type BuildMetadata = {
  title: string;
  description: string;
  path: string;
  /** Absolute or root-relative image path for OG. Defaults to the route's own OG image. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  keywords,
}: BuildMetadata): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  // Routes share the branded card at /opengraph-image unless they pass their own.
  // Pointing at "{route}/opengraph-image" would 404 for every route without one.
  const ogImage = image ?? "/opengraph-image";

  return {
    // Absolute: pageTitle() has already applied the suffix, and the root layout's
    // template would otherwise append it a second time.
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Nabeen® Luxury Fabrics by DJI",
      locale: "en_NG",
      alternateLocale: ["en_IN"],
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Site-wide Organization JSON-LD, built from confirmed facts only. */
export function organizationJsonLd() {
  const site = getSite();
  const sameAs = site.social
    .filter((item) => item.status !== "hold" && item.url)
    .map((item) => item.url as string);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand.company.value,
    alternateName: site.brand.company.short,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logos/nabeen-logo-navy.png`,
    foundingDate: String(site.brand.founded.value),
    brand: {
      "@type": "Brand",
      name: "Nabeen",
    },
    areaServed: site.brand.markets.value,
    sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.contact.phonePrimary.e164,
        contactType: "sales",
        email: site.contact.emailPrimary.value,
        availableLanguage: ["en"],
      },
    ],
  };
}

export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
