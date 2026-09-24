"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import { withReg } from "@/components/ui/Reg";
import { TbcTag } from "@/components/ui/TbcTag";
import type { Testimonial } from "@/lib/site";

type ReviewItem = Testimonial & {
  authorHref?: string;
  sourceHref?: string;
};

const INTERVAL = 2000;

/**
 * One large light quote at a time, behind a thread-thin gold rule. Indicators are
 * lines, not dots. Slides automatically every 2 seconds.
 */
export function TestimonialsCarousel({
  heading,
  items,
  isGoogleReviews = false,
}: {
  heading: string;
  items: ReviewItem[];
  isGoogleReviews?: boolean;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  useEffect(() => {
    if (!embla || paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => embla.scrollNext(), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [embla, paused, items.length, selected]);

  const goTo = useCallback((index: number) => embla?.scrollTo(index), [embla]);

  return (
    <section
      className="on-dark bg-navy relative overflow-hidden py-14 text-white sm:py-16 lg:py-20"
      aria-roledescription="carousel"
      aria-label="What our trade partners say"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Top S-Curve Wave Divider (matches the #eef1f6 section above) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 left-0 z-10 w-full overflow-hidden leading-none"
      >
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          preserveAspectRatio="none"
          className="block h-8 w-full sm:h-10 lg:h-14"
        >
          <path d="M 0,0 L 1440,0 L 1440,35 C 1120,85 760,10 380,65 C 200,90 70,75 0,45 Z" fill="#eef1f6" />
        </svg>
      </div>

      {/* Subtle luxury navy radial depth glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(120%_90%_at_50%_50%,rgb(36_56_106/0.5),transparent_75%)]"
      />

      {/* Bottom S-Curve Wave Divider (matches the #eef1f6 section below) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 w-full overflow-hidden leading-none"
      >
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          preserveAspectRatio="none"
          className="block h-8 w-full sm:h-10 lg:h-14"
        >
          <path d="M 0,90 L 1440,90 L 1440,55 C 1120,10 740,80 380,35 C 180,10 60,25 0,50 Z" fill="#eef1f6" />
        </svg>
      </div>

      {/* High-Contrast Foreground Content */}
      <div className="container-site relative z-10">
        <h2 className="t-h2 max-w-[22ch] text-white">{withReg(heading)}</h2>
        {isGoogleReviews ? (
          <p className="t-small mt-3 text-white/70">Selected 4–5 star Google reviews</p>
        ) : null}

        <div ref={emblaRef} className="mt-8 overflow-hidden sm:mt-10">
          <div className="flex">
            {items.map((item, index) => (
              <figure
                key={item.quote}
                role="group"
                aria-roledescription="slide"
                aria-label={`Quote ${index + 1} of ${items.length}`}
                className="border-accent min-w-0 flex-[0_0_100%] border-l pl-8 sm:pl-10"
              >
                <blockquote>
                  <p className="max-w-[52rem] text-[clamp(1.35rem,1.05rem+1.4vw,2.2rem)] leading-[1.3] font-light text-white">
                    {withReg(item.quote)}
                  </p>
                </blockquote>
                <figcaption className="t-small mt-6 text-white/70">
                  {item.name ? (
                    item.authorHref ? (
                      <a
                        href={item.authorHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )
                  ) : (
                    item.role
                  )}
                  {item.name ? <span className="text-white/60"> · {item.role}</span> : null}
                  <TbcTag status={item.status} note="Name and city not yet supplied by the client" />
                  {item.sourceHref ? (
                    <a
                      href={item.sourceHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 text-white underline"
                    >
                      Google review
                    </a>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {items.length > 1 ? (
          <div className="mt-7 flex items-center gap-2 pl-8 sm:pl-10">
            {items.map((item, index) => (
              <button
                key={item.quote}
                type="button"
                onClick={() => goTo(index)}
                aria-current={index === selected ? "true" : undefined}
                className="group flex h-11 items-center"
              >
                <span className="visually-hidden">
                  Show quote {index + 1} of {items.length}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px w-9 transition-colors duration-[var(--duration-base)] ${
                    index === selected ? "bg-accent" : "bg-white/30 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
