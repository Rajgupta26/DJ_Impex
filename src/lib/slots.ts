import "server-only";

import { readCollection } from "@/lib/admin/store";

/**
 * The image slots in the design that the panel may replace.
 *
 * A slot is a position, not a picture: the hero's backdrop, the photograph
 * beside the brief, the image paired with a fabric in the collection. Each one
 * ships with a default that lives in the repository, and the panel can put a
 * different image in it or put the original back.
 *
 * This is deliberately not the same as the gallery. A gallery swatch can be
 * deleted because the grid simply gets shorter; a slot cannot, because the
 * design has a hole where it was. So slots are replaced and reverted, never
 * emptied.
 *
 * Adding a slot is a code change on purpose. The registry is what tells the
 * panel that a position exists, what it is called and where it appears, and
 * none of that can be inferred from an image path.
 */

export type ImageSlot = {
  id: string;
  label: string;
  /** Where it shows up, in the words someone editing the site would use. */
  where: string;
  defaultSrc: string;
  defaultAlt: string;
  /** What shape the replacement wants to be. */
  hint: string;
};

export const IMAGE_SLOTS: readonly ImageSlot[] = [
  {
    id: "home-hero",
    label: "Home hero backdrop",
    where: "Home page, behind the headline",
    defaultSrc: "/video/nabeen-marconi.jpg",
    defaultAlt: "Marconi by Nabeen: white jacquard shirting in raking light",
    hint: "Wide landscape. It sits behind white text, so a darker or evener image reads best.",
  },
  {
    id: "home-brief",
    label: "Home brief photograph",
    where: "Home page, beside “A house of cloth since 1995”",
    defaultSrc: "/images/gallery/05-camel-check-jacquard.jpg",
    defaultAlt: "Camel check jacquard fabric",
    hint: "Roughly square.",
  },
  {
    id: "about-hero",
    label: "About page banner",
    where: "About DJI, at the top",
    defaultSrc: "/images/hero/spinning-frames.jpg",
    defaultAlt: "Spinning frames drawing cotton into yarn",
    hint: "Wide landscape, and evenly lit: the page title sits over it.",
  },
  // One per fabric in the collection showcase. The names come from the copy in
  // about.md; these are the photographs paired with them.
  fabricSlot("suiting", "Suiting", "/images/gallery/04-charcoal-herringbone.jpg", "Nabeen Suiting fabric"),
  fabricSlot(
    "giza-cotton",
    "Giza Cotton",
    "/images/gallery/07-blush-stripe.jpg",
    "Nabeen Giza Cotton fabric",
  ),
  fabricSlot(
    "swiss-voile",
    "Swiss Voile",
    "/images/gallery/03-white-jacquard.jpg",
    "Nabeen Swiss Voile fabric",
  ),
  fabricSlot("lace", "Lace", "/images/gallery/01-aqua-jacquard.jpg", "Nabeen Lace fabric"),
  fabricSlot("atiku", "Atiku", "/images/gallery/02-taupe-dobby.jpg", "Nabeen Atiku fabric"),
  fabricSlot("voile", "Voile", "/images/gallery/06-mint-dobby.jpg", "Nabeen Voile fabric"),
  fabricSlot("brocade", "Brocade", "/images/gallery/05-camel-check-jacquard.jpg", "Nabeen Brocade fabric"),
  fabricSlot("cashmere", "Cashmere", "/images/gallery/08-champagne-check.jpg", "Nabeen Cashmere fabric"),
  fabricSlot("wool", "Wool", "/images/gallery/09-sky-circle-jacquard.jpg", "Nabeen Wool fabric"),

  // 01 Nabeen Classic
  signatureSlot("classic", "Nabeen Classic", "oscar", "Oscar", "/images/gallery/04-charcoal-herringbone.jpg"),
  signatureSlot("classic", "Nabeen Classic", "fantasy", "Fantasy", "/images/gallery/02-taupe-dobby.jpg"),
  signatureSlot("classic", "Nabeen Classic", "delicacy", "Delicacy™", "/images/gallery/07-blush-stripe.jpg"),
  signatureSlot("classic", "Nabeen Classic", "excelsor", "Excelsor", "/images/gallery/06-mint-dobby.jpg"),
  signatureSlot("classic", "Nabeen Classic", "spencer", "Spencer", "/images/gallery/10-slate-rib.jpg"),
  signatureSlot("classic", "Nabeen Classic", "golden-arc", "Golden Arc", "/images/gallery/05-camel-check-jacquard.jpg"),
  signatureSlot("classic", "Nabeen Classic", "four-corners", "Four Corners", "/images/gallery/08-champagne-check.jpg"),

  // 02 Nabeen Royale
  signatureSlot("royale", "Nabeen Royale", "star-rose", "Star Rose", "/images/gallery/swatch-star-rose.jpg"),
  signatureSlot("royale", "Nabeen Royale", "mark-polo", "Mark Polo", "/images/gallery/swatch-mark-polo.jpg"),
  signatureSlot("royale", "Nabeen Royale", "cotton-house-giza", "Cotton House Egyptian Giza", "/images/gallery/03-white-jacquard.jpg"),
  signatureSlot("royale", "Nabeen Royale", "silver-rock", "Silver Rock", "/images/gallery/swatch-silver-rock.jpg"),
  signatureSlot("royale", "Nabeen Royale", "sicora-luxe-harrier", "Sicora, Luxe and Harrier", "/images/gallery/09-sky-circle-jacquard.jpg"),
  signatureSlot("royale", "Nabeen Royale", "president-vp", "President & Vice President", "/images/gallery/swatch-president.jpg"),

  // 03 Nabeen Luxuré
  signatureSlot("luxure", "Nabeen Luxuré", "zare-nx", "Zare NX", "/images/gallery/01-aqua-jacquard.jpg"),
  signatureSlot("luxure", "Nabeen Luxuré", "trident", "Trident", "/images/gallery/04-charcoal-herringbone.jpg"),
  signatureSlot("luxure", "Nabeen Luxuré", "morocco", "Morocco", "/images/gallery/05-camel-check-jacquard.jpg"),
  signatureSlot("luxure", "Nabeen Luxuré", "gold-pearl", "Gold Pearl", "/images/gallery/08-champagne-check.jpg"),
  signatureSlot("luxure", "Nabeen Luxuré", "lenova-zx", "Lenova ZX", "/images/gallery/02-taupe-dobby.jpg"),
  signatureSlot("luxure", "Nabeen Luxuré", "millionaire", "Millionaire", "/images/gallery/swatch-president.jpg"),
  signatureSlot("luxure", "Nabeen Luxuré", "switzerland-look", "Switzerland Look", "/images/gallery/03-white-jacquard.jpg"),
  signatureSlot("luxure", "Nabeen Luxuré", "australian-wool", "Australian, Turkish Wool", "/images/gallery/swatch-silver-rock.jpg"),

  // 04 Nabeen White
  signatureSlot("white", "Nabeen White", "white-fantasy", "Fantasy", "/images/gallery/swatch-white-fantasy.jpg"),
  signatureSlot("white", "Nabeen White", "white-marconi", "Marconi", "/images/gallery/swatch-white-marconi.jpg"),
  signatureSlot("white", "Nabeen White", "white-silver-rock", "Silver Rock", "/images/gallery/swatch-white-silver-rock.jpg"),
  signatureSlot("white", "Nabeen White", "white-vice-president", "Vice President", "/images/brand-imagery/white-fabric-closing.jpg"),
  signatureSlot("white", "Nabeen White", "president-plain-giza", "President Plain Giza", "/images/gallery/03-white-jacquard.jpg"),

  // Wear2Care × Ali Nuhu
  {
    id: "wear2care-hero",
    label: "Wear2Care hero banner",
    where: "Wear2Care × Ali Nuhu page, at the top",
    defaultSrc: "/images/wear2care/handover.jpg",
    defaultAlt: "Representatives gathered for the Wear2Care x Ali Nuhu charity donation, beneath the campaign banner",
    hint: "Wide landscape photograph (16:9 or similar). It sits behind the page title.",
  },
  {
    id: "wear2care-donation-1",
    label: "Handover photograph",
    where: "Wear2Care × Ali Nuhu page, left image in Luxury That Gives Back",
    defaultSrc: "/images/wear2care/handover.jpg",
    defaultAlt: "Representatives gathered for the Wear2Care x Ali Nuhu charity donation, beneath the campaign banner",
    hint: "4:3 landscape photograph showing the handover event.",
  },
  {
    id: "wear2care-donation-2",
    label: "Donated supplies photograph",
    where: "Wear2Care × Ali Nuhu page, right image in Luxury That Gives Back",
    defaultSrc: "/images/wear2care/donation.jpg",
    defaultAlt: "Food and household supplies donated through Wear2Care x Ali Nuhu, stacked beneath the campaign banner",
    hint: "4:3 landscape photograph showing the donated goods.",
  },
] as const;

