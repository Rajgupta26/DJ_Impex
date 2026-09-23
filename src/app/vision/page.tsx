import type { Metadata } from "next";

import { EnquiryBand } from "@/components/layout/EnquiryBand";
import { withReg } from "@/components/ui/Reg";
import { VisionOpening } from "@/components/vision/VisionOpening";
import { VisionPillars } from "@/components/vision/VisionPillars";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Our Vision"),
  description:
    "Five pillars behind Nabeen® and D J Impex & Co.: inspiring admiration, world-class pursuit, quantum growth, ethical excellence and empowering minds.",
  path: "/vision",
});

/**
 * Our Vision.
 *
 * The page was three slabs of large type on flat grounds -- a hero, the Cerruti
 * quote at 4rem, and the client's closing line at 2.5rem -- with the pillars
 * between them. The agency asked for the slabs to go (2026-09-23). The opening
 * is one composed panel now, the pillars carry the page, and the closing line is
 * not rendered; its copy is still in content/vision.md. See 05-open-questions 108.
 */
export default function VisionPage() {
  const vision = getPage("vision");
  const head = section(vision, "our-vision");
  const pillars = section(vision, "the-five-pillars");

  const [quoteText, attribution] = splitQuote(field(head, "opening-quote"));

  return (
    <>
      <VisionOpening
        title={withReg(field(head, "h1"))}
        intro={withReg(field(head, "intro"))}
        quote={withReg(quoteText)}
        attribution={attribution}
      />

      <VisionPillars heading={pillars.heading} items={pillars.items} />

      <EnquiryBand />
    </>
  );
}

/** '"Only an excellent fabric…" (Nino Cerruti)' -> [quote, "Nino Cerruti"] */
function splitQuote(raw: string): [string, string | null] {
  const match = /^"?(.+?)"?\s*\(([^)]+)\)\s*$/.exec(raw.trim());
  if (!match) return [raw.replace(/^"|"$/g, ""), null];
  return [match[1].replace(/^"|"$/g, ""), match[2]];
}
