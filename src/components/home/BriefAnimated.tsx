"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { withReg } from "@/components/ui/Reg";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { TextLink } from "@/components/ui/TextLink";
import { DJIAnimatedLogo } from "@/components/home/DJIAnimatedLogo";

interface BriefAnimatedProps {
  title: string;
  tagline?: string;
  paragraphs: string[];
  linkLabel: string;
  trustMarksSlot?: ReactNode;
  /** The replaceable photograph beside the brief. See lib/slots. */
  imageSrc?: string;
  imageAlt?: string;
}

export function BriefAnimated({
  title,
  tagline,
  paragraphs,
  linkLabel,
  trustMarksSlot,
}: BriefAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const compact = useMediaQuery("(max-width: 1023px)");
  const ease = [0.22, 1, 0.36, 1] as const;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  // Scroll-linked transforms:
  // Starts large and prominent as user scrolls down, then scales into its resting place
  const logoScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [compact ? 1.15 : 1.85, 1]);
  const logoY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-35, 0]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.3, 0.85, 1]);

  const leftVariants = {
    hidden: { opacity: 0, x: reduceMotion ? 0 : "var(--reveal-distance-negative,-50px)" },
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
          className="max-w-[28ch] text-[clamp(1.6rem,1.15rem+1.75vw,2.8rem)] font-sans font-normal tracking-tight leading-[1.12] text-navy"
          variants={leftVariants}
          custom={0}
        >
          {title.includes("|") ? (
            title.split("|").map((line, i) => (
              <span key={i} className="block lg:whitespace-nowrap">
                {withReg(line.trim())}
              </span>
            ))
          ) : title.includes("\n") ? (
            title.split("\n").map((line, i) => (
              <span key={i} className="block lg:whitespace-nowrap">
                {withReg(line.trim())}
              </span>
            ))
          ) : (
            withReg(title)
          )}
        </motion.h2>

        <div className="mt-8 grid gap-5">
          {paragraphs.map((paragraph, index) => {
            const formatted = paragraph.replace(/D J Impex & Co\./g, "D\u00A0J\u00A0Impex\u00A0&\u00A0Co.");
            return (
              <motion.p
                key={paragraph}
                className="measure text-left text-slate lg:text-justify"
                variants={leftVariants}
                custom={index + 1}
              >
                {withReg(formatted)}
              </motion.p>
            );
          })}
        </div>

        <motion.div
          className="mt-8"
          variants={leftVariants}
          custom={paragraphs.length + 1}
        >
          <Link
            href="/about"
            className="group inline-flex flex-col items-start gap-1 transition-opacity hover:opacity-80"
          >
            <span className="inline-block border-b border-navy pb-0.5 font-sans text-xs font-semibold tracking-[0.16em] text-slate uppercase transition-colors group-hover:text-navy sm:text-sm">
            Crafted In India
            </span>
            <span className="inline-block border-b border-navy pb-0.5 font-sans text-xs font-semibold tracking-[0.16em] text-slate uppercase transition-colors group-hover:text-navy sm:text-sm">
            Chosen Across Africa
            </span>
          </Link>
        </motion.div>

        {trustMarksSlot ? (
          <motion.div className="mt-8" variants={leftVariants} custom={paragraphs.length + 2}>
            {trustMarksSlot}
          </motion.div>
        ) : null}
      </motion.div>

      {/* Right Column: Just the DJI Logo and Text (Increased logo size by 20%) */}
      <motion.div
        className="relative mx-auto flex w-full max-w-[320px] flex-col items-center justify-center text-center sm:max-w-[360px] lg:w-[360px] lg:self-center"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: "var(--reveal-distance,50px)" }}
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
          <DJIAnimatedLogo size={210} />
        </motion.div>

        <div className="mt-3 w-full text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-navy uppercase sm:text-sm">
            DJ Impex & Co.
          </p>
          <p className="mt-1 text-xs font-medium text-slate">
            Star Export House · Est. 1995
          </p>
        </div>
      </motion.div>
    </div>
  );
}
