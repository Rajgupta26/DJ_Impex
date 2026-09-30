"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Globe, Star } from "lucide-react";

import { withReg } from "@/components/ui/Reg";

interface RecognitionAnimatedProps {
  companyName: string;
  starExportHouse: string;
  paragraphs: string[];
  tradeNotice: string;
}

export function RecognitionAnimated({
  companyName,
  paragraphs,
  tradeNotice,
}: RecognitionAnimatedProps) {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 0.61, 0.36, 1] as const;

  return (
    <div className="relative w-full">
      {/* Decorative Gold Arcs & Stars on Far Left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2 opacity-25 select-none hidden lg:block"
      >
        <svg width="220" height="340" viewBox="0 0 220 340" fill="none">
          <circle cx="10" cy="170" r="150" stroke="#8B6128" strokeWidth="1.2" />
          <circle cx="10" cy="170" r="120" stroke="#8B6128" strokeWidth="1.2" />
          <polygon points="90,140 93,148 101,149 95,155 97,163 90,159 83,163 85,155 79,149 87,148" fill="#8B6128" />
          <polygon points="112,192 115,200 123,201 117,207 119,215 112,211 105,215 107,207 101,201 109,200" fill="#8B6128" />
        </svg>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 items-start">
        {/* Left Column: Heading, Award & Narrative */}
        <div className="relative lg:border-r lg:border-line/60 lg:pr-12 xl:pr-16">
          {/* Eyebrow with DJI Logo - aligned straight with right column top */}
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3.5"
          >
            <Image
              src="/images/logos/dji-logo-transparent.png"
              alt={companyName}
              width={736}
              height={735}
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
            />
            <span className="font-sans text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#8B6128] uppercase">
              GOVERNMENT OF INDIA RECOGNITION
            </span>
          </motion.div>

          {/* Main Title with Dual-tone Navy & Gold */}
          <motion.h2
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="mt-6 font-sans font-normal text-3xl sm:text-4xl lg:text-[2.6rem] tracking-tight leading-[1.18] text-navy"
          >
            Star Export House,
            <span className="block text-[#8B6128]">Government of India</span>
          </motion.h2>

          {/* Dual-Tone Decorative Underline */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            style={{ originX: 0 }}
            className="mt-6 flex items-center h-0.5 w-36 bg-[#8B6128]/25"
          >
            <span className="h-full w-14 bg-navy" />
          </motion.div>

          {/* Body Paragraphs */}
          <div className="mt-8 space-y-4">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease }}
                className="font-sans font-normal text-base sm:text-lg text-slate leading-relaxed"
              >
                {withReg(paragraph)}
              </motion.p>
            ))}

            <motion.p
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15 + paragraphs.length * 0.1, ease }}
              className="font-sans font-normal text-base sm:text-lg text-slate leading-relaxed"
            >
              {withReg(tradeNotice)}
            </motion.p>
          </div>
        </div>

        {/* Right Column: 3 Stacked Horizontal Rows with Circular Badges (Reduced vertical height ~8%) */}
        <div className="space-y-4.5 pt-0.5">
          {/* Row 01: Global Reach */}
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
            transition={{ duration: 0.65, delay: 0.15, ease }}
            className="flex items-start gap-4 sm:gap-5"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F0F5FA] border border-[#D8E4EF] text-navy">
              <Globe size={25} strokeWidth={1.5} />
            </div>
            <div className="pt-0.5">
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-[#8B6128]">
                01
              </span>
              <h3 className="mt-0.5 font-sans font-normal text-lg sm:text-xl text-navy tracking-tight">
                Global Reach
              </h3>
              <p className="mt-1 font-sans font-normal text-sm sm:text-[0.9375rem] text-slate leading-relaxed">
                Exporting premium luxury fabrics to discerning markets across Africa and the Middle East.
              </p>
            </div>
          </motion.div>

          <div className="h-px w-full bg-line/60 my-3.5" />

          {/* Row 02: End-to-End Craft */}
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
            transition={{ duration: 0.65, delay: 0.25, ease }}
            className="flex items-start gap-4 sm:gap-5"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FAF5EB] border border-[#EBE0CD] text-[#8B6128]">
              {/* Spool / Thread Icon */}
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 3h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                <path d="M7 7v10" />
                <path d="M17 7v10" />
                <path d="M7 10h10" />
                <path d="M7 14h10" />
                <path d="M6 17h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
              </svg>
            </div>
            <div className="pt-0.5">
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-[#8B6128]">
                02
              </span>
              <h3 className="mt-0.5 font-sans font-normal text-lg sm:text-xl text-navy tracking-tight">
                End-to-End Craft
              </h3>
              <p className="mt-1 font-sans font-normal text-sm sm:text-[0.9375rem] text-slate leading-relaxed">
                Mastery across sourcing, manufacturing, supplying, and trading with precision.
              </p>
            </div>
          </motion.div>

          <div className="h-px w-full bg-line/60 my-3.5" />

          {/* Row 03: Export Excellence */}
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2, margin: "-40px 0px" }}
            transition={{ duration: 0.65, delay: 0.35, ease }}
            className="flex items-start gap-4 sm:gap-5"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F0F5FA] border border-[#D8E4EF] text-navy">
              <Star size={25} strokeWidth={1.5} />
            </div>
            <div className="pt-0.5">
              <span className="font-sans text-xs sm:text-sm font-semibold tracking-wider text-[#8B6128]">
                03
              </span>
              <h3 className="mt-0.5 font-sans font-normal text-lg sm:text-xl text-navy tracking-tight">
                Export Excellence
              </h3>
              <p className="mt-1 font-sans font-normal text-sm sm:text-[0.9375rem] text-slate leading-relaxed">
                Honoured with Star Export House status by the Government of India for consistent performance.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}



