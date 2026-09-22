import type { Metadata } from "next";

import { RecognitionSection } from "@/components/about/RecognitionSection";
import { WelcomeSection } from "@/components/about/WelcomeSection";
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
 *   welcome         the client's revised welcome, and the fabric list
 *   recognition     the award, and the four marks
 *
 * Grounds: photograph, mist, white. No two adjacent sections share one.
 *
 * Still rendered nowhere on the site, and still sitting in about.md: the
 * client's "Our story" paragraphs and the seven-step "How our fabric is made"
 * sequence, whose brochure photographs are also now unused assets. The page has
 * no closing enquiry band, unlike every other inner page.
 * See 05-open-questions.md 81, 84, 85.
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
    </>
  );
}
