import { StoryIllustration, type StoryDrawing } from "@/components/about/StoryIllustration";
import { withReg } from "@/components/ui/Reg";

export type StoryChapter = {
  title: string;
  kicker: string;
  body: string[];
  /** The line drawing that sits beside the words. */
  drawing: StoryDrawing;
};

/**
 * The house story, read the way a page is read.
 *
 * This replaced a pinned, dissolving scroll. The effect worked, but it held the
 * reader still while it played and the words underneath it were the point. Here
 * the three chapters simply alternate down the page, drawing and words trading
 * sides, and a thread of gold marks each one. Nothing waits for the scroll and
 * nothing moves on its own: at any width you can read it at your own speed, and
 * it prints, translates and reads aloud the same way it looks.
 */
export function StoryChapters({ chapters }: { chapters: StoryChapter[] }) {
  return (
    <ol className="grid gap-[clamp(4rem,2.5rem+6vw,8rem)]">
      {chapters.map((chapter, index) => {
        // The drawing changes sides each chapter, so the page has a rhythm
        // rather than a column of identical rows.
        const flip = index % 2 === 1;

        return (
          <li key={chapter.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div className={flip ? "lg:order-2" : undefined}>
              <span aria-hidden="true" className="block h-px w-10 bg-zari" />
              <p className="t-small mt-5 text-slate">{chapter.kicker}</p>
              <h3 className="t-h2 mt-2 text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)]">
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

            {/* 45/31 is the drawings' own viewBox, so they fill the frame
                exactly rather than sitting letterboxed inside it. */}
            <figure
              className={`relative aspect-[45/31] w-full ${flip ? "lg:order-1" : ""}`.trim()}
            >
              <StoryIllustration drawing={chapter.drawing} />
            </figure>
          </li>
        );
      })}
    </ol>
  );
}
