"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { useOverlay } from "@/components/layout/OverlayContext";

/**
 * The preloader: the fabric film, centred, on a ground matched to its own.
 *
 * `FILM_GROUND` is measured, not guessed: the corners of the footage read
 * rgb(167-168, 169-170, 171-172) at every timestamp sampled.
 *
 * The ground is not flat, though. Across one frame it climbs from 168 in the
 * corners to 230 near the middle -- a vignette of some sixty levels -- so no
 * single overlay colour can hide the edge of the video, and matching the
 * corners alone left the lighter top and bottom edges reading as a bright
 * rectangle on a darker field. The film's outer tenth is faded out instead:
 * see `.preloader-film` in globals.css. Re-sample both if it is re-rendered.
 *
 * It leaves on `window.onload` with a 3.5s timeout behind it, so a slow or
 * failed asset can never strand anyone. Both paths run and the first wins.
 * AnimatePresence takes it out of the DOM once the fade finishes.
 *
 * MIN_MS is not in the brief. Next has usually fired `load` before React
 * hydrates, so without a floor the whole thing is over inside about 200ms and
 * reads as a flicker rather than an entrance.
 */
const FILM_GROUND = "#a7a9ab";
const MIN_MS = 900;
const FALLBACK_MS = 3500;

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
          className="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center"
          style={{ backgroundColor: FILM_GROUND }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
          transition={{ duration: reduceMotion ? 0.01 : 0.3 }}
        >
          {/* Contained, not cropped: the film is a figure on its own ground, and
              the ground is the overlay, so nothing needs to reach the edges. */}
          <video
            className="preloader-film h-auto max-h-[92vh] w-[min(92vw,820px)] object-contain"
            src="/video/preloader.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
