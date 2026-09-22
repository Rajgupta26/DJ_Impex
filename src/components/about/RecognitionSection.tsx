import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { getPage, getSite } from "@/lib/content";
import { section } from "@/lib/markdown";

/**
 * The Star Export House award, set as the one claim on the page that a
 * government made rather than the client.
 *
 * The award itself is lifted out of the client's sentence and set large, with
 * the sentence left underneath it in full. The house mark sits above, small: a
 * logo used at its own scale reads as a mark, and blown up reads as a sticker.
 */
export function RecognitionSection() {
  const site = getSite();
  const recognition = section(getPage("about"), "recognition");

  return (
    <section className="bg-mist py-[var(--spacing-section)]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div>
            <Image
              src="/images/logos/dji-logo-transparent.png"
              alt={site.brand.company.value}
              width={736}
              height={735}
              className="h-14 w-14"
            />
            <h2 className="t-h2 mt-8 max-w-[12ch]">Recognition</h2>
          </div>

          <div>
            <p className="t-h2 max-w-[16ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] text-navy">
              {site.brand.starExportHouse.value}
            </p>
            <span aria-hidden="true" className="mt-8 block h-px w-16 bg-zari" />

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
        </div>
      </Container>
    </section>
  );
}
