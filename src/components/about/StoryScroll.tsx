"use client";

import { useEffect, useRef, useState } from "react";

import { StoryIllustration, type StoryDrawing } from "@/components/about/StoryIllustration";
import { withReg } from "@/components/ui/Reg";

export type StoryChapter = {
  title: string;
  kicker: string;
  body: string[];
  /** The line drawing that sits beneath the words. */
  drawing: StoryDrawing;
};

export function StoryScroll({ chapters }: { chapters: StoryChapter[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;

    const handleScroll = () => {
      frame = 0;
      const container = containerRef.current;
      if (!container) return;

      const triggerY = window.innerHeight * 0.42;
      let closestIndex = 0;
      let minDistance = Infinity;

      chapterRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Measure the distance from the chapter reading line to the trigger line
        const elementPoint = rect.top + rect.height * 0.3;
        const distance = Math.abs(elementPoint - triggerY);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);

      // Track vertical progress line down to active chapter node center
      const activeEl = chapterRefs.current[closestIndex];
      if (activeEl) {
        const containerRect = container.getBoundingClientRect();
        const badge = activeEl.querySelector<HTMLElement>(".story-badge");
        if (badge) {
          const badgeRect = badge.getBoundingClientRect();
          const targetY = badgeRect.top - containerRect.top + badgeRect.height / 2;
          setProgressHeight(Math.max(0, targetY));
        }
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(handleScroll);
    };

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [chapters]);

  const scrollToChapter = (index: number) => {
    const el = chapterRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const targetScroll = window.scrollY + rect.top - window.innerHeight * 0.28;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="grid lg:grid-cols-[1.1fr_1.3fr] lg:gap-16 xl:gap-24 relative items-start">
        {/* Left Column: Timeline & Narrative Chapters */}
        <div className="relative">
          {/* Continuous vertical baseline */}
          <div
            className="absolute left-[21px] sm:left-[23px] top-6 bottom-16 w-[2px] bg-line/80 pointer-events-none"
            aria-hidden="true"
          />

          {/* Animated active progress thread line */}
          <div
            className="absolute left-[21px] sm:left-[23px] top-6 w-[2px] bg-[#961c1e] transition-all duration-300 ease-out pointer-events-none"
            style={{ height: `${progressHeight}px` }}
            aria-hidden="true"
          />

          {/* Chapters */}
          <div className="space-y-4 sm:space-y-6">
            {chapters.map((chapter, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={chapter.title || index}
                  ref={(el) => {
                    chapterRefs.current[index] = el;
                  }}
                  data-chapter-index={index}
                  onClick={() => scrollToChapter(index)}
                  className="group relative flex items-start py-10 sm:py-14 lg:py-20 min-h-[50vh] lg:min-h-[68vh] cursor-pointer"
                >
                  {/* Timeline Circular Badge Node */}
                  <div
                    className={`story-badge relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 select-none ${
                      isActive
                        ? "bg-[#961c1e] text-white shadow-lg shadow-[#961c1e]/30 scale-105 ring-4 ring-[#961c1e]/15"
                        : "bg-[#fdf6f6] text-[#961c1e]/40 border border-[#961c1e]/25 scale-95 group-hover:border-[#961c1e]/60 group-hover:text-[#961c1e]/70"
                    }`}
                    aria-label={`Chapter ${index + 1}: ${chapter.title}`}
                  >
                    {/* Siyaram's style vertical thread stitch marker */}
                    <span className="flex items-center gap-[3px]">
                      <span className="w-[3px] h-4 rounded-full bg-current" />
                      <span className="w-[3px] h-4 rounded-full bg-current" />
                    </span>
                  </div>

                  {/* Chapter Narrative Content */}
                  <div
                    className={`ml-6 sm:ml-8 lg:ml-10 transition-all duration-500 ease-out ${
                      isActive
                        ? "opacity-100 translate-y-0"
                        : "opacity-25 translate-y-1 group-hover:opacity-60"
                    }`}
                  >
                    {/* Chapter Kicker */}
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate/90">
                      {chapter.kicker}
                    </p>

                    {/* Chapter Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-serif font-medium text-navy tracking-tight mt-1.5 leading-snug">
                      {withReg(chapter.title.replace(/\.$/, ""))}
                    </h3>

                    {/* Body Paragraphs */}
                    <div className="mt-4 sm:mt-5 space-y-4 text-base lg:text-lg text-slate leading-relaxed max-w-xl">
                      {chapter.body.map((paragraph, pIdx) => (
                        <p key={pIdx}>{withReg(paragraph)}</p>
                      ))}
                    </div>

                    {/* Mobile-only illustration (renders below narrative text on smaller viewports) */}
                    <div className="lg:hidden mt-8 rounded-xl bg-mist/40 p-6 border border-line/60 shadow-sm">
                      <div className="aspect-[4/3] w-full max-w-sm mx-auto">
                        <StoryIllustration drawing={chapter.drawing} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sticky Sketch Illustration Stage (Desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28 xl:top-36 h-[calc(100vh-10rem)] max-h-[640px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center p-6 xl:p-10 rounded-2xl bg-gradient-to-b from-mist/20 via-white to-mist/20 border border-line/40">
              {chapters.map((chapter, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={index}
                    className={`absolute inset-6 xl:inset-10 flex items-center justify-center transition-all duration-700 ease-out ${
                      isActive
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                    aria-hidden={!isActive}
                  >
                    <StoryIllustration
                      drawing={chapter.drawing}
                      className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-700"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
