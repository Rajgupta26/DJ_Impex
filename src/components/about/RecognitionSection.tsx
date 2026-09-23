import { Container } from "@/components/ui/Container";
import { TrustMarks } from "@/components/ui/TrustMarks";
import { getPage, getSite } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { RecognitionAnimated } from "@/components/about/RecognitionAnimated";

/**
 * Everything the house can be checked on, in one place: the award, the sentence
 * the client wrote about it, and the four marks.
 *
 * The marks used to sit in a section of their own at the top of the page. They
 * belong here -- Star Export House is one of them, so splitting them across two
 * sections said the same thing twice.
 *
 * The award is lifted out of the client's sentence and set large, with the
 * sentence left underneath it in full. The house mark sits above, small: a logo
 * used at its own scale reads as a mark, and blown up reads as a sticker.
 */
export function RecognitionSection() {
  const site = getSite();
  const recognition = section(getPage("about"), "recognition");
  const welcome = section(getPage("about"), "welcome");

  return (
    <section className="page-end bg-white py-[var(--spacing-section)]">
      <Container>
        <RecognitionAnimated
          companyName={site.brand.company.value}
          starExportHouse={site.brand.starExportHouse.value}
          paragraphs={recognition.paragraphs}
          tradeNotice={`${site.brand.company.value} trades as ${site.brand.brand.value} across ${site.brand.markets.value}.`}
          craftText={field(welcome, "craft")}
          invitationText={field(welcome, "invitation")}
          closingText={field(welcome, "closing")}
          trustMarks={<TrustMarks className="mt-8 lg:mt-10" />}
        />
      </Container>
    </section>
  );
}

