import type { ListItem } from "@/lib/markdown";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { WeaveArt, type WeavePattern } from "@/components/ui/WeaveArt";

/**
 * The five pillars, hung on a warp thread.
 *
 * The brief is explicit that these are five equal pillars and not a sequence, so
 * they are never numbered. The thread and the swatches do the work a number
 * would have done: they mark each pillar and tie the five together as one cloth.
 *
 * The swatch is decoration, not a claim. Each pillar draws a different weave
 * simply so no two marks are alike, and the order only avoids putting two
 * similar motifs side by side; none of them says anything about what the pillar
 * means.
 *
 * Tile sizes differ per pattern (44px to 120px), so each carries its own scale,
 * chosen to seat one legible motif inside a 44px swatch.
 */
const MARKS: { pattern: WeavePattern; scale: number }[] = [
  { pattern: "herringbone", scale: 0.82 },
  { pattern: "check", scale: 0.55 },
  { pattern: "lace", scale: 0.42 },
  { pattern: "ogee", scale: 0.36 },
  { pattern: "dobby", scale: 0.9 },
];

export function VisionPillars({
  heading,
  items,
}: {
  heading: string;
  items: ListItem[];
}) {
  return (
    <section className="bg-white py-[var(--spacing-section)]">
      <Container>
        <h2 className="t-h2 max-w-[18ch]">{withReg(heading)}</h2>

        <ul className="mt-14 lg:mt-16">
          {items.map((pillar, index) => {
            const mark = MARKS[index % MARKS.length];
            const last = index === items.length - 1;
            return (
              <li
                key={pillar.lead ?? pillar.text}
                className="grid grid-cols-[2.75rem_1fr] gap-x-5 sm:grid-cols-[3.25rem_1fr] sm:gap-x-8"
              >
                <span aria-hidden="true" className="flex flex-col items-center">
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden bg-navy">
                    <WeaveArt bare pattern={mark.pattern} scale={mark.scale} intensity={0.62} />
                  </span>
                  {/* The warp carrying on to the next pillar. The gap below the
                      text is the content's padding, not the row's, so the thread
                      reaches the next swatch instead of stopping short of it. */}
                  {last ? null : <span className="thread-draw mt-3 w-px flex-1 bg-line" />}
                </span>

                <div
                  className={`lg:grid lg:grid-cols-[15rem_1fr] lg:gap-x-12 ${
                    last ? "" : "pb-12 lg:pb-14"
                  }`.trim()}
                >
                  <h3 className="t-h3 pt-2 lg:pt-1.5">{withReg(pillar.lead ?? "")}</h3>
                  <p className="mt-3 max-w-[36rem] text-slate lg:mt-1">{withReg(pillar.text)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
