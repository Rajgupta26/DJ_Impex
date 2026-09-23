"use client";

import { motion, useReducedMotion } from "motion/react";
import { Globe, GraduationCap, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import type { ReactNode } from "react";

import type { ListItem } from "@/lib/markdown";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";

/**
 * Icons corresponding to each of the five pillars:
 * 1. Inspiring Admiration -> Sparkles
 * 2. World-Class Pursuit -> Globe
 * 3. Quantum Growth -> TrendingUp
 * 4. Ethical Excellence -> ShieldCheck
 * 5. Empowering Minds -> GraduationCap
 */
const PILLAR_ICONS = [
  Sparkles,
  Globe,
  TrendingUp,
  ShieldCheck,
  GraduationCap,
];

/**
 * The cascade: an icon badge reveals, its heading arrives, the paragraph comes in from
 * the right, and the thread draws down to the next pillar, five times over.
 */
const STEP = 0.5; // seconds between one pillar and the next
const EASE = [0.22, 0.61, 0.36, 1] as const;

export function VisionPillars({
  heading,
  intro,
  items,
}: {
  heading: string;
  /** The client's own opening line, which used to sit in the panel above. */
  intro?: ReactNode;
  items: ListItem[];
}) {
  const reduceMotion = useReducedMotion();

  /** Reduced motion keeps the staging but takes out the movement and the wait. */
  const step = (index: number, offset: number, duration: number) => ({
    duration: reduceMotion ? 0.01 : duration,
    delay: reduceMotion ? 0 : index * STEP + offset,
    ease: EASE,
  });

  const iconVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.88 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
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
    <section className="bg-white pt-12 pb-16 lg:pt-16 lg:pb-20">
      <Container>
        <h2 className="t-h2 max-w-[18ch]">{withReg(heading)}</h2>
        {intro ? <p className="t-lead measure mt-6">{intro}</p> : null}

        <motion.div
          className="mt-14 w-full lg:mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <ul>
            {items.map((pillar, index) => {
              const IconComponent = PILLAR_ICONS[index % PILLAR_ICONS.length];
              const last = index === items.length - 1;
              return (
                <li
                  key={pillar.lead ?? pillar.text}
                  className="grid grid-cols-[3.5rem_1fr] gap-x-5 sm:grid-cols-[4rem_1fr] sm:gap-x-8"
                >
                  <span aria-hidden="true" className="flex flex-col items-center">
                    <motion.span
                      className="relative flex h-12 w-12 shrink-0 items-center justify-center text-navy sm:h-14 sm:w-14"
                      variants={iconVariants}
                      custom={index}
                    >
                      <IconComponent size={28} strokeWidth={1.5} className="text-navy" />
                    </motion.span>
                    {/* The warp carrying on to the next pillar. The gap below the
                      text is the content's padding, not the row's, so the thread
                      reaches the next box instead of stopping short of it. */}
                    {last ? null : (
                      <motion.span
                        className="bg-line mt-3 w-px flex-1 origin-top"
                        variants={threadVariants}
                        custom={index}
                      />
                    )}
                  </span>

                  <div
                    className={`lg:grid lg:grid-cols-[16rem_1fr] lg:gap-x-12 xl:grid-cols-[18rem_1fr] xl:gap-x-16 ${
                      last ? "" : "pb-12 lg:pb-14"
                    }`.trim()}
                  >
                    <motion.h3 className="t-h3 pt-2 lg:pt-1.5" variants={headingVariants} custom={index}>
                      {withReg(pillar.lead ?? "")}
                    </motion.h3>
                    <motion.p
                      className="text-slate font-sans mt-3 max-w-[56rem] font-normal leading-relaxed lg:mt-1.5"
                      variants={textVariants}
                      custom={index}
                    >
                      {withReg(pillar.text)}
                    </motion.p>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}

