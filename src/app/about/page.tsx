import type { Metadata } from "next";

import { MakingSequence } from "@/components/about/MakingSequence";
import { RecognitionSection } from "@/components/about/RecognitionSection";
import { StoryChapters, type StoryChapter } from "@/components/about/StoryChapters";
import { WelcomeSection } from "@/components/about/WelcomeSection";
import { EnquiryBand } from "@/components/layout/EnquiryBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { withReg } from "@/components/ui/Reg";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("About D J Impex & Co."),
  description:
    "D J Impex & Co. has sourced, manufactured, supplied and traded fabric from Mumbai since 1995, exporting to Africa and the Middle East under the brand Nabeen®.",
  path: "/about",
});

/**
 * The client's four story paragraphs, split across the three chapter labels:
 * the founding, then the craft, then where the cloth goes today. No copy is
 * rewritten here; it is only grouped.
 */
// One drawing per chapter: the yarn, the cloth on the roll, the cloth made up.
const CHAPTER_DRAWINGS = ["spinning-frame", "rolled-bolt", "tailored-jacket"] as const;
const CHAPTER_SPANS: Array<[number, number]> = [
  [0, 1],
  [1, 3],
  [3, 4],
];

function buildChapters(
  labels: Array<{ lead?: string; text: string }>,
  paragraphs: string[],
): StoryChapter[] {
  return labels.map((label, index) => ({
    title: label.lead ?? "",
    kicker: label.text,
    body: paragraphs.slice(...(CHAPTER_SPANS[index] ?? [index, index + 1])),
    drawing: CHAPTER_DRAWINGS[index] ?? "rolled-bolt",
  }));
}

/**
 * /about, read top to bottom:
 *
 *   hero            a loom, and the page's one h1
 *   welcome         the client's brand writing, and the seven cloths
 *   story           three chapters, drawing and words trading sides
 *   recognition     the award, and the four marks
 *   making          seven steps, numbered because they are a real sequence
 *   enquiry         the same closing band as every inner page
 *
 * Five sections and a closing band, down from eight. What came out was mine, not
 * the client's: an overture that opened the page a third time after the hero and
 * the welcome had both already opened it, and a promise band that was one line
 * of brochure copy on a photograph -- a breather, not information. The four marks
 * moved into Recognition, where Star Export House already was.
 *
 * The grounds still alternate -- photograph, deep navy, white, mist, white, navy
 * -- so no two sections of the same weight sit against each other.
 */
export default function AboutPage() {
  const about = getPage("about");
  const head = section(about, "about-d-j-impex-co-dji");
  const story = section(about, "our-story");
  const chapters = section(about, "story-chapters");

  return (
    <>
      <PageHero
        title={withReg(field(head, "page-title-h1"))}
        strapline={withReg(field(head, "strapline"))}
        /* The loom frame is busy exactly where the strapline sits, and white text
           across lit machinery is hard to read. The spinning frames are an even
           field at that height. */
        image="/images/hero/spinning-frames.jpg"
        alt="Spinning frames drawing cotton into yarn"
        objectPosition="center 42%"
      />

      <WelcomeSection />

      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          {/* Heading only. The line that used to sit here opened "Since 1995",
              the first chapter's kicker reads "Mumbai, 1995" and its first
              sentence is "Since its establishment in 1995" -- three statements of
              the same date within one screen. */}
          <h2 className="t-h2">Our threads, our story</h2>

          <div className="mt-16 lg:mt-24">
            <StoryChapters chapters={buildChapters(chapters.items, story.paragraphs)} />
          </div>
        </Container>
      </section>

      <RecognitionSection />
      <MakingSequence />

      <EnquiryBand />
    </>
  );
}
