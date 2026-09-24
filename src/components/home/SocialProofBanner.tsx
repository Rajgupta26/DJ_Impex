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

function StarRating() {
  return (
    <div className="flex items-center gap-1 text-[#f59e0b]" aria-label="4.8 out of 5 stars">
      {[1, 2, 3, 4].map((i) => (
        <svg key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#f59e0b]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      {/* 5th Star (80% filled) */}
      <div className="relative h-4 w-4 sm:h-5 sm:w-5">
        <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-[#e5e7eb]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
        <div className="absolute inset-0 overflow-hidden w-[80%]">
          <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-[#f59e0b]" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CustomerCounter() {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
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
    <span ref={ref} className="font-sans text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl lg:text-5xl">
      {display}
    </span>
  );
}

export function SocialProofBanner() {
  const reduceMotion = useReducedMotion();

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="border-b border-line/60 bg-white py-14 sm:py-18 lg:py-20 overflow-hidden">
      <Container className="max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-10 sm:gap-12 md:flex-row md:gap-8 px-4 sm:px-8 lg:px-12">
          {/* Left Block: Coming in smoothly from the Left */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.1, ease }}
            className="flex w-full items-center justify-center gap-5 sm:gap-6 md:w-auto md:justify-start"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e3f4ee] sm:h-20 sm:w-20">
              <UsersThreeOutline />
            </div>
            <div>
              <div className="flex items-baseline">
                <CustomerCounter />
              </div>
              <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-[#556070] uppercase sm:text-sm">
                Satisfied Customers
              </p>
            </div>
          </motion.div>

          {/* Animated Vertical Hairline Divider (0 to 100% height) */}
          <motion.div
            initial={reduceMotion ? { scaleY: 1 } : { scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.1, ease, delay: 0.15 }}
            className="hidden h-20 w-px bg-gray-300 md:block origin-center"
            aria-hidden="true"
          />

          {/* Right Block: Coming in smoothly from the Right */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.1, ease }}
            className="flex w-full items-center justify-center gap-5 sm:gap-6 md:w-auto md:justify-end"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] sm:h-20 sm:w-20">
              <GoogleLogo />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl lg:text-5xl">
                  4.8
                </span>
                <span className="font-sans text-xl italic text-slate sm:text-2xl">
                  / 5
                </span>
              </div>
              <div className="mt-1">
                <StarRating />
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
