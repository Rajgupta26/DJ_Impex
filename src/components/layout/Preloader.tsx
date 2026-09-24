"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useOverlay } from "@/components/layout/OverlayContext";

/**
 * The preloader: cloth turning in a dark room, which pulls back and dissolves
 * to leave the page behind it.
 *
 * **No blue.** The ground was `--color-navy-deep`, which was the right answer
 * to a different complaint -- it matched the hero, so the handoff had no colour
 * cut -- but it put a blue cast around every edge. The ground is a neutral
 * near-black instead.
 *
 * `GROUND` is not picked by eye. #1e1e1e has a relative luminance of 0.0122
 * against navy-deep's 0.0126, so it is the neutral that sits at the same
 * brightness as the hero it hands over to. The hue goes; the brightness match
 * that made the handoff work stays.
 *
 * The exit opens out through the viewer rather than shrinking away: the scene
 * scales to 2.2 while the ground dissolves, so the page is left behind the
 * cloth rather than revealed around a shrinking object. The film keeps turning
 * throughout, because its rotation is its own CSS animation and owes nothing to
 * the transform the outro is using.
 *
 * It leaves on `window.onload` with a 3.5s timeout behind it. MIN_MS is not in
 * any brief; without it Next has usually fired `load` before React hydrates and
 * the whole thing is over in about 200ms.
 */
const GROUND = "#1e1e1e";
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
          className="fixed left-0 top-0 z-[9999] h-screen w-screen overflow-hidden text-white"
          style={{ backgroundColor: GROUND }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            // Nothing in here is clickable, but the overlay is over the page
            // while it is showing, so it only stops taking the pointer once it
            // has started to go.
            pointerEvents: "none",
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* The scene pulls back as it goes: still turning, getting smaller,
              and the page comes up behind it. */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={reduceMotion ? {} : { scale: 1.04 }}
            animate={{ scale: 1 }}
            exit={
              reduceMotion
                ? {}
                : {
                    // Past the viewer rather than away from them: the cloth
                    // opens out and through the camera, which leaves the page
                    // behind it rather than a shrinking object in the middle of
                    // it. The turn underneath carries on through all of it.
                    scale: 2.2,
                    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                  }
            }
            transition={{
              duration: reduceMotion ? 0.01 : 1.5,
              ease: [0.22, 0.61, 0.36, 1],
            }}
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

            {/* A neutral fall, so the corners settle into the ground rather than
                ending on a hard edge. No hue in it. */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_0%,rgb(30_30_30/0.45)_58%,rgb(30_30_30/0.92)_88%)]" />

            <motion.div
              className="relative flex flex-col items-center px-6 text-center"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
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

              {/* Silver, not the house accent: the brief is no blue anywhere. */}
              <div className="mt-9 h-px w-[min(13rem,44vw)] overflow-hidden bg-white/12">
                <motion.div
                  className="h-full w-full origin-left bg-white/75"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduceMotion ? 0.01 : 1.9, ease: [0.33, 0.1, 0.2, 1] }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
