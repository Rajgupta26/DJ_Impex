"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useId, useState, useSyncExternalStore } from "react";

import { withReg } from "@/components/ui/Reg";

export type ProductSwatch = {
  id?: string;
  name: string;
  image: string;
};

export type CollectionLine = {
  number: string;
  name: string;
  description: string;
  products: ProductSwatch[];
};

export const SIGNATURE_COLLECTIONS: CollectionLine[] = [
  {
    number: "01",
    name: "Nabeen Classic",
    description:
      "Refined everyday fabrics designed for effortless style, versatile tailoring, and all-day comfort.",
    products: [
      { id: "nabeen-classic-oscar", name: "Oscar", image: "/images/gallery/04-charcoal-herringbone.jpg" },
      { id: "nabeen-classic-fantasy", name: "Fantasy", image: "/images/gallery/02-taupe-dobby.jpg" },
      { id: "nabeen-classic-delicacy", name: "Delicacy™", image: "/images/gallery/07-blush-stripe.jpg" },
      { id: "nabeen-classic-excelsor", name: "Excelsor", image: "/images/gallery/06-mint-dobby.jpg" },
      { id: "nabeen-classic-spencer", name: "Spencer", image: "/images/gallery/10-slate-rib.jpg" },
      { id: "nabeen-classic-golden-arc", name: "Golden Arc", image: "/images/gallery/05-camel-check-jacquard.jpg" },
      { id: "nabeen-classic-four-corners", name: "Four Corners", image: "/images/gallery/08-champagne-check.jpg" },
    ],
  },
  {
    number: "02",
    name: "Nabeen Royale",
    description:
      "The Royale collection represents the finest expression of Nabeen — crafted for those who appreciate distinction, quality and timeless style.",
    products: [
      { id: "nabeen-royale-star-rose", name: "Star Rose", image: "/images/gallery/swatch-star-rose.jpg" },
      { id: "nabeen-royale-mark-polo", name: "Mark Polo", image: "/images/gallery/swatch-mark-polo.jpg" },
      { id: "nabeen-royale-cotton-house-giza", name: "Cotton House Egyptian Giza", image: "/images/gallery/03-white-jacquard.jpg" },
      { id: "nabeen-royale-silver-rock", name: "Silver Rock", image: "/images/gallery/swatch-silver-rock.jpg" },
      { id: "nabeen-royale-sicora-luxe-harrier", name: "Sicora, Luxe and Harrier", image: "/images/gallery/09-sky-circle-jacquard.jpg" },
      { id: "nabeen-royale-president-vp", name: "President & Vice President", image: "/images/gallery/swatch-president.jpg" },
    ],
  },
  {
    number: "03",
    name: "Nabeen Luxuré",
    description:
      "Sophisticated contemporary weaves, premium wool blends, and international craftsmanship for discerning connoisseurs.",
    products: [
      { id: "nabeen-luxure-zare-nx", name: "Zare NX", image: "/images/gallery/01-aqua-jacquard.jpg" },
      { id: "nabeen-luxure-trident", name: "Trident", image: "/images/gallery/04-charcoal-herringbone.jpg" },
      { id: "nabeen-luxure-morocco", name: "Morocco", image: "/images/gallery/05-camel-check-jacquard.jpg" },
      { id: "nabeen-luxure-gold-pearl", name: "Gold Pearl", image: "/images/gallery/08-champagne-check.jpg" },
      { id: "nabeen-luxure-lenova-zx", name: "Lenova ZX", image: "/images/gallery/02-taupe-dobby.jpg" },
      { id: "nabeen-luxure-millionaire", name: "Millionaire", image: "/images/gallery/swatch-president.jpg" },
      { id: "nabeen-luxure-switzerland-look", name: "Switzerland Look", image: "/images/gallery/03-white-jacquard.jpg" },
      { id: "nabeen-luxure-australian-wool", name: "Australian, Turkish Wool", image: "/images/gallery/swatch-silver-rock.jpg" },
    ],
  },
  {
    number: "04",
    name: "Nabeen White",
    description:
      "The pinnacle of white luxury fabrics, from immaculate Egyptian Giza cotton to intricate jacquard weaves.",
    products: [
      { id: "nabeen-white-white-fantasy", name: "Fantasy", image: "/images/gallery/swatch-white-fantasy.jpg" },
      { id: "nabeen-white-white-marconi", name: "Marconi", image: "/images/gallery/swatch-white-marconi.jpg" },
      { id: "nabeen-white-white-silver-rock", name: "Silver Rock", image: "/images/gallery/swatch-white-silver-rock.jpg" },
      { id: "nabeen-white-white-vice-president", name: "Vice President", image: "/images/brand-imagery/white-fabric-closing.jpg" },
      { id: "nabeen-white-president-plain-giza", name: "President Plain Giza", image: "/images/gallery/03-white-jacquard.jpg" },
    ],
  },
];

