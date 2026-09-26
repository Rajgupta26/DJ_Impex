"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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
    description:
      "High-grade spun cotton engineered for breathability, softness, and crisp garment silhouettes.",
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
    description:
      "Intricate geometric and floral openwork motifs designed for regal and celebratory occasions.",
  },
  {
    id: "atiku",
    name: "Atiku",
    image: "/images/gallery/02-taupe-dobby.jpg",
    alt: "Nabeen Atiku dobby woven fabric",
    weave: "Structured Dobby Weave",
    description:
      "Signature textured cotton renowned in West African couture for its crisp finish and rich body.",
  },
  {
    id: "voile",
    name: "Voile",
    image: "/images/gallery/06-mint-dobby.jpg",
    alt: "Nabeen Voile lightweight cloth",
    weave: "Airy Sheer Plain Weave",
    description:
      "Lightweight, sheer fabric engineered for warm climates, offering continuous cooling comfort.",
  },
  {
    id: "brocade",
    name: "Brocade",
    image: "/images/gallery/05-camel-check-jacquard.jpg",
    alt: "Nabeen Brocade rich check jacquard fabric",
    weave: "Embossed Jacquard Twill",
    description:
      "Opulent woven pattern with subtle luster and substantial hand, perfect for statement traditional wear.",
  },
  {
    id: "giza",
    name: "Giza",
    image: "/images/gallery/08-champagne-check.jpg",
    alt: "Nabeen Giza Egyptian cotton fabric",
    weave: "Extra-Long Staple Cotton",
    description:
      "Spun from prestigious Giza Egyptian cotton fibers for peerless luster, strength, and softness.",
  },
];

