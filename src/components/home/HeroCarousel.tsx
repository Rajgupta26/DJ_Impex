"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Pause, Play } from "lucide-react";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { withReg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WeaveArt, type WeavePattern } from "@/components/ui/WeaveArt";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";

export type HeroMedia =
  | { kind: "image"; src: string; alt: string; position?: string; muted?: boolean }
  | {
      /** The client's film. Vertical footage, so it is set as a standing panel. */
      kind: "video";
      src: string;
      poster: string;
      alt: string;
    }
  | { kind: "weave"; pattern: WeavePattern; pending: string };

export type HeroSlideView = {
  headline: string;
  sub: string;
  href?: string;
  media: HeroMedia;
};

const INTERVAL = 6500;
/** The film is 21s long; 6.5s of it would only ever be a fragment. */
const FILM_INTERVAL = 13000;

/**
 * The site's one orchestrated motion moment: on first load the headline rises
 * line by line, and only then does the selvedge below start to drift.
 *
 * Slides crossfade rather than slide, because the cloth should change like light
 * moving across it. Autoplay has a visible pause control (WCAG 2.2.2) and stops
 * under prefers-reduced-motion.
 */
export function HeroCarousel({ slides, whatsappHref }: { slides: HeroSlideView[]; whatsappHref: string }) {
  const reduceMotion = useReducedMotion();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 40 }, [Fade()]);
  const [selected, setSelected] = useState(0);
  const playing = true;
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
    const dwell = slides[selected]?.media.kind === "video" ? FILM_INTERVAL : INTERVAL;
    const timer = window.setTimeout(() => embla.scrollNext(), dwell);
    return () => window.clearTimeout(timer);
  }, [embla, playing, reduceMotion, slides, selected]);

  const goTo = useCallback((index: number) => embla?.scrollTo(index), [embla]);

  const active = slides[selected] ?? slides[0];

  return (
    <section
      data-hero
      aria-roledescription="carousel"
      aria-label="Nabeen fabrics"
      className="on-dark bg-navy-deep relative h-[100dvh] h-screen min-h-[36rem] overflow-hidden text-white"
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
              ) : slide.media.kind === "video" ? (
                <HeroVideo
                  src={slide.media.src}
                  poster={slide.media.poster}
                  alt={slide.media.alt}
                  active={index === selected}
                  playing={playing}
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
          putting a photograph there at all.

          Neutral, not navy (2026-09-23, agency instruction): the veils were
          mixed from navy-deep and navy, which put a blue cast over the client's
          film. Black carries the same job without tinting the cloth. The alphas
          came down about 6% with the change, because black is darker than
          navy-deep at the same alpha and the point was to take the hue out, not
          to make the frame darker. The section's own ground stays navy -- it is
          brand, and it sits behind the media rather than over it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(100deg,rgb(0_0_0/0.77)_0%,rgb(0_0_0/0.47)_34%,rgb(0_0_0/0.15)_64%,rgb(0_0_0/0.04)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(to_top,rgb(0_0_0/0.58)_0%,rgb(0_0_0/0.21)_44%,transparent_100%)]"
      />
      {/* Weighted into the bottom-left corner, where the words actually sit, so the
          cloth at the top right stays bright. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(130%_118%_at_0%_100%,rgb(0_0_0/0.86)_0%,rgb(0_0_0/0.6)_34%,rgb(0_0_0/0.28)_56%,transparent_78%)]"
      />

      <div className="container-site absolute inset-x-0 bottom-[clamp(3.5rem,10vh,6.5rem)]">
        <HeroWords slide={active} slideKey={selected} reduceMotion={Boolean(reduceMotion)} rise={!advanced} />

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <TrackedLink href={whatsappHref} event="whatsapp_click" location="hero" className="btn btn-on-dark">
            <WhatsAppGlyph size={20} />
            <span>Enquire on WhatsApp</span>
          </TrackedLink>

          {active.href ? (
            <Link href={active.href} className="btn btn-ghost">
              <span>Read the story</span>
            </Link>
          ) : (
            <Link href="/about" className="btn btn-ghost">
              <span>Read our story</span>
            </Link>
          )}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="container-site absolute inset-x-0 bottom-[clamp(1.25rem,3vh,2rem)] flex items-center gap-4">
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
                    index === selected ? "bg-accent" : "bg-white/35 group-hover:bg-white/70"
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
 * The film, filling the hero.
 *
 * The footage is a 9:16 reel, so a landscape hero shows its middle band. That is
 * the trade the client asked for: one uninterrupted frame rather than a panel with
 * a seam through it. It also crops the burned-in wordmark away from the header.
 * On a phone the 9:16 fits the hero almost exactly and nothing is lost.
 *
 * The poster is a real image so it can be the LCP element and the hero is never
 * blank. The video carries preload="none", starts only while its slide is showing,
 * and follows the carousel's own pause button, so one control governs everything
 * moving on the hero (WCAG 2.2.2). On a metered or slow connection it never loads
 * at all: the poster carries the slide instead.
 */
function HeroVideo({
  src,
  poster,
  alt,
  active,
  playing,
}: {
  src: string;
  poster: string;
  alt: string;
  active: boolean;
  playing: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const autoplayAllowed = useCanAutoplay();
  // Mirrors the element rather than guessing: a browser can refuse autoplay, and
  // the viewer can use the control below, so React must not assume either.
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => setPaused(video.paused);
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    sync();

    // Under reduced motion the film does not start on its own. It used to stop
    // there, which left a paused video and no way to start it -- the same dead
    // end a browser that refuses autoplay produced, because the rejected promise
    // was swallowed. Autoplay is still suppressed; the control below is how the
    // viewer starts it.
    if (active && playing && !reduceMotion && autoplayAllowed) {
      void video.play().catch(() => setPaused(true));
    } else {
      video.pause();
    }

    return () => {
      video.removeEventListener("play", sync);
      video.removeEventListener("pause", sync);
    };
  }, [active, playing, reduceMotion, autoplayAllowed]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPaused(true));
    else video.pause();
  };

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={poster}
        // Metadata when the film may start by itself; nothing at all when it may
        // not, so a Data Saver visitor downloads only the poster until they ask
        // for the film. Either way the element is here and the control works.
        preload={autoplayAllowed ? "metadata" : "none"}
        muted
        loop
        playsInline
        aria-label={alt}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Top right, clear of the header above it and of the floating contact
          buttons at the bottom right. Moving content needs a way to stop it
          (WCAG 2.2.2), and suppressed autoplay needs a way to start it --
          whether it was suppressed by reduced motion, by Data Saver, or by a
          browser refusing to autoplay at all. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? "Play the film" : "Pause the film"}
        className="bg-navy-deep/45 hover:bg-navy-deep/70 absolute top-[6.5rem] right-5 z-10 flex h-11 w-11 items-center justify-center border border-white/50 text-white backdrop-blur-sm transition-colors duration-[var(--duration-quick)] md:right-8"
      >
        {paused ? (
          <Play aria-hidden="true" size={18} strokeWidth={1.6} className="ml-0.5" />
        ) : (
          <Pause aria-hidden="true" size={18} strokeWidth={1.6} />
        )}
      </button>
    </div>
  );
}

