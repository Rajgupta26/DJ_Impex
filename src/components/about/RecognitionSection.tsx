import Image from "next/image";
import { Mail, Phone } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { TrustMarks } from "@/components/ui/TrustMarks";
import { getPage, getSite } from "@/lib/content";
import { mailtoLink, telLink } from "@/lib/contact";
import { field, section } from "@/lib/markdown";

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
    <section className="bg-white py-[var(--spacing-section)]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:items-stretch lg:gap-20">
          <div className="flex flex-col">
            <Image
              src="/images/logos/dji-logo-transparent.png"
              alt={site.brand.company.value}
              width={736}
              height={735}
              className="h-14 w-14"
            />
            <h2 className="t-h2 mt-8 max-w-[12ch]">Recognition</h2>
            <TrustMarks className="mt-12 lg:mt-auto lg:pt-16" />
          </div>

          <div>
            <p className="t-h2 max-w-[16ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] text-navy">
              {site.brand.starExportHouse.value}
            </p>
            <span aria-hidden="true" className="mt-8 block h-px w-16 bg-accent" />

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

            {/* Client craft story and invitation, positioned directly following the trade notice */}
            <div className="mt-8 grid gap-6">
              <p className="measure text-slate">{withReg(field(welcome, "craft"))}</p>
              <p className="measure text-slate">{withReg(field(welcome, "invitation"))}</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <TrackedLink
                href={telLink()}
                event="call_click"
                location="about_recognition"
                external={false}
                className="btn btn-primary"
              >
                <Phone aria-hidden="true" size={18} strokeWidth={1.6} />
                <span>Call us</span>
              </TrackedLink>
              <TrackedLink
                href={mailtoLink("Fabric enquiry")}
                event="email_click"
                location="about_recognition"
                external={false}
                className="btn btn-outline"
              >
                <Mail aria-hidden="true" size={18} strokeWidth={1.6} />
                <span>Mail us</span>
              </TrackedLink>
            </div>

            <p className="t-small mt-12 inline-block border-t border-accent pt-4 font-semibold tracking-[0.02em] text-navy">
              {field(welcome, "closing")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
