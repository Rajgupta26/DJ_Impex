import type { Metadata } from "next";

import { ContactChannels } from "@/components/contact/ContactChannels";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { withReg } from "@/components/ui/Reg";
import { getPage, getSite } from "@/lib/content";
import { addressOneLine, mapEmbedSrc, whatsappLink } from "@/lib/contact";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Contact Us"),
  description:
    "Talk to the Nabeen® team about fabric for your market. WhatsApp, phone, email, or send an enquiry and we will reply.",
  path: "/contact",
});

export default function ContactPage() {
  const site = getSite();
  const page = getPage("contact");
  const head = section(page, "contact-us");

  return (
    <>
      <PageHero
        title={withReg(field(head, "h1"))}
        strapline={withReg(field(head, "intro"))}
        pattern="rib"
      />

      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[5fr_7fr] lg:gap-20">
            <div>
              <h2 className="t-h3">Talk to us directly</h2>
              <div className="mt-8">
                <ContactChannels />
              </div>
            </div>

            <div>
              <h2 className="t-h3">Send an enquiry</h2>
              <EnquiryForm
                variant="full"
                fabrics={site.fabricTypes.items.map(({ slug, name }) => ({ slug, name }))}
                whatsappHref={whatsappLink()}
                className="mt-8"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-mist pb-[var(--spacing-section)]">
        <Container>
          <div className="relative aspect-[16/9] overflow-hidden bg-navy-deep md:aspect-[21/9]">
            <MapEmbed src={mapEmbedSrc()} label={addressOneLine()} />
          </div>
        </Container>
      </section>
    </>
  );
}
