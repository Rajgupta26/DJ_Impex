import type { Metadata } from "next";

import { withReg } from "@/components/ui/Reg";
import { VisionBanner } from "@/components/vision/VisionBanner";
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
 * The page opened with three slabs of large type, then with a drawn loom panel.
 * The agency supplied its own banner on 2026-09-23 and asked for it to stand in
 * the opening's place, so the H1, the Cerruti epigraph and the drawn loom have
 * all come off the page. The client's intro line moved down to the pillars
 * rather than going with them. The closing enquiry band came off on 2026-09-23
 * too, so the pillars are the last thing before the footer.
 * See 05-open-questions 117-119 and 126.
 */
export default function VisionPage() {
  const vision = getPage("vision");
  const head = section(vision, "our-vision");
  const pillars = section(vision, "the-five-pillars");

  return (
    <>
      <VisionBanner />

      <VisionPillars heading={pillars.heading} intro={withReg(field(head, "intro"))} items={pillars.items} />
    </>
  );
}
