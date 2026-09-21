import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TextLink } from "@/components/ui/TextLink";
import { TrustMarks } from "@/components/ui/TrustMarks";
import { getPage, getSite } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/**
 * The company in two paragraphs, set 7/5 against the trust marks, with a single
 * archive swatch to break the column. Asymmetric on purpose: rows of equal
 * columns are what make a site look templated.
 */
export function BriefSection() {
  const site = getSite();
  const brief = section(getPage("home"), "3-short-brief");
  const linkLabel = field(brief, "link").split("→")[0].replace(/"/g, "").trim();

  return (
    <section className="bg-white py-[var(--spacing-section)]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div>
            <h2 className="t-h2 max-w-[15ch]">
              {withReg(`A house of cloth since ${site.brand.founded.value}`)}
            </h2>

            <div className="mt-8 grid gap-5">
              {brief.paragraphs.map((paragraph) => (
                <p key={paragraph} className="measure text-slate">
                  {withReg(paragraph)}
                </p>
              ))}
            </div>

            <p className="mt-9">
              <TextLink href="/about">{linkLabel}</TextLink>
            </p>
          </div>

          <div className="grid content-between gap-12">
            <figure className="relative aspect-[5/4] overflow-hidden bg-mist lg:aspect-[4/5]">
              <Image
                src="/images/gallery/05-camel-check-jacquard.jpg"
                alt="Camel check jacquard fabric from the Nabeen range"
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="object-cover"
              />
              <figcaption className="t-small absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(13_23_51/0.8))] p-5 font-semibold text-white">
                Archive · camel check jacquard
              </figcaption>
            </figure>

            <TrustMarks />
          </div>
        </div>
      </Container>
    </section>
  );
}
