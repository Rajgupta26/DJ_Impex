"use client";

import { motion, useReducedMotion } from "motion/react";

import type { ListItem } from "@/lib/markdown";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { WeaveArt, type WeavePattern } from "@/components/ui/WeaveArt";

/**
 * The five pillars, hung on a warp thread and woven in as the reader arrives.
 *
 * The brief is explicit that these are five equal pillars and not a sequence, so
 * they are never numbered. The thread and the swatches do the work a number
 * would have done: they mark each pillar and tie the five together as one cloth.
 *
 * The swatch is decoration, not a claim. Each pillar draws a different weave
 * simply so no two marks are alike, and the order only avoids putting two
 * similar motifs side by side; none of them says anything about what the pillar
 * means.
 *
 * Tile sizes differ per pattern (44px to 120px), so each carries its own scale,
 * chosen to seat one legible motif inside a 44px swatch.
 */
const MARKS: { pattern: WeavePattern; scale: number }[] = [
  { pattern: "herringbone", scale: 0.82 },
  { pattern: "check", scale: 0.55 },
  { pattern: "lace", scale: 0.42 },
  { pattern: "ogee", scale: 0.36 },
  { pattern: "dobby", scale: 0.9 },
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
    <section className="bg-white py-[var(--spacing-section)]">
      <Container>
        <h2 className="t-h2 max-w-[18ch]">{withReg(heading)}</h2>

        <motion.ul
          className="mt-14 lg:mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {items.map((pillar, index) => {
            const mark = MARKS[index % MARKS.length];
            const last = index === items.length - 1;
            return (
              <li
                key={pillar.lead ?? pillar.text}
                className="grid grid-cols-[2.75rem_1fr] gap-x-5 sm:grid-cols-[3.25rem_1fr] sm:gap-x-8"
              >
                <span aria-hidden="true" className="flex flex-col items-center">
                  <motion.span
                    className="relative h-11 w-11 shrink-0 overflow-hidden bg-navy"
                    variants={swatchVariants}
                    custom={index}
                  >
                    <WeaveArt bare pattern={mark.pattern} scale={mark.scale} intensity={0.62} />
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
