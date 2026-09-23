"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { withReg } from "@/components/ui/Reg";
import { TextLink } from "@/components/ui/TextLink";

interface BriefAnimatedProps {
  title: string;
  paragraphs: string[];
  linkLabel: string;
  trustMarksSlot?: ReactNode;
}

export function BriefAnimated({
  title,
  paragraphs,
  linkLabel,
  trustMarksSlot,
}: BriefAnimatedProps) {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 0.61, 0.36, 1] as const;

  const leftVariants = {
    hidden: { opacity: 0, x: reduceMotion ? 0 : -40 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.45,
        delay: reduceMotion ? 0 : custom * 0.07,
        ease,
      },
    }),
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      {/* Left Column: Line by line / sentence by sentence animation from the left */}
      <motion.div
        className="flex flex-col justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05, margin: "0px 0px 20% 0px" }}
      >
        <motion.h2
          className="t-h2 max-w-[15ch]"
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

        <motion.p
          className="mt-8"
          variants={leftVariants}
          custom={paragraphs.length + 1}
        >
          <TextLink href="/about">{linkLabel}</TextLink>
        </motion.p>

        {trustMarksSlot ? (
          <motion.div
            className="mt-8"
            variants={leftVariants}
            custom={paragraphs.length + 2}
          >
            {trustMarksSlot}
          </motion.div>
        ) : null}
      </motion.div>

      {/* Right Column: Archive Image 30-35% smaller, smoothly entering from the right */}
      <motion.figure
        className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:w-[350px] lg:max-w-[350px] aspect-[4/5] overflow-hidden bg-mist shadow-sm lg:self-center"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px 20% 0px" }}
        transition={{
          duration: reduceMotion ? 0.01 : 0.5,
          delay: reduceMotion ? 0 : 0.08,
          ease,
        }}
      >
        <Image
          src="/images/gallery/05-camel-check-jacquard.jpg"
          alt="Camel check jacquard fabric from the Nabeen range"
          fill
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 350px"
          className="object-cover object-[50%_58%]"
        />
        <figcaption className="t-small absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(13_23_51/0.82))] p-4 font-semibold text-white">
          Archive · camel check jacquard
        </figcaption>
      </motion.figure>
    </div>
  );
}
