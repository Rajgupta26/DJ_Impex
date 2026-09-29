"use client";

import { motion, useReducedMotion } from "motion/react";

import { withReg } from "@/components/ui/Reg";

export function AliNuhuMissionHeading({ heading }: { heading: string }) {
  const reduceMotion = useReducedMotion();
  const comma = heading.indexOf(",");
  const firstLine = comma >= 0 ? heading.slice(0, comma + 1) : heading;
  const secondLine = comma >= 0 ? heading.slice(comma + 1).trim() : "";
  const transition = (delay: number) => ({
    duration: reduceMotion ? 0.01 : 1.7,
    delay,
    ease: [0.22, 0.61, 0.36, 1] as const,
  });

  return (
    <h2 className="t-h2 max-w-none overflow-hidden">
      <motion.span
        className="block"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -52 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={transition(0)}
      >
        {withReg(firstLine)}
      </motion.span>
      {secondLine ? (
        <motion.span
          className="block"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 52 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={transition(0.16)}
        >
          {withReg(secondLine)}
        </motion.span>
      ) : null}
    </h2>
  );
}
