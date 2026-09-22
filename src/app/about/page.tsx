import type { Metadata } from "next";

import { MakingSequence } from "@/components/about/MakingSequence";
import { RecognitionSection } from "@/components/about/RecognitionSection";
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
 * /about, read top to bottom:
 *
 *   hero            spinning frames, and the page's one h1
 *   recognition     the award, and the four marks
 *   making          seven steps, numbered because they are a real sequence
 *
 * Three sections, all of them cut back to this on the agency's instruction over
 * 2026-09-22. What that leaves out is worth knowing rather than discovering: the
 * client's four "Our story" paragraphs and their prototype welcome copy are both
 * still in about.md and neither is rendered anywhere on the site, and this is the
 * only page with no closing enquiry band, so the sole route to contact from here
 * is the floating buttons. See 05-open-questions.md 81-84.
 *
 * Grounds: photograph, white, mist. No two adjacent sections share one.
 */
export default function AboutPage() {
  const head = section(getPage("about"), "about-d-j-impex-co-dji");

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

      <RecognitionSection />
      <MakingSequence />
    </>
  );
}
