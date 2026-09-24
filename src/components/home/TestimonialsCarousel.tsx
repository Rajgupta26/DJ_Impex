"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Quote, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { withReg } from "@/components/ui/Reg";
import { TbcTag } from "@/components/ui/TbcTag";
import type { Testimonial } from "@/lib/site";

type ReviewItem = Testimonial & {
  authorHref?: string;
  sourceHref?: string;
  rating?: number;
};

const INTERVAL = 2000;

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-label="Google">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function ReviewerAvatar({ name }: { name?: string | null }) {
  const initial = name?.trim().charAt(0).toUpperCase() || "G";

  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4285F4] text-sm font-semibold text-white"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

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
      className="on-dark bg-navy relative overflow-hidden py-10 text-white sm:py-12 lg:py-14"
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

        <div ref={emblaRef} className="mt-7 overflow-hidden sm:mt-8">
          <div className="flex">
            {items.map((item, index) => (
              <figure
                key={item.quote}
                role="group"
                aria-roledescription="slide"
                aria-label={`Quote ${index + 1} of ${items.length}`}
                className="min-w-0 flex-[0_0_100%]"
              >
                <div className="max-w-[54rem] py-2 sm:py-3">
                  <div className="flex items-center gap-3">
                    <Quote
                      className="h-9 w-9 text-white/90 sm:h-11 sm:w-11"
                      strokeWidth={1.35}
                      aria-hidden="true"
                    />
                    {isGoogleReviews ? <GoogleMark /> : null}
                  </div>

                  <div
                    className="mt-6 flex items-center gap-2"
                    aria-label={`${item.rating ?? 4.5} out of 5 stars`}
                  >
                    <span className="text-sm font-semibold text-white sm:text-base">
                      {(item.rating ?? 4.5).toFixed(1)}
                    </span>
                    <div className="flex gap-1 text-[#fbbc04]">
                      {Array.from({ length: 5 }, (_, star) => (
                        <Star key={star} className="h-4 w-4 fill-current sm:h-5 sm:w-5" aria-hidden="true" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="mt-5">
                    <p className="max-w-[44rem] text-[clamp(1.25rem,1rem+1.1vw,1.9rem)] leading-[1.38] font-light text-white">
                      {withReg(item.quote)}
                    </p>
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3 pt-2">
                    <ReviewerAvatar name={item.name} />
                    <div className="min-w-0">
                      {item.name ? (
                        item.authorHref ? (
                          <a
                            href={item.authorHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-white underline-offset-4 hover:underline"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <p className="font-medium text-white">{item.name}</p>
                        )
                      ) : (
                        <p className="font-medium text-white">{item.role}</p>
                      )}
                      <div className="t-small mt-0.5 flex flex-wrap items-center gap-x-2 text-white/65">
                        {item.name ? <span>{item.role}</span> : null}
                        <TbcTag status={item.status} note="Name and city not yet supplied by the client" />
                        {item.sourceHref ? (
                          <a
                            href={item.sourceHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 underline underline-offset-4 hover:text-white"
                          >
                            Google review
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>

        {items.length > 1 ? (
          <div className="mt-7 flex items-center gap-2">
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
