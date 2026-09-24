"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useOverlay } from "@/components/layout/OverlayContext";

/**
 * The Silk Reveal.
 *
 * The film fills the viewport with the mark over it; when the page is ready the
 * cloth parts down the middle and the two halves draw off to the sides.
 *
 * The curtain is two panels, each holding its own copy of the film at the full
 * viewport width -- the left one anchored left, the right one anchored right --
 * so the two line up as one picture until they separate. A single element
 * cannot part outwards from its own centre: `clip-path: inset()` closes towards
 * the middle, which is the opposite gesture.
 *
 * It leaves on `window.onload`, with a 3.5s timeout behind it so a slow or
 * failed asset can never strand anyone. Both paths run and the first wins.
 * AnimatePresence takes the whole thing out of the DOM once the curtain has
 * finished, so nothing is left over the page to swallow clicks.
 *
 * MIN_MS is not in the brief. Next has usually fired `load` before React
 * hydrates, so without a floor the reveal fires at once and the whole thing is
 * over inside about 200ms, which reads as a flicker rather than an entrance.
 *
 * Under reduced motion the curtain does not travel: the panel fades instead.
 */
const MIN_MS = 900;
const FALLBACK_MS = 3500;
const CURTAIN_S = 0.8;
const EASE = [0.65, 0, 0.35, 1] as const; // ease-in-out

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

  const film = (side: "left" | "right") => (
    <video
      className="absolute inset-y-0 h-full w-screen max-w-none object-cover"
      style={side === "left" ? { left: 0 } : { right: 0 }}
      src="/video/preloader.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  );

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden"
          initial={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0, transition: { duration: 0.3 } } : {}}
        >
          {/* The two halves of the cloth. */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-navy-deep"
            exit={reduceMotion ? {} : { x: "-100%" }}
            transition={{ duration: CURTAIN_S, ease: EASE }}
          >
            {film("left")}
          </motion.div>

          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-navy-deep"
            exit={reduceMotion ? {} : { x: "100%" }}
            transition={{ duration: CURTAIN_S, ease: EASE }}
          >
            {film("right")}
          </motion.div>

          {/* The mark, over the seam. It goes before the cloth moves, so it is
              never caught being torn in half.

              It sits on a pool of navy because the film is white silk: measured
              over the middle band, the frame averages 144 of 255 and its
              highlights reach pure white, so a white mark on bare footage runs
              from 3.2:1 down to invisible. The radial is 0.86 at the centre,
              which puts white at about 5.2:1 even over the brightest silk, and
              is gone by three quarters of the way out, so the cloth still
              carries the frame. It fades with the mark rather than with the
              curtain, so nothing dark is left hanging as the cloth parts. */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(62%_52%_at_50%_50%,rgb(13_23_51/0.86)_0%,rgb(13_23_51/0.55)_45%,transparent_78%)] px-6 text-center"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            transition={{ duration: reduceMotion ? 0.01 : 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <Image
              src="/images/logos/nabeen-logo-white.png"
              alt=""
              width={1088}
              height={345}
              priority
              className="h-auto w-[min(22rem,62vw)] drop-shadow-[0_2px_24px_rgb(13_23_51/0.55)]"
            />
            <p className="t-small mt-6 tracking-[0.18em] text-white/80 drop-shadow-[0_1px_12px_rgb(13_23_51/0.6)]">
              House of Luxury Men&rsquo;s Fabrics
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
