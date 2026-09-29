"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { withReg } from "@/components/ui/Reg";
import { TextLink } from "@/components/ui/TextLink";
import { DJIAnimatedLogo } from "@/components/home/DJIAnimatedLogo";

interface BriefAnimatedProps {
  title: string;
  paragraphs: string[];
  linkLabel: string;
  trustMarksSlot?: ReactNode;
  /** The replaceable photograph beside the brief. See lib/slots. */
  imageSrc?: string;
  imageAlt?: string;
}

export function BriefAnimated({
  title,
  paragraphs,
  linkLabel,
  trustMarksSlot,
}: BriefAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Scroll-linked transforms:
  // Starts large and prominent as user scrolls down, then scales into its resting place
  const logoScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.85, 1]);
  const logoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-35, 0]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.3, 0.85, 1]);

  const leftVariants = {
    hidden: { opacity: 0, x: reduceMotion ? 0 : -50 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 1.25,
        delay: reduceMotion ? 0 : 0.15 + custom * 0.22,
        ease,
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      className="grid min-w-0 items-center gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16"
    >
      {/* Left Column: Line by line / sentence by sentence animation from the left */}
      <motion.div
        className="flex min-w-0 flex-col justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25, margin: "-60px 0px" }}
      >
        <motion.h2
          className="t-h2 max-w-[15ch]"
          style={{ fontWeight: 400 }}
          variants={leftVariants}
          custom={0}
        >
          {withReg(title)}
        </motion.h2>

        <div className="mt-8 grid gap-5">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={paragraph}
              className="measure text-slate"
              variants={leftVariants}
              custom={index + 1}
            >
              {withReg(paragraph)}
            </motion.p>
          ))}
        </div>

        <motion.p className="mt-8" variants={leftVariants} custom={paragraphs.length + 1}>
          <TextLink href="/about">{linkLabel}</TextLink>
        </motion.p>

        {trustMarksSlot ? (
          <motion.div className="mt-8" variants={leftVariants} custom={paragraphs.length + 2}>
            {trustMarksSlot}
          </motion.div>
        ) : null}
      </motion.div>

      {/* Right Column: Premium DJI Brand Heritage Card with Multi-layer Triangle Animation */}
      <motion.div
        className="relative top-[10%] mx-auto flex w-full max-w-[280px] flex-col items-center justify-center rounded-2xl border border-line bg-gradient-to-b from-mist/70 via-mist/25 to-white p-8 text-center shadow-sm sm:max-w-[320px] lg:w-[350px] lg:max-w-[350px] lg:self-start lg:py-12"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25, margin: "-60px 0px" }}
        transition={{
          duration: reduceMotion ? 0.01 : 1.25,
          delay: reduceMotion ? 0 : 0.35,
          ease,
        }}
      >
        <motion.div
          style={reduceMotion ? {} : { scale: logoScale, y: logoY, opacity: logoOpacity }}
          className="relative flex items-center justify-center origin-center"
        >
          <DJIAnimatedLogo size={145} />
        </motion.div>

        <div className="mt-6 w-full border-t border-line/60 pt-5">
          <p className="text-xs font-bold tracking-[0.2em] text-navy uppercase sm:text-sm">
            D J Impex & Co.
          </p>
          <p className="mt-1 text-xs font-medium text-slate">
            Star Export House · Est. 1995
          </p>
        </div>
      </motion.div>
    </div>
  );
}