function fabricSlot(id: string, name: string, defaultSrc: string, defaultAlt: string): ImageSlot {
  return {
    id: `fabric-${id}`,
    label: `Collection: ${name}`,
    where: "Home page, “Our exclusive collection”",
    defaultSrc,
    defaultAlt,
    hint: "Portrait or square. It is shown as a tall panel.",
  };
}

function signatureSlot(
  lineId: string,
  lineName: string,
  productSlug: string,
  productName: string,
  defaultSrc: string,
): ImageSlot {
  return {
    id: `nabeen-${lineId}-${productSlug}`,
    label: `${lineName}: ${productName}`,
    where: `Nabeen page → ${lineName}`,
    defaultSrc,
    defaultAlt: `${lineName} - ${productName} fabric swatch`,
    hint: "Fabric swatch thumbnail.",
  };
}

export type ResolvedSlot = ImageSlot & {
  src: string;
  alt: string;
  /** True when the panel has put something else in this slot. */
  replaced: boolean;
};

/**
 * Every slot with whatever image is actually in it.
 *
 * A failed read falls back to the defaults, so a page keeps its design rather
 * than losing its images because a store was unreachable.
 */
export async function resolveSlots(): Promise<ResolvedSlot[]> {
  let overrides = new Map<string, { src: string; alt: string }>();
  try {
    overrides = new Map(
      (await readCollection("slots")).map((row) => [row.id, { src: row.src, alt: row.alt }]),
    );
  } catch (error) {
    console.error("[slots] Could not read the replacements, using the defaults:", error);
  }

  return IMAGE_SLOTS.map((slot) => {
    const override = overrides.get(slot.id);
    return {
      ...slot,
      src: override?.src ?? slot.defaultSrc,
      alt: override?.alt || slot.defaultAlt,
      replaced: Boolean(override),
    };
  });
}

/** The slots as a lookup, for a page that wants two or three of them by id. */
export async function slotMap(): Promise<Record<string, ResolvedSlot>> {
  return Object.fromEntries((await resolveSlots()).map((slot) => [slot.id, slot]));
}
