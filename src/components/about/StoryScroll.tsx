"use client";

import { useEffect, useRef } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

import { StoryIllustration, type StoryDrawing } from "@/components/about/StoryIllustration";
import { withReg } from "@/components/ui/Reg";

export type StoryChapter = {
  title: string;
  kicker: string;
  body: string[];
  /** The line drawing that sits beneath the words. */
  drawing: StoryDrawing;
};

/**
 * The house story, read the way a bolt of cloth runs off the loom.
 *
 * Each chapter pins and then dissolves: it holds still in the viewport while its
 * stretch of scrolling passes, fading as it goes, so the next chapter rises into
 * its place rather than merely covering it. That dissolve is the whole effect;
 * pinning alone reads as the page having stalled.
 *
 * Done with position: sticky and one custom property per chapter rather than a
 * scroll library, so it costs nothing to download and degrades to a plain stacked
 * list wherever sticky is unavailable.
 *
 * A thread-thin gold line runs the length of the section, with the selvedge's own
 * diamond travelling down it as you scroll. The diamond is the marker; the
 * selvedge band itself stays unique to the hero and the footer.
 *
 * Scroll progress is written to a CSS custom property and everything else is CSS,
 * so there is no animation library here and nothing runs off the main thread's
 * critical path. Under prefers-reduced-motion the thread is simply drawn in full
 * and the diamond sits still.
 */
export function StoryScroll({ chapters }: { chapters: StoryChapter[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.style.setProperty("--story-progress", "1");
      return;
    }

    const runs = Array.from(section.querySelectorAll<HTMLElement>(".story__run"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();

      // The thread fills from the moment the section reaches mid-screen.
      const start = window.innerHeight * 0.5;
      const progress = (start - rect.top) / Math.max(1, rect.height);
      section.style.setProperty("--story-progress", clamp(progress).toFixed(4));

      // Each chapter dissolves while it is held, so the next rises into its
      // place rather than merely covering it.
      for (const run of runs) {
        const chapter = run.firstElementChild as HTMLElement | null;
        if (!chapter) continue;
        // Read the pin from the chapter's own resolved `top`, which is in pixels.
        // --story-pin is authored in rem, and parsing that as a number silently
        // yields 8.5 instead of 136.
        const pin = parseFloat(getComputedStyle(chapter).top) || 0;
        const runRect = run.getBoundingClientRect();
        const hold = runRect.height - chapter.offsetHeight;
        if (hold <= 0) {
          run.style.setProperty("--chapter-fade", "0");
          continue;
        }
        const held = clamp((pin - runRect.top) / hold);
        // Stay fully legible for the first third of the hold, then dissolve.
        run.style.setProperty("--chapter-fade", clamp((held - 0.34) / 0.66).toFixed(4));
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={sectionRef} className="story" style={{ ["--story-progress" as string]: 0 }}>
      {/* The thread: a dashed gold rule that fills as the page moves, with the
          diamond riding its leading edge. */}
      <div className="story__thread" aria-hidden="true">
        <span className="story__thread-drawn" />
        <span className="story__diamond" />
      </div>

      <ol className="story__chapters">
        {chapters.map((chapter) => (
          /* Each chapter holds still while its run of scrolling passes, then
             releases as the next takes its place. Pure sticky positioning: the
             same effect as a pinned scroll, with nothing to download. */
          <li key={chapter.title} className="story__run">
            <article className="story__chapter">
              <div className="story__marker" aria-hidden="true" />

              <div className="story__text">
                <p className="t-small text-slate">{chapter.kicker}</p>
                <h3 className="t-h2 mt-3 text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)]">
                  {withReg(chapter.title)}
                </h3>
                <div className="mt-6 grid gap-5">
                  {chapter.body.map((paragraph) => (
                    <p key={paragraph} className="measure text-slate">
                      {withReg(paragraph)}
                    </p>
                  ))}
                </div>
              </div>

              <div className="story__plate">
                <StoryIllustration drawing={chapter.drawing} />
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
