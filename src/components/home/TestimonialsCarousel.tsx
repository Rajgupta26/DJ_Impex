"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import { withReg } from "@/components/ui/Reg";
import { TbcTag } from "@/components/ui/TbcTag";
import type { Testimonial } from "@/lib/site";

const INTERVAL = 9000;

/**
 * One large light quote at a time, behind a thread-thin gold rule. Indicators are
 * lines, not dots. Autoplay is slow and stops the moment anyone hovers, focuses
 * or takes hold of it.
 */
export function TestimonialsCarousel({
  heading,
  items,
}: {
  heading: string;
  items: Testimonial[];
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
    const timer = window.setInterval(() => embla.scrollNext(), INTERVAL);
    return () => window.clearInterval(timer);
  }, [embla, paused, items.length]);

  const goTo = useCallback((index: number) => embla?.scrollTo(index), [embla]);

  return (
    <section
      className="bg-white py-[var(--spacing-section)]"
      aria-roledescription="carousel"
      aria-label="What our trade partners say"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container-site">
        <h2 className="t-h2 max-w-[22ch]">{withReg(heading)}</h2>

        <div ref={emblaRef} className="mt-14 overflow-hidden">
          <div className="flex">
            {items.map((item, index) => (
              <figure
                key={item.quote}
                role="group"
                aria-roledescription="slide"
                aria-label={`Quote ${index + 1} of ${items.length}`}
                className="min-w-0 flex-[0_0_100%] border-l border-accent pl-8 sm:pl-10"
              >
                <blockquote>
                  <p className="max-w-[52rem] text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-light leading-[1.3] [font-stretch:87.5%]">
                    {withReg(item.quote)}
                  </p>
                </blockquote>
                <figcaption className="t-small mt-8 text-slate">
                  {item.name ?? item.role}
                  {item.name ? <span className="text-slate"> · {item.role}</span> : null}
                  <TbcTag status={item.status} note="Name and city not yet supplied by the client" />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {items.length > 1 ? (
          <div className="mt-10 flex items-center gap-2 pl-8 sm:pl-10">
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
                    index === selected ? "bg-navy" : "bg-line group-hover:bg-slate"
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
