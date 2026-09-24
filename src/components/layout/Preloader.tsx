"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useOverlay } from "@/components/layout/OverlayContext";

/**
 * The preloader, built to hand over to the page rather than to sit in front of
 * it.
 *
 * The previous version was a grey rectangle of film. Its ground was #a7a9ab,
 * sampled from the footage, which is a colour that appears nowhere in this
 * palette -- so the preloader was off-brand for its whole life and then cut
 * hard to a navy hero. That cut is what made it read as a separate thing.
 *
 * This one stands on `--color-navy-deep`, which is exactly what the hero
 * stands on. Nothing changes colour when it leaves: the mark lifts away and the
 * hero is already there underneath, on the same ground.
 *
 * The client's footage is still here, but as atmosphere rather than as a video.
 * `mix-blend-mode: screen` lets the white cloth come through bright while the
 * grey ground barely lifts the navy, and a radial mask removes the frame's
 * edges, so there is no rectangle to see. See `.preloader-film` in globals.css.
 *
 * The thread beneath the mark is the house's own: a selvedge-blue line drawn
 * across while the page loads, which is the same idea as the warp that runs
 * through the pillars on /vision.
 *
 * It leaves on `window.onload` with a 3.5s timeout behind it. MIN_MS is not in
 * any brief; without it Next has usually fired `load` before React hydrates and
 * the whole thing is over in about 200ms.
 */
const MIN_MS = 1100;
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
          className="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center overflow-hidden bg-navy-deep"
          initial={{ opacity: 1 }}
          // The ground is the hero's ground, so this fade reveals the same
          // colour it is leaving. There is nothing to cut to.
          exit={{ opacity: 0, transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] } }}
        >
          <video
            className="preloader-film absolute inset-0 h-full w-full object-cover"
            src="/video/preloader.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />

          {/* A raking fall from the lower left, the same treatment the hero and
              the vision panel use, so the light behaves the way it does on the
              rest of the site. */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_8%_100%,rgb(13_23_51/0.88)_0%,rgb(13_23_51/0.45)_45%,transparent_78%)]" />

          <motion.div
            className="relative flex flex-col items-center px-6 text-center"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <Image
              src="/images/logos/nabeen-logo-white.png"
              alt=""
              width={1088}
              height={345}
              priority
              className="h-auto w-[min(17rem,52vw)]"
            />

            <p className="t-small mt-5 tracking-[0.2em] text-white/55">
              House of luxury men&rsquo;s fabrics
            </p>

            {/* The thread. It draws while the page loads and is the one piece of
                colour, in the house accent. */}
            <div className="mt-9 h-px w-[min(13rem,44vw)] overflow-hidden bg-white/12">
              <motion.div
                className="h-full w-full origin-left bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reduceMotion ? 0.01 : 1.9,
                  ease: [0.33, 0.1, 0.2, 1],
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
