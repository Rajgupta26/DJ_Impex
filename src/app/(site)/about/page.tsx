import type { Metadata } from "next";

import { RecognitionSection } from "@/components/about/RecognitionSection";
import { WelcomeSection } from "@/components/about/WelcomeSection";
import { VisionBanner } from "@/components/vision/VisionBanner";
import { VisionPillars } from "@/components/vision/VisionPillars";
import { withReg } from "@/components/ui/Reg";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("About D J Impex & Co. & Our Vision"),
  description:
    "D J Impex & Co. has sourced, manufactured, supplied and traded fabric from Mumbai since 1995, exporting to Africa and the Middle East under the brand Nabeen®. Guided by our five foundational pillars.",
  path: "/about",
});

export default function AboutPage() {
  const about = getPage("about");
  const aboutHead = section(about, "about-d-j-impex-co-dji");

  const vision = getPage("vision");
  const visionHead = section(vision, "our-vision");
  const pillars = section(vision, "the-five-pillars");

  const title = field(aboutHead, "page-title-h1") || "About D J Impex & Co.";
  const strapline = field(aboutHead, "strapline") || "Empowering the textile industry with high-quality fabrics.";

  return (
    <>
      <VisionBanner title={title} strapline={strapline} />

      <WelcomeSection />
      <RecognitionSection />

      <VisionPillars
        heading={pillars.heading}
        intro={withReg(field(visionHead, "intro"))}
        items={pillars.items}
      />
    </>
  );
}