export function SignatureLines({
  lines,
  images,
}: {
  lines?: { name: string; products: string[] }[];
  images?: Record<string, { src: string; alt?: string; title?: string }>;
}) {
  const isDesktop = useMediaQuery("(min-width: 64rem)");
  const [open, setOpen] = useState(1); // Default to 02 Nabeen Royale
  const id = useId();
  const reduceMotion = useReducedMotion();

  const collections = SIGNATURE_COLLECTIONS.map((col) => ({
    ...col,
    products: col.products.map((prod) => ({
      ...prod,
      name: prod.id && images?.[prod.id]?.title?.trim() ? images[prod.id].title!.trim() : prod.name,
      image: prod.id && images?.[prod.id]?.src ? images[prod.id].src : prod.image,
    })),
  }));

  const activeCollection = collections[open] ?? collections[0];

  if (isDesktop) {
    return (
      <div className="grid grid-cols-[21rem_1fr] gap-10 lg:gap-14">
        {/* Left Tab List */}
        <div
          role="tablist"
          aria-label="Signature Collections"
          className="flex flex-col gap-2.5 border-r border-line/70 pr-8"
        >
          {collections.map((line, index) => {
            const isSelected = index === open;
            return (
              <button
                key={line.name}
                type="button"
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={isSelected}
                aria-controls={`${id}-panel-${index}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setOpen(index)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
                  event.preventDefault();
                  const next =
                    event.key === "ArrowDown"
                      ? (open + 1) % SIGNATURE_COLLECTIONS.length
                      : (open - 1 + SIGNATURE_COLLECTIONS.length) % SIGNATURE_COLLECTIONS.length;
                  setOpen(next);
                  document.getElementById(`${id}-tab-${next}`)?.focus();
                }}
                className={`group relative flex w-full items-center justify-between rounded-xl px-5 py-4 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-slate-200/50 shadow-sm border border-slate-300/60"
                    : "hover:bg-slate-200/30 text-slate-600 hover:text-navy"
                }`}
              >
                {/* Active left indicator bar */}
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-navy"
                  />
                )}

                <div className="flex items-center gap-4">
                  <span
                    className={`font-sans text-xs font-semibold tracking-wider transition-colors ${
                      isSelected ? "text-navy" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {line.number}
                  </span>
                  <span
                    className={`block font-sans text-lg sm:text-xl font-normal leading-tight transition-colors ${
                      isSelected ? "font-medium text-navy-deep" : "text-navy group-hover:text-navy-deep"
                    }`}
                  >
                    {withReg(line.name)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Panel */}
        <div className="min-h-[22rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={open}
              role="tabpanel"
              id={`${id}-panel-${open}`}
              aria-labelledby={`${id}-tab-${open}`}
              tabIndex={0}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotateX: -12, y: 10 }
              }
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, rotateX: 12, y: -10 }
              }
              transition={{ duration: reduceMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 800, transformOrigin: "top center" }}
            >
              <div className="border-b border-line/70 pb-4">
                <h3 className="font-sans text-2xl sm:text-3xl text-navy-deep font-normal tracking-tight">
                  {withReg(activeCollection.name)}
                </h3>
                <p className="mt-2 text-sm sm:text-[15px] font-light leading-relaxed text-slate-600 max-w-2xl">
                  {activeCollection.description}
                </p>
              </div>

              {/* Swatch Grid */}
              <div className="mt-6 grid grid-cols-2 gap-4 lg:gap-5">
                {activeCollection.products.map((product) => (
                  <SwatchCard key={product.name} product={product} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Mobile / Tablet Responsive Layout
  return (
    <div className="space-y-4">
      {/* Mobile Horizontal Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {collections.map((line, index) => (
          <button
            key={line.name}
            type="button"
            onClick={() => setOpen(index)}
            aria-pressed={index === open}
            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm transition-all cursor-pointer font-sans font-normal ${
              index === open
                ? "bg-navy text-white shadow-sm font-medium"
                : "bg-white/80 text-slate-700 border border-line hover:bg-white"
            }`}
          >
            <span className="font-sans text-xs opacity-75">{line.number}</span>
            <span>{withReg(line.name)}</span>
          </button>
        ))}
      </div>

      {/* Mobile Active Collection Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={open}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-line/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-5"
        >
          <div className="border-b border-line pb-3">
            <h3 className="font-sans text-2xl text-navy-deep font-normal mt-0.5">
              {withReg(activeCollection.name)}
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 font-light leading-relaxed">
              {activeCollection.description}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activeCollection.products.map((product) => (
              <SwatchCard key={product.name} product={product} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SwatchCard({ product }: { product: ProductSwatch }) {
  return (
    <div className="group relative flex items-center gap-3.5 rounded-lg border border-line/80 bg-white/90 p-3 shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-slate-400 hover:bg-white hover:shadow-md cursor-pointer">
      {/* Fabric Swatch Thumbnail with contrast border and framing */}
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border border-slate-300/90 bg-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:h-16 sm:w-24">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 80px, 96px"
          quality={88}
          className="object-cover transition-transform duration-300 group-hover:scale-105 brightness-[0.98] contrast-[1.04]"
        />
      </div>

      {/* Swatch Name (Open Sans Normal, no subheadings, no arrow) */}
      <div className="min-w-0 flex-1">
        <h4 className="break-words font-sans text-base sm:text-lg font-normal text-navy-deep transition-colors group-hover:text-navy">
          {withReg(product.name)}
        </h4>
      </div>
    </div>
  );
}

/** SSR renders the phone layout; desktop takes over on hydration. */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
