"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";

function UsersThreeOutline({ className = "w-7 h-7 sm:w-8 sm:h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0f3e33"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Center user */}
      <circle cx="12" cy="7" r="3" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
      {/* Left user */}
      <circle cx="6" cy="9" r="2" />
      <path d="M2 18.5a4.5 4.5 0 0 1 4.5-4" />
      {/* Right user */}
      <circle cx="18" cy="9" r="2" />
      <path d="M17.5 14.5a4.5 4.5 0 0 1 4.5 4" />
    </svg>
  );
}

function GoogleLogo({ className = "w-7 h-7 sm:w-8 sm:h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
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

function StarRating({ triggerFlash = false }: { triggerFlash?: boolean }) {
  const reduceMotion = useReducedMotion();

  // Staggered goldish flash animation
  const starVariants = {
    initial: {
      scale: 1,
      filter: "drop-shadow(0px 0px 0px rgba(245, 158, 11, 0))",
    },
    flash: (i: number) => ({
      scale: reduceMotion ? 1 : [1, 1.25, 1],
      filter: [
        "drop-shadow(0px 0px 0px rgba(245, 158, 11, 0))",
        "drop-shadow(0px 0px 10px rgba(251, 191, 36, 0.95)) drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.8))",
        "drop-shadow(0px 0px 0px rgba(245, 158, 11, 0))",
      ],
      transition: {
        delay: 0.65 + i * 0.08,
        duration: 0.6,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <div className="relative inline-flex items-center gap-1 text-[#f59e0b] overflow-hidden py-0.5" aria-label="4.8 out of 5 stars">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={starVariants}
          initial="initial"
          animate={triggerFlash ? "flash" : "initial"}
          className="relative inline-block origin-center"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-[#f59e0b]" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        </motion.div>
      ))}

      {/* 5th Star (80% filled) */}
      <motion.div
        custom={4}
        variants={starVariants}
        initial="initial"
        animate={triggerFlash ? "flash" : "initial"}
        className="relative h-4 w-4 sm:h-5 sm:w-5 origin-center"
      >
        <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-[#e5e7eb]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
        <div className="absolute inset-0 overflow-hidden w-[80%]">
          <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-[#f59e0b]" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        </div>
      </motion.div>

      {/* Gold shimmer beam pass */}
      {triggerFlash && !reduceMotion ? (
        <motion.div
          initial={{ x: "-120%", opacity: 0 }}
          animate={{
            x: ["-120%", "240%"],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            delay: 0.65,
            duration: 0.85,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-amber-200/80 to-transparent blur-[2px] mix-blend-screen"
        />
      ) : null}
    </div>
  );
}

function CustomerCounter({ isInView }: { isInView: boolean }) {
  const reduceMotion = useReducedMotion();
  const [counted, setCounted] = useState<string | null>(null);

  /**
   * Derived until the count actually runs, rather than set from inside the
   * effect. The effect used to open by calling setState synchronously for the
   * cases that never animate, which is a cascading render and an eslint error.
   * Before it is in view the figure reads its start; if it is never going to
   * animate -- out of view, or reduced motion -- it reads its end.
   */
  const display = counted ?? (isInView && !reduceMotion ? "1" : "1 Million+");

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    const duration = 1500; // 1.5 seconds timer
    const startTime = performance.now();
    let frame = 0;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-out curve
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(1 + ease * 999999);

      if (progress < 1) {
        setCounted(current.toLocaleString());
        frame = requestAnimationFrame(update);
      } else {
        setCounted("1 Million+");
      }
    };

    frame = requestAnimationFrame(update);
    // The loop used to run on unmounted: nothing cancelled it.
    return () => cancelAnimationFrame(frame);
  }, [isInView, reduceMotion]);

  return (
    <span className="font-sans text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl lg:text-5xl tabular-nums">
      {display}
    </span>
  );
}

export function SocialProofBanner() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={containerRef}
      className="border-b border-line/60 bg-white pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20 overflow-hidden"
    >
      <Container>
        {/* Strictly symmetric 3-column grid (1fr / auto / 1fr) with left and right blocks pushed to outer corners */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-8 lg:gap-12">
          {/* Left Block: Aligned to the left corner */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -70 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1.0, ease }}
            className="flex w-full items-center justify-center gap-5 sm:gap-6 md:justify-start"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e3f4ee] sm:h-20 sm:w-20 transition-transform duration-300 hover:scale-105">
              <UsersThreeOutline />
            </div>
            <div className="min-w-[170px] sm:min-w-[210px] flex flex-col justify-center">
              <div className="flex items-baseline">
                <CustomerCounter isInView={isInView} />
              </div>
              <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-[#556070] uppercase sm:text-sm">
                Satisfied Customers
              </p>
            </div>
          </motion.div>

          {/* Centered Vertical Hairline Divider - permanently fixed in 1 position */}
          <motion.div
            initial={reduceMotion ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
            animate={isInView ? { scaleY: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            className="hidden h-16 sm:h-20 w-px bg-gray-200 md:block origin-center shrink-0"
            aria-hidden="true"
          />

          {/* Right Block: Aligned to the right corner */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 70 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1.0, ease }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex w-full items-center justify-center gap-5 sm:gap-6 md:justify-end"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] sm:h-20 sm:w-20 transition-transform duration-300 hover:scale-105">
              <GoogleLogo />
            </div>
            <div className="min-w-[170px] sm:min-w-[210px] flex flex-col justify-center">
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl lg:text-5xl">
                  4.8
                </span>
                <span className="font-sans text-xl italic text-slate sm:text-2xl">
                  / 5
                </span>
              </div>
              <div className="mt-1">
                <StarRating triggerFlash={isInView || isHovered} />
              </div>
              <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-[#556070] uppercase sm:text-sm">
                Google Review Rating
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
