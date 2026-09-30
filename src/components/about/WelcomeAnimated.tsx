"use client";

import { motion, useReducedMotion } from "motion/react";
import { withReg } from "@/components/ui/Reg";

interface WelcomeAnimatedProps {
  lead?: string;
  craft?: string;
  invitation?: string;
  closing?: string;
}

export function WelcomeAnimated({
  lead,
  craft,
  invitation,
  closing,
}: WelcomeAnimatedProps) {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16 items-start">
      {/* Left Column: Eyebrow, Heading, Closing */}
      <div>
        <motion.span
          initial={{ opacity: 0, y: reduceMotion ? 0 : 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="t-eyebrow block font-sans font-normal tracking-[0.2em] text-accent uppercase"
        >
          ABOUT US · SINCE 1995
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: reduceMotion ? 0 : 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="t-h2 mt-4 font-sans font-normal tracking-tight text-navy"
        >
          Welcome to D J Impex &amp; Co.
        </motion.h2>

        {closing ? (
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="mt-8 pt-6 border-t border-accent/30 max-w-sm"
          >
            <p className="font-sans font-semibold text-navy text-sm sm:text-base tracking-wide">
              {closing}
            </p>
          </motion.div>
        ) : null}
      </div>

      {/* Right Column: Paragraphs gliding up smoothly line-by-line */}
      <div className="space-y-6">
        {lead ? (
          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
            transition={{ duration: 0.75, delay: 0.2, ease }}
            className="font-sans font-normal text-base sm:text-lg text-slate leading-relaxed"
          >
            {withReg(lead)}
          </motion.p>
        ) : null}

        {craft ? (
          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
            transition={{ duration: 0.75, delay: 0.32, ease }}
            className="font-sans font-normal text-base sm:text-lg text-slate leading-relaxed"
          >
            {withReg(craft)}
          </motion.p>
        ) : null}

        {invitation ? (
          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
            transition={{ duration: 0.75, delay: 0.44, ease }}
            className="font-sans font-normal text-base sm:text-lg text-slate leading-relaxed"
          >
            {withReg(invitation)}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}
