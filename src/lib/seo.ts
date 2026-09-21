import type { Metadata } from "next";

import { getSite } from "@/lib/content";

export const SITE_URL = "https://www.djimpex.in";

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
  const ogImage = image ?? `${path === "/" ? "" : path}/opengraph-image`;

  return {
    title,
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
