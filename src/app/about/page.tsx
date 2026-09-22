import Image from "next/image";
import type { Metadata } from "next";

import { StoryScroll, type StoryChapter } from "@/components/about/StoryScroll";
import { EnquiryBand } from "@/components/layout/EnquiryBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { withReg } from "@/components/ui/Reg";
import { TrustMarks } from "@/components/ui/TrustMarks";
import { getPage, getSite } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("About D J Impex & Co."),
  description:
    "D J Impex & Co. has sourced, manufactured, supplied and traded fabric from Mumbai since 1995, exporting to Africa and the Middle East under the brand Nabeen®.",
  path: "/about",
});

const STEP_IMAGES = [
  "/images/manufacturing/01-cotton.jpg",
  "/images/manufacturing/02-spinning.jpg",
  "/images/manufacturing/03-warping.jpg",
  "/images/manufacturing/04-yarn.jpg",
  "/images/manufacturing/05-stitching-finishing.jpg",
  "/images/manufacturing/06-quality-and-packing.jpg",
  "/images/manufacturing/07-finished-rolls.jpg",
];

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
    title: (label.lead ?? "").replace(/\.$/, ""),
    kicker: label.text,
    body: paragraphs.slice(...(CHAPTER_SPANS[index] ?? [index, index + 1])),
    drawing: CHAPTER_DRAWINGS[index] ?? "rolled-bolt",
  }));
}

export default function AboutPage() {
  const site = getSite();
  const about = getPage("about");
  const head = section(about, "about-d-j-impex-co-dji");
  const story = section(about, "our-story");
  const chapters = section(about, "story-chapters");
  const recognition = section(about, "recognition");
  const process = section(about, "how-our-fabric-is-made-brochure-p-4-p-6");

  return (
    <>
      <PageHero
        title={withReg(field(head, "page-title-h1"))}
        strapline={withReg(field(head, "strapline"))}
        image="/images/hero/spinning-frames.jpg"
        alt="Spinning frames drawing cotton into yarn"
      />

      {/* The story runs down a thread, matching the reference video timeline flow */}
      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16 pb-10 sm:pb-14 border-b border-line/60">
            <div>
              <h2 className="text-[clamp(2.5rem,1.8rem+3vw,4.25rem)] font-serif font-medium text-navy leading-tight tracking-tight">
                Our Threads.<br />Our Story.
              </h2>
            </div>
            <div className="md:max-w-md md:ml-auto">
              <p className="t-lead text-slate leading-relaxed">
                {withReg(
                  `Since ${site.brand.founded.value}, from a counter in Mangaldas Market to ${site.brand.markets.value}.`,
                )}
              </p>
            </div>
          </div>

          <div className="mt-12 lg:mt-16">
            <StoryScroll chapters={buildChapters(chapters.items, story.paragraphs)} />
          </div>
        </Container>
      </section>

      <section className="bg-mist py-[var(--spacing-section)]">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
            <div>
              <Image
                src="/images/logos/dji-logo-transparent.png"
                alt="D J Impex & Co."
                width={736}
                height={735}
                className="mb-8 h-16 w-16"
              />
              <h2 className="t-h2 max-w-[14ch]">Recognition</h2>
              {recognition.paragraphs.map((paragraph) => (
                <p key={paragraph} className="measure mt-8 text-slate">
                  {withReg(paragraph)}
                </p>
              ))}
              <p className="measure mt-6 text-slate">
                {withReg(
                  `${site.brand.company.value} trades as ${site.brand.brand.value} across ${site.brand.markets.value}.`,
                )}
              </p>
            </div>
            <TrustMarks className="lg:pt-2" />
          </div>
        </Container>
      </section>

      {/* The process is a real sequence, so numbering it is correct here.
          The brochure images are small, so they stay thumbnails: never full bleed. */}
      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <div className="max-w-[46rem]">
            <h2 className="t-h2">{withReg(process.heading.replace(/\s*\(.*\)$/, ""))}</h2>
            <p className="t-lead mt-5">{withReg(field(process, "intro"))}</p>
          </div>
        </Container>

        <div className="mt-14 overflow-x-auto pb-4">
          <ol className="container-site flex min-w-fit gap-6 lg:grid lg:min-w-0 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
            {process.items.map((step, index) => (
              <li key={step.lead ?? index} className="w-[15rem] shrink-0 lg:w-auto">
                <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                  <Image
                    src={STEP_IMAGES[index] ?? STEP_IMAGES[0]}
                    alt={`${step.lead}: ${step.text}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 15rem, 20vw"
                    className="object-cover"
                  />
                </div>
                <p className="t-number mt-4 text-[1.5rem] leading-none text-slate">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="t-h3 mt-2">{step.lead}</h3>
                <p className="t-small mt-2 text-slate">{withReg(step.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <EnquiryBand />
    </>
  );
}
