"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useAnyOverlayOpen } from "@/components/layout/OverlayContext";
import { Reg } from "@/components/ui/Reg";

export function FloatingNabeenButton() {
  const overlayOpen = useAnyOverlayOpen();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.95 }}
      animate={overlayOpen ? { opacity: 0, pointerEvents: "none" } : { opacity: 1, y: 0, scale: 1 }}
      transition={reduceMotion ? { duration: 0.01 } : { duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-4 sm:left-6 z-30 transition-opacity duration-300"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <Link
        href="/nabeen"
        className="group flex items-center gap-2.5 rounded-full border border-navy/20 bg-navy px-4 py-3 text-xs sm:text-sm font-medium tracking-wide text-white shadow-float transition-all duration-300 hover:bg-navy-soft hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Explore Nabeen Collection"
      >
        <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
        <span className="font-sans">
          Explore Nabeen<Reg />
        </span>
        <span
          className="transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      </Link>
    </motion.div>
  );
}
