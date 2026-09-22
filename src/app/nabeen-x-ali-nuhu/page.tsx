import type { Metadata } from "next";

import { EnquiryBand } from "@/components/layout/EnquiryBand";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { withReg } from "@/components/ui/Reg";
import { TbcTag } from "@/components/ui/TbcTag";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WeaveArt } from "@/components/ui/WeaveArt";
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
  const mission = section(page, "a-social-mission-with-heart");
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

      {/* An editorial long read: one column of prose against a tall portrait. */}
      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
            <div>
              <h2 className="t-h2 max-w-[16ch]">{withReg(gives.heading)}</h2>
              <div className="mt-8 grid gap-5">
                {gives.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="measure text-slate">
                    {withReg(paragraph)}
                  </p>
                ))}
              </div>
            </div>

            <p className="t-lead self-end text-slate lg:pb-2">
              {withReg(`Photographed at the handover to ${site.wear2care.recipients}.`)}
              <TbcTag status={site.wear2care.status} note={site.wear2care._note} />
            </p>
          </div>

          {/* Both photographs at their own 4:3, side by side. A group of people
              does not survive being cropped to a portrait frame. */}
          <ul className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
            {site.wear2care.photos.map((photo) => (
              <li key={photo.file}>
                <figure className="relative aspect-[4/3] w-full overflow-hidden bg-mist">
                  <Image
                    src={`/images/wear2care/${photo.file}`}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 46vw"
                    className="object-cover"
                  />
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* The mission, on navy. */}
      <section className="relative overflow-hidden bg-navy py-[var(--spacing-section)]">
        <WeaveArt pattern="ogee" scale={1.3} />
        <Container className="on-dark relative text-white">
          <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <h2 className="t-h2 max-w-[14ch]">{withReg(mission.heading)}</h2>
            <div className="grid gap-5">
              {mission.paragraphs.map((paragraph) => (
                <p key={paragraph} className="measure text-white/78">
                  {withReg(paragraph)}
                </p>
              ))}
              <p className="measure text-white/78">{withReg(site.socialCause.body)}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-mist py-[var(--spacing-section)]">
        <Container>
          <h2 className="t-h2 max-w-[18ch]">{withReg(join.heading)}</h2>
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

      <EnquiryBand prefill="Hello Nabeen team, I would like to know more about the Wear2Care collection." />
    </>
  );
}
