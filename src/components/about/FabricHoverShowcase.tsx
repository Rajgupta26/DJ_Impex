"use client";

import Image from "next/image";
import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { withReg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";

export interface FabricItem {
  id: string;
  name: string;
  image: string;
  alt: string;
  weave: string;
  description: string;
}

export const FABRIC_COLLECTION: FabricItem[] = [
  {
    id: "suiting",
    name: "Suiting",
    image: "/images/gallery/04-charcoal-herringbone.jpg",
    alt: "Nabeen Suiting fabric in charcoal herringbone broken twill weave",
    weave: "Wool-Touch Broken Twill",
    description: "Substantial drape and structured weave tailored for ceremonial and formal suiting.",
  },
  {
    id: "cotton-shirting",
    name: "Cotton Shirting",
    image: "/images/gallery/07-blush-stripe.jpg",
    alt: "Nabeen Cotton Shirting fabric in blush stripe crisp weave",
    weave: "Long-Staple Crisp Weave",
    description: "High-grade spun cotton engineered for breathability, softness, and crisp garment silhouettes.",
  },
  {
    id: "swiss-voile",
    name: "Swiss Voile",
    image: "/images/gallery/03-white-jacquard.jpg",
    alt: "Nabeen Swiss Voile fabric in fine white jacquard weave",
    weave: "High-Twist Fine Jacquard",
    description: "Ultra-fine yarn counts producing a featherweight, silky hand feel with graceful drape.",
  },
  {
    id: "lace",
    name: "Lace",
    image: "/images/gallery/01-aqua-jacquard.jpg",
    alt: "Nabeen Lace textured jacquard cloth",
    weave: "Textured Openwork Jacquard",
    description: "Intricate geometric and floral openwork motifs designed for regal and celebratory occasions.",
  },
  {
    id: "atiku",
    name: "Atiku",
    image: "/images/gallery/02-taupe-dobby.jpg",
    alt: "Nabeen Atiku dobby woven fabric",
    weave: "Structured Dobby Weave",
    description: "Signature textured cotton renowned in West African couture for its crisp finish and rich body.",
  },
  {
    id: "voile",
    name: "Voile",
    image: "/images/gallery/06-mint-dobby.jpg",
    alt: "Nabeen Voile lightweight cloth",
    weave: "Airy Sheer Plain Weave",
    description: "Lightweight, sheer fabric engineered for warm climates, offering continuous cooling comfort.",
  },
  {
    id: "brocade",
    name: "Brocade",
    image: "/images/gallery/05-camel-check-jacquard.jpg",
    alt: "Nabeen Brocade rich check jacquard fabric",
    weave: "Embossed Jacquard Twill",
    description: "Opulent woven pattern with subtle luster and substantial hand, perfect for statement traditional wear.",
  },
  {
    id: "giza",
    name: "Giza",
    image: "/images/gallery/08-champagne-check.jpg",
    alt: "Nabeen Giza Egyptian cotton fabric",
    weave: "Extra-Long Staple Cotton",
    description: "Spun from prestigious Giza Egyptian cotton fibers for peerless luster, strength, and softness.",
  },
];

function resolveFabricItem(name: string, index: number): FabricItem {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const match = FABRIC_COLLECTION.find(
    (item) => item.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized
  );
  if (match) return match;

  return {
    id: `fabric-${index}`,
    name,
    image: "/images/gallery/09-sky-circle-jacquard.jpg",
    alt: `Nabeen ${name} luxury fabric`,
    weave: "Meticulous Weave",
    description: "Curated textile representing high standards of quality, comfort, and timeless elegance.",
  };
}

interface FabricHoverShowcaseProps {
  names: string[];
  collectionLead: string;
  collectionTail: string;
}

export function FabricHoverShowcase({
  names,
  collectionLead,
  collectionTail,
}: FabricHoverShowcaseProps) {
  const items = names.map((name, idx) => resolveFabricItem(name, idx));
  const [activeItem, setActiveItem] = useState<FabricItem>(items[0] || FABRIC_COLLECTION[0]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleSelect = (item: FabricItem) => {
    setHasInteracted(true);
    setActiveItem(item);
  };

  return (
    <div className="mt-16 lg:mt-20">
      <div className="grid gap-x-12 lg:grid-cols-[7fr_5fr] lg:gap-x-16 xl:gap-x-20">
        {/* Row 1: Collection Lead on Left, empty spacer on Right */}
        <div className="lg:col-start-1">
          <p className="text-slate">{collectionLead}</p>
        </div>
        <div className="hidden lg:block lg:col-start-2" aria-hidden="true" />

        {/* Row 2, Col 1: The 8 Fabric Words (Suiting to Giza) */}
        <div className="mt-5 lg:col-start-1 lg:row-start-2">
          <div
            role="tablist"
            aria-label="Nabeen fabric collections"
            className="border-b border-line"
          >
            {items.map((item) => {
              const isActive = activeItem.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  onMouseEnter={() => handleSelect(item)}
                  onFocus={() => handleSelect(item)}
                  onClick={() => handleSelect(item)}
                  className={`group relative flex w-full items-center justify-between border-t border-line py-5 text-left transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                    isActive
                      ? "pl-4 text-navy font-normal"
                      : "pl-0 text-navy/65 hover:pl-2.5 hover:text-navy"
                  }`}
                >
                  {/* Active indicator bar in Selvedge Blue */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] bg-accent transition-all duration-300 ease-out ${
                      isActive
                        ? "h-7 opacity-100"
                        : "h-0 opacity-0 group-hover:h-3.5 group-hover:opacity-60"
                    }`}
                    aria-hidden="true"
                  />

                  <span className="t-h3 text-[clamp(1.15rem,0.95rem+0.75vw,1.55rem)] font-light tracking-tight">
                    {item.name}
                  </span>

                  {/* Micro visual cue: arrow that guides attention to the right-hand image */}
                  <span
                    className={`flex items-center gap-1.5 text-xs font-mono tracking-wider transition-all duration-300 ${
                      isActive
                        ? "text-accent translate-x-0 opacity-100"
                        : "text-slate/40 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                    }`}
                    aria-hidden="true"
                  >
                    <span className="hidden sm:inline">VIEW</span>
                    <span>→</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2, Col 2: The Image Stage - Only animates on actual user interaction */}
        <div className="mt-8 lg:mt-5 lg:col-start-2 lg:row-start-2 flex flex-col">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-0 overflow-hidden bg-navy-deep border border-line/60 flex flex-col">
            <div className="relative flex-1 w-full min-h-0 overflow-hidden bg-navy-deep">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={hasInteracted && !reduceMotion ? { opacity: 0, x: 36 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  exit={hasInteracted && !reduceMotion ? { opacity: 0, x: -18 } : undefined}
                  transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={activeItem.image}
                    alt={activeItem.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 45vw, 550px"
                    className="object-cover"
                    priority
                  />

                  {/* Gradient overlay for readability */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent"
                    aria-hidden="true"
                  />

                  {/* Caption & Weave information */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 text-white">
                    <div className="flex items-center justify-between text-xs tracking-wider uppercase text-accent font-mono">
                      <span>{activeItem.weave}</span>
                      <span className="text-white/60">NABEEN® COLLECTION</span>
                    </div>
                    <h3 className="t-h3 mt-1.5 text-white font-light text-2xl sm:text-3xl">
                      {activeItem.name}
                    </h3>
                    <p className="mt-2 text-sm text-white/85 max-w-md">
                      {activeItem.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Selvedge Blue bottom hairline accent */}
            <div className="h-[2px] w-full bg-accent" aria-hidden="true" />
          </div>
        </div>

        {/* Row 3: Collection Tail beneath the fabric list */}
        <div className="mt-6 pt-2 lg:col-start-1 lg:row-start-3">
          <p className="text-slate">{collectionTail}</p>
        </div>
      </div>
    </div>
  );
}