type NetworkInformation = EventTarget & { saveData?: boolean; effectiveType?: string };

/**
 * Whether the film may start on its own. It is not permission to exist: the
 * element and its control render either way, so a viewer can always press play.
 *
 * This used to refuse "3g" as well, and that was wrong. `effectiveType` is an
 * estimate from recent round-trip times, not a description of the hardware, and
 * a healthy broadband connection is routinely reported as "3g" while the page
 * is still loading. The film was therefore suppressed for ordinary visitors on
 * ordinary connections -- measured on production, where the browser reported
 * "3g" and no <video> was rendered at all, leaving a still poster that reads as
 * a video someone has paused.
 *
 * What is left is the case the guard was written for: an explicit Data Saver
 * request, or a connection genuinely too slow to stream several megabytes. The
 * server snapshot is false, so nothing is requested before the client has
 * looked.
 */
function useCanAutoplay(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
      connection?.addEventListener("change", onChange);
      return () => connection?.removeEventListener("change", onChange);
    },
    () => {
      const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
      if (!connection) return true;
      if (connection.saveData) return false;
      return !["slow-2g", "2g"].includes(connection.effectiveType ?? "");
    },
    () => false,
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
        className="t-lead mt-6 max-w-[30rem] !text-white text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.5, delay: animate ? 0.5 : 0 }}
      >
        {withReg(slide.sub)}
      </motion.p>
    </div>
  );
}
