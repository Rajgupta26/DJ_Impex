"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { WeaveArt } from "@/components/ui/WeaveArt";
import { withReg } from "@/components/ui/Reg";

/**
 * The client's own film of the cloth.
 *
 * Built for a mid-range Android on mobile data: preload="none", so nothing is
 * fetched until the section is reached; it starts only when it scrolls into view
 * and pauses the moment it leaves, so a visitor who scrolls past does not pay for
 * it. Muted and looping with a visible pause control (WCAG 2.2.2), and it never
 * starts on its own under prefers-reduced-motion.
 */
export function BrandFilm({
  src,
  poster,
  caption,
  heading,
}: {
  /** null until the client sends the file: the section draws cloth instead. */
  src: string | null;
  poster: string | null;
  caption: string;
  heading: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            /* A browser may refuse autoplay; the pause control still works. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <section className="on-dark relative overflow-hidden bg-navy-deep text-white">
      <div className="container-site grid items-center gap-10 py-[clamp(3.5rem,2.5rem+4vw,6rem)] lg:grid-cols-[1fr_auto] lg:gap-20">
        <div className="order-2 lg:order-1">
          <h2 className="t-h2 max-w-[14ch] text-[clamp(1.75rem,1.3rem+1.6vw,3rem)]">
            {withReg(heading)}
          </h2>
          <p className="measure mt-5 text-white/80">{withReg(caption)}</p>
        </div>

        {/* The footage is a 9:16 reel, so it is set as a standing panel at its own
            proportions rather than cropped into a landscape band. */}
        <div className="relative order-1 aspect-[9/16] w-full max-w-[20rem] justify-self-center overflow-hidden bg-navy lg:order-2 lg:h-[34rem] lg:w-auto lg:max-w-none">
          {src ? (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                poster={poster ?? undefined}
                preload="none"
                muted
                loop
                playsInline
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              >
                <source src={src} type="video/mp4" />
              </video>

              <button
                type="button"
                onClick={toggle}
                className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center border border-white/50 bg-navy-deep/40 transition-colors hover:bg-navy-deep/70"
              >
                <span className="visually-hidden">
                  {playing ? "Pause the film" : "Play the film"}
                </span>
                {playing ? (
                  <Pause aria-hidden="true" size={16} strokeWidth={1.75} />
                ) : (
                  <Play aria-hidden="true" size={16} strokeWidth={1.75} />
                )}
              </button>
            </>
          ) : (
            <WeaveArt pattern="check" scale={1.2} />
          )}
        </div>
      </div>
    </section>
  );
}
