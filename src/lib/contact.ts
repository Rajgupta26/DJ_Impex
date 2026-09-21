import { getSite } from "@/lib/content";

/**
 * The only place contact URLs are built. Never hard-code a number, an address
 * or a wa.me link in a component: every channel comes from site.json through here,
 * so changing the facts file changes every link on the site.
 */

export type WhatsAppLocation =
  | "hero"
  | "floating"
  | "popup"
  | "fabric_card"
  | "enquiry_band"
  | "gallery"
  | "header"
  | "footer"
  | "menu"
  | "contact_page"
  | "form_fallback"
  | "cause";

/** https://wa.me/{number}?text={prefill} */
export function whatsappLink(prefill?: string): string {
  const { whatsapp } = getSite().contact;
  const text = prefill?.trim() || whatsapp.prefill;
  return `https://wa.me/${whatsapp.e164}?text=${encodeURIComponent(text)}`;
}

/** The prefilled message for an enquiry about one named fabric. */
export function fabricPrefill(fabricName: string): string {
  return `Hello Nabeen team, I would like to know more about your ${fabricName} fabrics.`;
}

export function telLink(): string {
  return `tel:${getSite().contact.phonePrimary.e164}`;
}

export function mailtoLink(subject?: string): string {
  const email = getSite().contact.emailPrimary.value;
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

export function directionsLink(): string {
  const { mapsQuery } = getSite().contact.address;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`;
}

/** A static, keyless map placeholder target for the click-to-load map on /contact. */
export function mapPlaceLink(): string {
  const { mapsQuery } = getSite().contact.address;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
}

export function mapEmbedSrc(): string {
  const { mapsQuery } = getSite().contact.address;
  return `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`;
}

export function addressOneLine(): string {
  return getSite().contact.address.lines.join(", ");
}
