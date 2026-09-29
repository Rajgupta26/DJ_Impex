import type { Metadata } from "next";

import { AliNuhuGivesBack } from "@/components/nabeen/AliNuhuGivesBack";
import { AliNuhuMissionHeading } from "@/components/nabeen/AliNuhuMissionHeading";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { withReg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { getPage, getSite } from "@/lib/content";
import { whatsappLink } from "@/lib/contact";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Nabeen x Ali Nuhu"),
  description:
    "Wear2Care x Ali Nuhu by Nabeen®: a collaboration with Nigeria's most cherished actor supporting child education and welfare across Nigeria.",
  path: "/nabeen-x-ali-nuhu",
});

export default function AliNuhuPage() {
  const site = getSite();
  const page = getPage("nabeen-x-ali-nuhu");
  const head = section(page, "nabeen-x-ali-nuhu");
  const gives = section(page, "luxury-that-gives-back");
  const join = section(page, "join-the-mission-wear2care-wear2transform-lives");

  return (
    <>
      <PageHero
        title={withReg(field(head, "h1"))}
        strapline={withReg(field(head, "strapline"))}
        image="/images/wear2care/handover.jpg"
        alt={site.wear2care.photos[0].alt}
        objectPosition="center 32%"
      />

      <AliNuhuGivesBack heading={gives.heading} paragraphs={gives.paragraphs} photos={site.wear2care.photos} />

      <section className="bg-mist py-10 sm:py-12 md:py-16">
        <Container>
          <AliNuhuMissionHeading heading={join.heading} />
          <div className="mt-8 grid gap-5">
            {join.paragraphs.map((paragraph) => (
              <p key={paragraph} className="measure text-slate">
                {withReg(paragraph)}
              </p>
            ))}
          </div>

          <p className="mt-10">
            <TrackedLink
              href={whatsappLink(
                "Hello Nabeen team, I would like to know more about the Wear2Care collection.",
              )}
              event="whatsapp_click"
              location="cause"
              className="btn btn-primary"
            >
              <WhatsAppGlyph size={20} />
              <span>Enquire about the Wear2Care collection</span>
            </TrackedLink>
          </p>
        </Container>
      </section>
    </>
  );
}
