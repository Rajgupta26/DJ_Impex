"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useOverlay } from "@/components/layout/OverlayContext";

/**
 * The preloader: a glass disc with a silver arc travelling round it, over a
 * dark, blurred page. Drawn in CSS -- no film, no image beyond the mark itself.
 *
 * It leaves on `window.onload` with a 3s timeout behind it, so a slow or failed
 * asset can never strand anyone. Both paths run and the first wins.
 * AnimatePresence takes it out of the DOM once the fade has finished, so
 * nothing is left over the page to swallow clicks.
 *
 * MIN_MS is not in the brief. Next has usually fired `load` before React
 * hydrates, so without a floor the whole thing is over inside about 200ms and
 * reads as a flicker rather than an entrance.
 *
 * The tagline sits below the disc rather than inside it. Inside a 220px circle,
 * under a mark that is itself two lines, it would have had to set at about 10px
 * to fit, which is smaller than anything else on the site.
 *
 * The ring is in globals.css; the reduced-motion handling lives with it.
 */
const MIN_MS = 900;
const FALLBACK_MS = 3000;

export function Preloader() {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(true);

  useOverlay("preloader", show);

  useEffect(() => {
    const mountedAt = Date.now();

    const leave = () => {
      const remaining = Math.max(0, MIN_MS - (Date.now() - mountedAt));
      window.setTimeout(() => setShow(false), remaining);
    };

    if (document.readyState === "complete") leave();
    else window.addEventListener("load", leave, { once: true });

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[rgb(15_15_15/0.85)] backdrop-blur-[12px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            // A soft defocus rather than a move: it grows very slightly as it goes.
            scale: reduceMotion ? 1 : 1.03,
            transition: { duration: 0.6, ease: "easeOut" },
          }}
          transition={{ duration: reduceMotion ? 0.01 : 0.35 }}
        >
          <div className="relative h-[220px] w-[220px]">
            <div className="preloader-ring pointer-events-none absolute -inset-[6px] rounded-full" />

            <div className="absolute inset-0 flex items-center justify-center rounded-full border border-white/15 bg-white/5">
              <Image
                src="/images/logos/nabeen-logo-white.png"
                alt=""
                width={1088}
                height={345}
                priority
                className="h-auto w-[132px]"
              />
            </div>
          </div>

          <p className="t-small mt-8 tracking-[0.16em] text-white/70">
            House of Luxury Men&rsquo;s Fabrics
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
