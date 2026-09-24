"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { useOverlay } from "@/components/layout/OverlayContext";

/**
 * The preloader: a small disc of film over a blurred page.
 *
 * It leaves when the page's own resources have finished loading, with a 3.5s
 * safety timeout behind it so a slow or failed asset can never strand anyone
 * behind it. Both paths run; whichever comes first wins.
 *
 * A minimum on screen as well as a maximum. By the time React hydrates, Next
 * has often already fired `load`, so the honest answer to "are the resources
 * ready" is frequently "yes, already" -- and a preloader that appears and
 * vanishes inside 200ms reads as a glitch rather than a loading state. It holds
 * for MIN_MS before it is allowed to go.
 *
 * The body is not locked here. `useOverlay` already does that through
 * OverlayContext, and locking it twice left `overflow: hidden` behind when the
 * two restores unwound in the wrong order.
 */
const MIN_MS = 900;
const FALLBACK_MS = 3500;

export function Preloader() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(true);

  useOverlay("preloader", show);

  useEffect(() => {
    const mountedAt = Date.now();

    const leave = () => {
      const waited = Date.now() - mountedAt;
      const remaining = Math.max(0, MIN_MS - waited);
      window.setTimeout(() => setShow(false), remaining);
    };

    if (document.readyState === "complete") {
      leave();
    } else {
      window.addEventListener("load", leave, { once: true });
    }

    // The safety net: whatever the page is waiting on, the preloader goes.
    const fallback = window.setTimeout(() => setShow(false), FALLBACK_MS);

    return () => {
      window.removeEventListener("load", leave);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/25 backdrop-blur-[8px]"
        >
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative h-[180px] w-[180px] overflow-hidden rounded-full bg-navy-deep shadow-[0_24px_60px_rgb(13_23_51/0.45)] ring-1 ring-white/15 sm:h-[220px] sm:w-[220px]"
          >
            <video
              className="h-full w-full object-cover"
              src="/video/preloader.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
