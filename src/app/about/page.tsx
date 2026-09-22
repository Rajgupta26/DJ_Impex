import type { Metadata } from "next";

import { MakingSequence } from "@/components/about/MakingSequence";
import { RecognitionSection } from "@/components/about/RecognitionSection";
import { WelcomeSection } from "@/components/about/WelcomeSection";
import { EnquiryBand } from "@/components/layout/EnquiryBand";
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
 *   welcome         the client's brand writing, and the seven cloths
 *   recognition     the award, and the four marks
 *   making          seven steps, numbered because they are a real sequence
 *   enquiry         the same closing band as every inner page
 *
 * Four sections and a closing band. The threaded story went on the agency's
 * instruction; with it went the only place the client's four "Our story"
 * paragraphs were rendered. That copy is still in about.md and is now unused --
 * see 05-open-questions.md 81.
 *
 * The grounds alternate -- photograph, mist, white, mist, navy -- so no two
 * sections of the same weight sit against each other. Removing the story cost
 * a white band, so Recognition and the making sequence swapped grounds to keep
 * that true.
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

      <WelcomeSection />
      <RecognitionSection />
      <MakingSequence />

      <EnquiryBand />
    </>
  );
}
