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

function GoogleReviewsBrand() {
  return (
    <div className="flex items-center">
      <span className="text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
        <span style={{ color: "#4285F4" }}>G</span>
        <span style={{ color: "#EA4335" }}>o</span>
        <span style={{ color: "#FBBC05" }}>o</span>
        <span style={{ color: "#4285F4" }}>g</span>
        <span style={{ color: "#34A853" }}>l</span>
        <span style={{ color: "#EA4335" }}>e</span>
        <span className="ml-2 font-medium text-white">Reviews</span>
      </span>
    </div>
  );
}

const AVATAR_COLORS = [
  "#1a73e8", // Blue
  "#e37400", // Orange
  "#188038", // Green
  "#8e24aa", // Purple
  "#d93025", // Red
  "#00838f", // Teal
  "#e52592", // Pink
  "#f29900", // Amber
  "#3949ab", // Indigo
  "#00897b", // Teal Green
];

function getAvatarBg(name?: string | null, index?: number): string {
  if (!name || !name.trim()) {
    return AVATAR_COLORS[(index ?? 0) % AVATAR_COLORS.length];
  }
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[colorIndex];
}

function ReviewerAvatar({ name, index }: { name?: string | null; index?: number }) {
  const initial = name?.trim().charAt(0).toUpperCase() || "G";
  const bg = getAvatarBg(name, index);

  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white shadow-sm"
      style={{ backgroundColor: bg }}
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
        <h2 className="t-h2 max-w-[33ch] text-white -translate-x-1 sm:-translate-x-2">{withReg(heading)}</h2>

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
                  <div className="flex items-center gap-4">
                    <Quote
                      className="h-9 w-9 fill-white text-white sm:h-11 sm:w-11"
                      aria-hidden="true"
                    />
                    {isGoogleReviews ? <GoogleReviewsBrand /> : null}
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
                    <ReviewerAvatar name={item.name} index={index} />
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
                      {!isGoogleReviews && (item.role || item.status === "tbc") ? (
                        <div className="t-small mt-0.5 flex flex-wrap items-center gap-x-2 text-white/65">
                          {item.name && item.role ? <span>{item.role}</span> : null}
                          <TbcTag status={item.status} note="Name and city not yet supplied by the client" />
                        </div>
                      ) : null}
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
