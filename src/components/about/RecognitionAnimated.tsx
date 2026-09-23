"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { withReg } from "@/components/ui/Reg";

interface RecognitionAnimatedProps {
  companyName: string;
  starExportHouse: string;
  paragraphs: string[];
  tradeNotice: string;
  craftText: string;
  invitationText: string;
  closingText: string;
  trustMarks: ReactNode;
}

export function RecognitionAnimated({
  companyName,
  starExportHouse,
  paragraphs,
  tradeNotice,
  craftText,
  invitationText,
  closingText,
  trustMarks,
}: RecognitionAnimatedProps) {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 0.61, 0.36, 1] as const;

  const getParagraphAnim = (index: number) => ({
    initial: { opacity: 0, x: reduceMotion ? 0 : 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: 0.65,
      delay: reduceMotion ? 0 : 0.25 + index * 0.12,
      ease,
    },
  });

  return (
    <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-20">
      <div className="flex flex-col">
        {/* DJI Logo slides in smoothly from the left */}
        <motion.div
          initial={{ opacity: 0, x: reduceMotion ? 0 : -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.1, ease }}
        >
          <Image
            src="/images/logos/dji-logo-transparent.png"
            alt={companyName}
            width={736}
            height={735}
            className="h-14 w-14"
          />
        </motion.div>

        {/* Recognition heading slides in smoothly from the left */}
        <motion.h2
          initial={{ opacity: 0, x: reduceMotion ? 0 : -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.25, ease }}
          className="t-h2 mt-8 max-w-[12ch]"
        >
          Recognition
        </motion.h2>

        {trustMarks}
      </div>

      <div>
        {/* Star Export House heading slides down smoothly from the top */}
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : -60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="t-h2 max-w-[16ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] text-navy"
        >
          {starExportHouse}
        </motion.p>

        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, delay: 0.25, ease }}
          style={{ originX: 0 }}
          className="measure mt-8 block h-px w-full bg-accent"
        />

        {paragraphs.map((paragraph, index) => {
          const anim = getParagraphAnim(index);
          return (
            <motion.p
              key={paragraph}
              initial={anim.initial}
              whileInView={anim.whileInView}
              viewport={anim.viewport}
              transition={anim.transition}
              className="measure mt-8 text-slate"
            >
              {withReg(paragraph)}
            </motion.p>
          );
        })}

        {(() => {
          const anim = getParagraphAnim(paragraphs.length);
          return (
            <motion.p
              initial={anim.initial}
              whileInView={anim.whileInView}
              viewport={anim.viewport}
              transition={anim.transition}
              className="measure mt-6 text-slate"
            >
              {withReg(tradeNotice)}
            </motion.p>
          );
        })()}

        {/* Client craft story and invitation */}
        <div className="mt-8 grid gap-6">
          {(() => {
            const anim1 = getParagraphAnim(paragraphs.length + 1);
            const anim2 = getParagraphAnim(paragraphs.length + 2);
            return (
              <>
                <motion.p
                  initial={anim1.initial}
                  whileInView={anim1.whileInView}
                  viewport={anim1.viewport}
                  transition={anim1.transition}
                  className="measure text-slate"
                >
                  {withReg(craftText)}
                </motion.p>
                <motion.p
                  initial={anim2.initial}
                  whileInView={anim2.whileInView}
                  viewport={anim2.viewport}
                  transition={anim2.transition}
                  className="measure text-slate"
                >
                  {withReg(invitationText)}
                </motion.p>
              </>
            );
          })()}
        </div>

        {(() => {
          const anim = getParagraphAnim(paragraphs.length + 3);
          return (
            <motion.p
              initial={anim.initial}
              whileInView={anim.whileInView}
              viewport={anim.viewport}
              transition={anim.transition}
              className="t-small mt-12 inline-block border-t border-accent pt-4 font-semibold tracking-[0.02em] text-navy"
            >
              {closingText}
            </motion.p>
          );
        })()}
      </div>
    </div>
  );
}
