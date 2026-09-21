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
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        {src ? (
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
        ) : (
          <WeaveArt pattern="check" scale={1.6} />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(13_23_51/0.86)_0%,rgb(13_23_51/0.3)_46%,rgb(13_23_51/0.12)_100%)]"
        />

        <div className="container-site absolute inset-x-0 bottom-0 pb-[clamp(2rem,4vw,4rem)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="t-h2 max-w-[16ch] text-[clamp(1.75rem,1.3rem+1.6vw,3rem)]">
                {withReg(heading)}
              </h2>
              <p className="measure mt-4 text-white/80">{withReg(caption)}</p>
            </div>

            {src ? (
              <button
                type="button"
                onClick={toggle}
                className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/50 transition-colors hover:bg-white/10"
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
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
