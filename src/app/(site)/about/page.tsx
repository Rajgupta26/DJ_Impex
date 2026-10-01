import type { Metadata } from "next";
import Image from "next/image";

import { RecognitionSection } from "@/components/about/RecognitionSection";
import { WelcomeSection } from "@/components/about/WelcomeSection";
import { VisionBanner } from "@/components/vision/VisionBanner";
import { VisionPillars } from "@/components/vision/VisionPillars";
import { ExploreNabeenCTA } from "@/components/ui/ExploreNabeenCTA";
import { withReg } from "@/components/ui/Reg";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("About DJ Impex & Co. & Our Vision"),
  description:
    "DJ Impex & Co. has sourced, manufactured, supplied and traded fabric from Mumbai since 1995, exporting to Africa and the Middle East under the brand Nabeen®. Guided by our five foundational pillars.",
  path: "/about",
});

export default function AboutPage() {
  const about = getPage("about");
  const aboutHead = section(about, "about-dj-impex-co-dji") || section(about, "about-d-j-impex-co-dji");

  const vision = getPage("vision");
  const visionHead = section(vision, "our-vision");
  const pillars = section(vision, "the-five-pillars");

  const title = field(aboutHead, "page-title-h1") || "About DJ Impex & Co.";
  const strapline = field(aboutHead, "strapline") || "Empowering the textile industry with high-quality fabrics.";

  return (
    <>
      <VisionBanner title={title} strapline={strapline} />

      <WelcomeSection />
      <RecognitionSection />

      {/* Five Pillars & Explore Collection with seamless white fabric drape background */}
      <div className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/images/brand-imagery/white-fabric-drape.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={90}
            className="object-cover object-top opacity-70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px]"
          />
        </div>

        <div className="relative z-10">
          <VisionPillars
            heading={pillars.heading}
            intro={withReg(field(visionHead, "intro"))}
            items={pillars.items}
          />
          <ExploreNabeenCTA bg="bg-transparent" />
        </div>
      </div>
    </>
  );
}
