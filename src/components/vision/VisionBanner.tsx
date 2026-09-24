"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The opening of /vision: the agency's banner, supplied as a still on
 * 2026-09-23 and replaced the same day by the animated version of the same
 * artwork -- the words hold still while the silk moves behind them.
 *
 * The words are in the footage, so the H1 carries them as text of its own and
 * the video is decoration. A video has no alt attribute; without this the page
 * would have no heading at all for a search engine or a screen reader.
 *
 * It loops, which makes it moving content, so WCAG 2.2.2 needs a way to stop it
 * and the button is that. The button also reflects the element's real state
 * rather than what the code assumed: a browser can refuse autoplay, and the
 * rejected promise used to be swallowed on the home hero, which is what left a
 * dead paused film there (question 98).
 *
 * Under reduced motion it does not start, and the poster -- a frame of the
 * footage, so the composition is identical -- carries the panel instead.
 *
 * The panel fills the screen under the header, and the video is a further 127%
 * of that panel's height, anchored to its top. Two things fall out of that.
 *
 * The panel filling the viewport is what the agency asked for: the film over
 * the whole screen and the pillars below the fold, so the band of white between
 * the two is no longer in the first screenful.
 *
 * The 127% is what keeps Gemini's sparkle out. The footage carries it at
 * roughly x1160 y600 of the 1280x720 frame, about 49px across. Measured, the
 * type runs x169-1111 and y170-344: the sparkle sits 24px to the right of the
 * last letter of "Voile", so any crop from the side clips the type, while the
 * bottom has 231px of clearance. Oversizing the video and anchoring it to the
 * top puts the crop entirely on the bottom, and while the height drives the
 * cover the rows shown work out at 720/1.27 = 567 whatever the screen -- always
 * short of row 575, where the sparkle starts.
 *
 * `max-h-[59vw]` is the guard on the other side. The oversize shows
 * 567 x (width/height) columns, so a tall, narrow window would eat into the
 * type: it needs 942 columns, which wants an aspect of about 1.66 or wider.
 * Capping the panel at 59% of the width holds the aspect at 1.7 or better, and
 * a short window simply gets a shorter panel rather than clipped words.
 *
 * It does cost sharpness, which the same agency has asked about twice. The film
 * is 1280 wide and this now draws it at about 1.44 rather than 1.13. A
 * re-export above 1280 is the only real answer; see 05-open-questions 151.
 *
 * This hides the mark; it does not take it out of the file, and the same
 * sparkle is in preloader.mp4 at the same coordinates. A re-export without it,
 * at a width above 1280, would settle both that and the softness on a large
 * monitor. See 05-open-questions 151.
 */
const BANNER_WORDS =
  "Luxury in every thread. House of textiles: Giza Cotton, Wool, Atiku, Aesobi, Wax Print, Shirting, Swiss Lace, Suiting, Jacquard and Voile.";

export function VisionBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => setPaused(video.paused);
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    sync();

    if (reduceMotion) {
      video.pause();
    } else {
      void video.play().catch(() => setPaused(true));
    }

    return () => {
      video.removeEventListener("play", sync);
      video.removeEventListener("pause", sync);
    };
  }, [reduceMotion]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPaused(true));
    else video.pause();
  };

  return (
    <section className="bg-white pt-[4.5rem] lg:pt-[5.25rem]">
      <h1 className="visually-hidden">{BANNER_WORDS}</h1>

      <div className="relative h-[calc(100dvh-4.5rem)] max-h-[59vw] w-full overflow-hidden lg:h-[calc(100dvh-5.25rem)]">
        <video
          ref={videoRef}
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-x-0 top-0 h-[127%] w-full object-cover object-top"
          poster="/video/luxury-in-every-thread.jpg"
          // Metadata, not none: "none" made the first play() slow and easy to
          // lose on the home hero, and the poster still carries the frame.
          preload="metadata"
          muted
          loop
          playsInline
        >
          <source src="/video/luxury-in-every-thread.mp4" type="video/mp4" />
        </video>

        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? "Play the banner animation" : "Pause the banner animation"}
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-white/30 bg-navy-deep/85 text-white backdrop-blur-sm transition-colors duration-[var(--duration-quick)] hover:bg-navy-deep md:right-8"
        >
          {paused ? (
            <Play aria-hidden="true" size={18} strokeWidth={1.6} className="ml-0.5" />
          ) : (
            <Pause aria-hidden="true" size={18} strokeWidth={1.6} />
          )}
        </button>
      </div>
    </section>
  );
}
