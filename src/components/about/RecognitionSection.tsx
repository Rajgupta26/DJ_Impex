import { Container } from "@/components/ui/Container";
import { getPage, getSite } from "@/lib/content";
import { section } from "@/lib/markdown";
import { RecognitionAnimated } from "@/components/about/RecognitionAnimated";

/**
 * Recognition section highlighting Star Export House status,
 * Government of India recognition, and international export reach.
 */
export function RecognitionSection() {
  const site = getSite();
  const recognition = section(getPage("about"), "recognition");

  return (
    <section className="bg-white pt-12 pb-4 lg:pt-16 lg:pb-6">
      <Container>
        <RecognitionAnimated
          companyName={site.brand.company.value}
          starExportHouse={site.brand.starExportHouse.value}
          paragraphs={recognition.paragraphs}
          tradeNotice={`${site.brand.company.value} trades as ${site.brand.brand.value} across ${site.brand.markets.value}.`}
        />
      </Container>
    </section>
  );
}