function resolveFabricItem(name: string, index: number): FabricItem {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const match = FABRIC_COLLECTION.find(
    (item) => item.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized,
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
  /**
   * Slot id to image, from lib/slots, so the photographs paired with each
   * fabric can be replaced from the admin panel. Anything not overridden falls
   * back to the picture this file ships with.
   */
  images?: Record<string, { src: string; alt: string }>;
}

export function FabricHoverShowcase({
  names,
  collectionLead,
  collectionTail,
  images,
}: FabricHoverShowcaseProps) {
  const items = names.map((name, idx) => {
    const item = resolveFabricItem(name, idx);
    const replacement = images?.[`fabric-${item.id}`];
    return replacement ? { ...item, image: replacement.src, alt: replacement.alt } : item;
  });
  const [activeItem, setActiveItem] = useState<FabricItem>(items[0] || FABRIC_COLLECTION[0]);
  const reduceMotion = useReducedMotion();
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeItem.id),
  );
  const stackItems = Array.from(
    { length: Math.min(5, Math.max(0, items.length - 1)) },
    (_, index) => items[(activeIndex + index + 1) % items.length],
  );
  const baseFabric = stackItems[stackItems.length - 1] || activeItem;

  const handleSelect = (item: FabricItem) => {
    setActiveItem(item);
  };

  return (
    <div className="mt-16 lg:mt-20">
      <div className="grid gap-x-12 lg:grid-cols-[6.5fr_5.5fr] lg:gap-x-14 xl:gap-x-16">
        {/* Row 1: Collection Lead on Left, empty spacer on Right */}
        <div className="lg:col-start-1">
          <p className="text-slate">{collectionLead}</p>
        </div>
        <div className="hidden lg:col-start-2 lg:block" aria-hidden="true" />

        {/* Row 2, Col 1: The 8 Fabric Words (Suiting to Giza) */}
        <div className="mt-5 lg:col-start-1 lg:row-start-2">
          <div role="tablist" aria-label="Nabeen fabric collections" className="border-line border-b">
            {items.map((item, index) => {
              const isActive = activeItem.id === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={0}
                  initial={reduceMotion ? false : { opacity: 0, x: -42 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={
                    reduceMotion
                      ? { duration: 0.01 }
                      : {
                          duration: 0.68,
                          delay: index * 0.12,
                          ease: [0.22, 0.61, 0.36, 1],
                        }
                  }
                  onMouseEnter={() => handleSelect(item)}
                  onFocus={() => handleSelect(item)}
                  onClick={() => handleSelect(item)}
                  className={`group border-line focus-visible:ring-accent relative flex min-h-[4.5rem] w-full items-center gap-4 border-t py-2 pl-4 text-left transition-all duration-300 ease-out focus-visible:ring-1 focus-visible:outline-none sm:min-h-20 sm:py-2 ${
                    isActive ? "text-navy font-normal" : "text-navy/65 hover:text-navy"
                  }`}
                >
                  {/* Active indicator bar in Selvedge Blue */}
                  <span
                    className={`bg-accent absolute top-1/2 left-0 w-[3px] -translate-y-1/2 transition-all duration-300 ease-out ${
                      isActive ? "h-7 opacity-100" : "h-0 opacity-0 group-hover:h-3.5 group-hover:opacity-60"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Each ticket gets a real vertical cutting before its name. */}
                  <span
                    className={`relative h-14 w-12 shrink-0 overflow-hidden border transition-all duration-300 ease-out sm:h-16 sm:w-14 ${
                      isActive
                        ? "border-accent shadow-[0_0_0_2px_rgb(95_149_221_/_0.18)]"
                        : "border-line group-hover:border-navy/45"
                    }`}
                    aria-hidden="true"
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </span>

                  <span
                    className={`t-h3 inline-block min-w-0 text-[clamp(1.25rem,1rem+0.9vw,1.7rem)] font-light tracking-tight transition-[color,transform] duration-200 ease-out group-hover:-translate-x-1 group-focus:-translate-x-1 ${
                      isActive
                        ? "bg-clip-text text-transparent [text-shadow:0_1px_1px_rgb(13_23_51_/_0.2)]"
                        : "text-inherit"
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundImage: `linear-gradient(rgb(13 23 51 / 0.18), rgb(13 23 51 / 0.18)), url(${item.image})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                          }
                        : undefined
                    }
                  >
                    {item.name}
                  </span>

                  {/* Micro visual cue: arrow that guides attention to the right-hand image */}
                  <span
                    className={`ml-auto flex items-center gap-1.5 font-mono text-xs tracking-wider transition-all duration-300 ${
                      isActive
                        ? "text-accent translate-x-0 opacity-100"
                        : "text-slate/40 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                    }`}
                    aria-hidden="true"
                  >
                    <span className="hidden sm:inline">VIEW</span>
                    <span>→</span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Row 2, Col 2: One hero cutting overlaps five subtle fabric layers. */}
        <div className="mt-8 flex flex-col lg:col-start-2 lg:row-start-2 lg:mt-5">
          <div className="border-line/60 bg-mist relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-2xl border sm:aspect-[16/11] lg:aspect-auto lg:h-[clamp(32rem,47vw,40rem)] lg:min-h-0">
            <div className="bg-mist relative min-h-0 w-full flex-1 overflow-hidden">
              {/* A full cloth base fills the rounded overlap gaps behind every layer. */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={baseFabric.id}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                  transition={
                    reduceMotion ? { duration: 0.01 } : { duration: 0.58, ease: [0.22, 0.61, 0.36, 1] }
                  }
                  className="absolute inset-0"
                  aria-hidden="true"
                >
                  <Image
                    src={baseFabric.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-white/10" />
                </motion.div>
              </AnimatePresence>

              {/* Five cuts sit beneath the active cloth, exposing only a 2% edge each. */}
              {stackItems.map((item, index) => (
                <AnimatePresence key={`fabric-layer-${index}`} initial={false}>
                  <motion.div
                    key={item.id}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -5 }}
                    transition={
                      reduceMotion ? { duration: 0.01 } : { duration: 0.52, ease: [0.22, 0.61, 0.36, 1] }
                    }
                    className="bg-navy-deep absolute inset-y-0 hidden w-[calc(2%+7px)] overflow-hidden rounded-l-lg border-l border-white/40 lg:block"
                    style={{
                      right: `${(stackItems.length - index - 1) * 2}%`,
                      zIndex: stackItems.length - index,
                    }}
                    aria-hidden="true"
                  >
                    <Image src={item.image} alt="" fill sizes="4vw" className="object-cover" />
                    <div className="bg-navy-deep/15 absolute inset-0" />
                  </motion.div>
                </AnimatePresence>
              ))}

              <AnimatePresence initial={false}>
                <motion.div
                  key={activeItem.id}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 1.015 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12, scale: 0.99 }}
                  transition={
                    reduceMotion ? { duration: 0.01 } : { duration: 0.62, ease: [0.22, 0.61, 0.36, 1] }
                  }
                  className="absolute inset-y-0 right-0 left-0 z-10 h-full overflow-hidden rounded-xl ring-1 ring-white/30 lg:right-[10%]"
                >
                  <Image
                    src={activeItem.image}
                    alt={activeItem.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 45vw, 550px"
                    className="object-cover"
                    priority
                  />

                  {/* Caption & Weave information */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white [text-shadow:0_1px_8px_rgb(13_23_51_/_0.8)] sm:p-7">
                    <div className="text-accent flex items-center justify-between font-mono text-xs tracking-wider uppercase">
                      <span>{activeItem.weave}</span>
                      <span className="text-white/60">NABEEN® COLLECTION</span>
                    </div>
                    <h3 className="t-h3 mt-1.5 text-2xl font-light text-white sm:text-3xl">
                      {activeItem.name}
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-white/85">{activeItem.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
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
