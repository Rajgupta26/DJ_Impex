"use client";

import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { Reg, withReg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WeaveArt, type WeavePattern } from "@/components/ui/WeaveArt";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";

export type HeroMedia =
  | { kind: "image"; src: string; alt: string; position?: string; muted?: boolean }
  | { kind: "weave"; pattern: WeavePattern; pending: string };

export type HeroSlideView = {
  headline: string;
  sub: string;
  href?: string;
  media: HeroMedia;
};

const INTERVAL = 6500;

/**
 * The site's one orchestrated motion moment: on first load the headline rises
 * line by line, and only then does the selvedge below start to drift.
 *
 * Slides crossfade rather than slide, because the cloth should change like light
 * moving across it. Autoplay has a visible pause control (WCAG 2.2.2) and stops
 * under prefers-reduced-motion.
 */
export function HeroCarousel({
  slides,
  whatsappHref,
}: {
  slides: HeroSlideView[];
  whatsappHref: string;
}) {
  const reduceMotion = useReducedMotion();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 40 }, [Fade()]);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);
  // The line-by-line rise is the site's single orchestrated moment, so it plays
  // on first load only. Once the carousel has moved, later headlines cross-fade
  // instead, and are never mid-flight (and invisible) while a slide is showing.
  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => {
      setSelected(embla.selectedScrollSnap());
      setAdvanced(true);
    };
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  useEffect(() => {
    if (!embla || !playing || reduceMotion || slides.length < 2) return;
    const timer = window.setInterval(() => embla.scrollNext(), INTERVAL);
    return () => window.clearInterval(timer);
  }, [embla, playing, reduceMotion, slides.length]);

  const goTo = useCallback((index: number) => embla?.scrollTo(index), [embla]);

  const active = slides[selected] ?? slides[0];

  return (
    <section
      data-hero
      aria-roledescription="carousel"
      aria-label="Nabeen fabrics"
      className="on-dark relative h-[min(92vh,880px)] min-h-[34rem] overflow-hidden bg-navy-deep text-white"
    >
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.headline}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
              aria-hidden={index !== selected}
              className="relative h-full min-w-0 flex-[0_0_100%]"
            >
              {slide.media.kind === "image" ? (
                <Image
                  src={slide.media.src}
                  alt={slide.media.alt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  quality={88}
                  className={`object-cover ${slide.media.muted ? "saturate-[0.45]" : ""}`}
                  style={{ objectPosition: slide.media.position ?? "60% 40%" }}
                />
              ) : (
                <WeaveArt pattern={slide.media.pattern} scale={1.4} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two light veils rather than one heavy one: a wash from the left that keeps
          the words legible, and a scrim along the bottom where they actually sit.
          The cloth stays readable across most of the frame, which is the point of
          putting a photograph there at all. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(100deg,rgb(13_23_51/0.82)_0%,rgb(13_23_51/0.5)_34%,rgb(23_40_80/0.16)_64%,rgb(23_40_80/0.04)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(to_top,rgb(13_23_51/0.62)_0%,rgb(13_23_51/0.22)_44%,transparent_100%)]"
      />
      {/* Weighted into the bottom-left corner, where the words actually sit, so the
          cloth at the top right stays bright. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(130%_118%_at_0%_100%,rgb(13_23_51/0.92)_0%,rgb(13_23_51/0.64)_34%,rgb(13_23_51/0.3)_56%,transparent_78%)]"
      />

      <div className="container-site absolute inset-x-0 bottom-[clamp(3.5rem,10vh,6.5rem)]">
        <HeroWords
          slide={active}
          slideKey={selected}
          reduceMotion={Boolean(reduceMotion)}
          rise={!advanced}
        />

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <TrackedLink
            href={whatsappHref}
            event="whatsapp_click"
            location="hero"
            className="btn btn-on-dark"
          >
            <WhatsAppGlyph size={20} />
            <span>Enquire on WhatsApp</span>
          </TrackedLink>

          {active.href ? (
            <Link href={active.href} className="btn btn-ghost">
              <span>Read the story</span>
            </Link>
          ) : (
            <Link href="/nabeen" className="btn btn-ghost">
              <span>
                Explore Nabeen
                <Reg />
              </span>
            </Link>
          )}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="container-site absolute inset-x-0 bottom-[clamp(1.25rem,3vh,2rem)] flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-white/70 transition-colors hover:text-white"
          >
            <span className="visually-hidden">
              {playing ? "Pause the slideshow" : "Play the slideshow"}
            </span>
            {playing ? (
              <Pause aria-hidden="true" size={15} strokeWidth={1.75} />
            ) : (
              <Play aria-hidden="true" size={15} strokeWidth={1.75} />
            )}
          </button>

          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.headline}
                type="button"
                onClick={() => goTo(index)}
                aria-current={index === selected ? "true" : undefined}
                className="group flex h-11 items-center"
              >
                <span className="visually-hidden">
                  Go to slide {index + 1} of {slides.length}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px w-9 transition-colors duration-[var(--duration-base)] ${
                    index === selected ? "bg-zari" : "bg-white/35 group-hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

/**
 * The headline rises a line at a time. Splitting on words and re-wrapping in
 * overflow-hidden rows means each visual line is masked, so the letters appear
 * from behind the line above rather than fading in.
 */
function HeroWords({
  slide,
  slideKey,
  reduceMotion,
  rise,
}: {
  slide: HeroSlideView;
  slideKey: number;
  reduceMotion: boolean;
  /** True only for the first headline of the session. */
  rise: boolean;
}) {
  const words = slide.headline.split(" ");
  // Frozen at mount: this instance keeps the mode it was born with. Embla can fire
  // its first "select" within milliseconds, and letting `rise` change on a live
  // element left the words mid-animation and invisible.
  const [risesOnMount] = useState(rise);
  const animate = risesOnMount && !reduceMotion;

  return (
    <div key={slideKey}>
      <h1 className="t-display max-w-[15ch]">
        <span className="visually-hidden">{slide.headline}</span>
        <span aria-hidden="true" className="block">
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={animate ? { y: "108%" } : { opacity: 0 }}
                animate={animate ? { y: 0 } : { opacity: 1 }}
                transition={{
                  duration: animate ? 0.9 : 0.35,
                  delay: animate ? index * 0.07 : 0,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                {withReg(word)}
                {index < words.length - 1 ? " " : null}
              </motion.span>
            </span>
          ))}
        </span>
      </h1>

      <motion.p
        className="t-lead mt-6 max-w-[30rem] text-white/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.5, delay: animate ? 0.5 : 0 }}
      >
        {withReg(slide.sub)}
      </motion.p>
    </div>
  );
}
