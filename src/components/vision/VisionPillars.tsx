"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import type { ListItem } from "@/lib/markdown";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";

/**
 * The five pillars, hung on a warp thread and woven in as the reader arrives.
 *
 * The brief is explicit that these are five equal pillars and not a sequence, so
 * they are never numbered. The thread and the swatches do the work a number
 * would have done: they mark each pillar and tie the five together as one cloth.
 *
 * The marks were drawn weaves on a navy chip and read as five dark squares at
 * that size. They are cut from the real cloth now -- the house's own gallery
 * photographs, the same files the swatch grid on the home page uses.
 *
 * The swatch is decoration, not a claim: the cloth beside a pillar says nothing
 * about what that pillar means. The five were chosen for tone, so the run steps
 * dark, pale, mid, light down the page, and they are all blues, greys and
 * whites -- the camel, blush and champagne pieces would have brought a second
 * hue onto a page that is meant to be blue.
 *
 * The rail is aria-hidden, so these carry an empty alt: they are ornament, and
 * announcing five fabric names inside a list of values would only be noise.
 */
const SWATCHES = [
  "/images/gallery/04-charcoal-herringbone.jpg",
  "/images/gallery/09-sky-circle-jacquard.jpg",
  "/images/gallery/01-aqua-jacquard.jpg",
  "/images/gallery/10-slate-rib.jpg",
  "/images/gallery/03-white-jacquard.jpg",
];

/**
 * The cascade: a swatch opens, its heading arrives, the paragraph comes in from
 * the right, and the thread draws down to the next swatch, five times over.
 *
 * It runs from one trigger on the list rather than one per pillar. At desktop
 * widths the whole list is about four fifths of a screen, so triggering each
 * pillar on its own would fire all five at once and there would be no cascade at
 * all. On a phone the list is nearer one and a half screens, so the last pillars
 * may finish before the reader reaches them -- which is the harmless direction:
 * an animation you miss leaves the words simply present.
 *
 * The trigger waits for a quarter of the list, rather than firing early the way
 * the home page's reveals do. The list starts about 90px below the fold at
 * 1280x820, so an early trigger fired on load and the whole cascade played out
 * while the reader was still looking at the opening panel. A quarter of the list
 * means the first pillar is already on screen when its swatch opens.
 *
 * Reading words held at part opacity is what went wrong on the home page
 * (question 99). The guard here is not an early trigger but a short run: the
 * last paragraph has arrived 2.7s after the first swatch opens, and every
 * pillar's own text is done 0.7s after its turn begins.
 */
const STEP = 0.5; // seconds between one pillar and the next
const EASE = [0.22, 0.61, 0.36, 1] as const;

export function VisionPillars({
  heading,
  items,
}: {
  heading: string;
  items: ListItem[];
}) {
  const reduceMotion = useReducedMotion();

  /** Reduced motion keeps the staging but takes out the movement and the wait. */
  const step = (index: number, offset: number, duration: number) => ({
    duration: reduceMotion ? 0.01 : duration,
    delay: reduceMotion ? 0 : index * STEP + offset,
    ease: EASE,
  });

  const swatchVariants = {
    hidden: { clipPath: reduceMotion ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" },
    visible: (index: number) => ({
      clipPath: "inset(0 0 0% 0)",
      transition: step(index, 0, 0.38),
    }),
  };

  const headingVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 12 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: step(index, 0.14, 0.3),
    }),
  };

  const textVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : 40 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: step(index, 0.26, 0.42),
    }),
  };

  const threadVariants = {
    hidden: { scaleY: reduceMotion ? 1 : 0 },
    visible: (index: number) => ({
      scaleY: 1,
      transition: step(index, 0.42, 0.48),
    }),
  };

  return (
        /* The opening panel is full bleed and ends on a hard edge, so this section
       does not also need a full --spacing-section above its heading: the two
       together left a band of empty white between the panel and the pillars.
       The foot is trimmed for the same reason -- the enquiry band below opens
       with 104px of its own. */
    <section className="bg-white pb-16 pt-12 lg:pb-20 lg:pt-16">
      <Container>
        <h2 className="t-h2 max-w-[18ch]">{withReg(heading)}</h2>

        <motion.ul
          className="mt-14 lg:mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {items.map((pillar, index) => {
            const swatch = SWATCHES[index % SWATCHES.length];
            const last = index === items.length - 1;
            return (
              <li
                key={pillar.lead ?? pillar.text}
                className="grid grid-cols-[3.5rem_1fr] gap-x-5 sm:grid-cols-[4rem_1fr] sm:gap-x-8"
              >
                <span aria-hidden="true" className="flex flex-col items-center">
                  <motion.span
                    className="relative block h-14 w-14 shrink-0 overflow-hidden border border-line bg-mist sm:h-16 sm:w-16"
                    variants={swatchVariants}
                    custom={index}
                  >
                    <Image
                      src={swatch}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </motion.span>
                  {/* The warp carrying on to the next pillar. The gap below the
                      text is the content's padding, not the row's, so the thread
                      reaches the next swatch instead of stopping short of it. */}
                  {last ? null : (
                    <motion.span
                      className="mt-3 w-px flex-1 origin-top bg-line"
                      variants={threadVariants}
                      custom={index}
                    />
                  )}
                </span>

                <div
                  className={`lg:grid lg:grid-cols-[15rem_1fr] lg:gap-x-12 ${
                    last ? "" : "pb-12 lg:pb-14"
                  }`.trim()}
                >
                  <motion.h3
                    className="t-h3 pt-2 lg:pt-1.5"
                    variants={headingVariants}
                    custom={index}
                  >
                    {withReg(pillar.lead ?? "")}
                  </motion.h3>
                  <motion.p
                    className="mt-3 max-w-[36rem] text-slate lg:mt-1"
                    variants={textVariants}
                    custom={index}
                  >
                    {withReg(pillar.text)}
                  </motion.p>
                </div>
              </li>
            );
          })}
        </motion.ul>
      </Container>
    </section>
  );
}
