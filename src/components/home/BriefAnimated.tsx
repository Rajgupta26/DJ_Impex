"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { withReg } from "@/components/ui/Reg";

interface BriefAnimatedProps {
  title: string;
  tagline?: string;
  paragraphs: string[];
  linkLabel?: string;
  trustMarksSlot?: ReactNode;
  /** The replaceable photograph beside the brief. See lib/slots. */
  imageSrc?: string;
  imageAlt?: string;
}

export function BriefAnimated({
  title,
  paragraphs,
  trustMarksSlot,
}: BriefAnimatedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

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
            const formatted = paragraph
              .replace(/D\s*J\s*Impex\s*&\s*Co\./g, "D\u2009J Impex & Co.")
              .replace(/DJ\s*Impex/g, "D\u2009J Impex");
            return (
              <motion.p
                key={index}
                className="measure text-left text-slate"
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
            className="group inline-flex items-center gap-2 border-b border-navy pb-1 font-sans text-sm font-semibold text-navy transition-all hover:opacity-80 sm:text-base"
          >
            <span>Read Our Story</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </Link>
        </motion.div>

        {trustMarksSlot ? (
          <motion.div className="mt-8" variants={leftVariants} custom={paragraphs.length + 2}>
            {trustMarksSlot}
          </motion.div>
        ) : null}
      </motion.div>

      {/* Right Column: Just the DJI Logo and Text */}
      <motion.div
        className="relative mx-auto flex w-full max-w-[340px] flex-col items-center justify-center text-center sm:max-w-[380px] lg:w-[380px] lg:self-center"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: "var(--reveal-distance,50px)" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25, margin: "-60px 0px" }}
        transition={{
          duration: reduceMotion ? 0.01 : 1.25,
          delay: reduceMotion ? 0 : 0.35,
          ease,
        }}
      >
        <div className="relative flex items-center justify-center">
          <Image
            src="/images/logos/dji-logo-transparent.png"
            alt="D J Impex & Co."
            width={242}
            height={242}
            priority
            className="h-auto w-[200px] object-contain sm:w-[242px]"
          />
        </div>

        <div className="mt-4 flex flex-col items-center justify-center text-center -translate-x-[6%]">
          <p className="text-[19.5px] font-bold tracking-normal text-navy uppercase sm:text-[22px]">
            D{"\u2009"}J Impex & Co.
          </p>
          <p className="mt-1.5 text-[14px] font-medium text-slate sm:text-[15.5px]">
            Star Export House · Est. 1995
          </p>
        </div>
      </motion.div>
    </div>
  );
}
