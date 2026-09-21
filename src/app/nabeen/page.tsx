import type { Metadata } from "next";

import { EnquiryBand } from "@/components/layout/EnquiryBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { withReg } from "@/components/ui/Reg";
import { SignatureLines } from "@/components/ui/SignatureLines";
import { TbcTag } from "@/components/ui/TbcTag";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WeaveArt, weaveFor } from "@/components/ui/WeaveArt";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { getPage, getSite } from "@/lib/content";
import { fabricPrefill, whatsappLink } from "@/lib/contact";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Nabeen®"),
  description:
    "Nabeen®: luxury fabrics by D J Impex & Co. Giza cotton, Swiss lace including Zürique, Atiku, voile and jacquard, suiting and wool. Over 1000 designs.",
  path: "/nabeen",
});

export default function NabeenPage() {
  const site = getSite();
  const page = getPage("nabeen");
  const head = section(page, "nabeen");
  const intro = section(page, "introduction");
  const range = section(page, "the-range");
  const promise = section(page, "brand-promise-brochure-p-3");
  const quality = section(page, "quality");
  const closing = section(page, "closing");

  // The brochure runs "Honesty · Integrity · Human dignity. Nabeen stands for
  // Trust, Quality and Excellence." The three words are set large; the first
  // three read as a sentence, because the design system forbids middle dots.
  const coreValues = site.values.slice(0, 3);
  const standsFor = site.values.slice(3);
  const coreLine = `${coreValues.slice(0, -1).join(", ")} and ${coreValues.at(-1)}.`.toLowerCase();

  return (
    <>
      <PageHero
        title={withReg(field(head, "h1"))}
        strapline={withReg(field(head, "strapline"))}
        pattern="ogee"
      />

      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
            <div className="grid gap-5">
              {intro.paragraphs.map((paragraph) => (
                <p key={paragraph} className="measure text-slate">
                  {withReg(paragraph)}
                </p>
              ))}
            </div>

            <div className="hairline-left pl-8">
              <p className="t-small text-slate">
                {withReg(`Nabeen${"\u00AE"} is built on ${coreLine} It stands for:`)}
              </p>
              <ul className="mt-7 grid gap-1">
                {standsFor.map((value) => (
                  <li
                    key={value}
                    className="t-number text-[clamp(2.25rem,1.6rem+2.4vw,3.75rem)] leading-[1.05]"
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* The range, with 1000+ as the page's single big number. */}
      <section className="bg-mist py-[var(--spacing-section)]">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-20">
            <p className="t-number text-[clamp(4.5rem,2.5rem+9vw,10rem)] leading-[0.9]">
              {site.brand.designsCount.value}
              <span className="t-small mt-4 block font-normal [font-stretch:100%] text-slate">
                {field(range, "big-number").replace(/^[\d+]+\s*/, "")}
              </span>
            </p>
            <div className="grid gap-5">
              {range.paragraphs.map((paragraph) => (
                <p key={paragraph} className="measure text-slate">
                  {withReg(paragraph)}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Browse by fabric. Each fabric owns an anchor so the footer tags and the
          journal can deep-link straight to it. */}
      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <h2 className="t-h2">
            Browse by fabric
            <TbcTag status={site.fabricTypes.status} note={site.fabricTypes._note} />
          </h2>

          <ul className="mt-12 grid gap-x-16 md:grid-cols-2">
            {site.fabricTypes.items.map((fabric) => (
              <li key={fabric.slug} id={fabric.slug} className="border-t border-line py-8">
                <div className="flex items-start gap-6">
                  <span className="relative hidden h-20 w-20 shrink-0 overflow-hidden sm:block">
                    <WeaveArt pattern={weaveFor(fabric.slug)} scale={0.5} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="t-h3">{withReg(fabric.name)}</h3>
                    <p className="mt-2 text-slate">{withReg(fabric.line)}</p>
                    <TrackedLink
                      href={whatsappLink(fabricPrefill(fabric.name))}
                      event="whatsapp_click"
                      location="fabric_card"
                      className="mt-4 inline-flex items-center gap-2 text-link"
                    >
                      <WhatsAppGlyph size={16} />
                      <span>Enquire about {fabric.name}</span>
                    </TrackedLink>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-mist py-[var(--spacing-section)]">
        <Container>
          <h2 className="t-h2">
            Signature lines
            <TbcTag status={site.signatureLines.status} note={site.signatureLines._note} />
          </h2>
          <SignatureLines lines={site.signatureLines.fourLines} />
        </Container>
      </section>

      {/* The brand promise, set as the page's one large quote. */}
      <section className="relative overflow-hidden bg-navy-deep py-[clamp(4.5rem,3rem+6vw,8rem)]">
        <WeaveArt pattern="ogee" scale={1.2} />
        <Container className="on-dark relative text-white">
          <figure className="border-l border-zari pl-8 sm:pl-12">
            <blockquote>
              <p className="max-w-[26ch] text-[clamp(1.5rem,1.05rem+1.9vw,2.75rem)] font-light leading-[1.24] [font-stretch:87.5%]">
                {withReg(promise.paragraphs[0]?.replace(/^"|"$/g, "") ?? "")}
              </p>
            </blockquote>
            <figcaption className="t-small mt-8 text-white/60">
              {withReg(field(promise, "sign-off"))}
            </figcaption>
          </figure>
        </Container>
      </section>

      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="t-h3">Quality</h2>
              <p className="measure mt-4 text-slate">{withReg(quality.paragraphs[0] ?? "")}</p>
            </div>
            <div>
              {closing.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-5 max-w-[26ch] text-[clamp(1.375rem,1.05rem+1.2vw,2rem)] font-light leading-[1.26] [font-stretch:87.5%] first:mt-0"
                >
                  {withReg(paragraph)}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <EnquiryBand prefill="Hello Nabeen team, I would like to know more about your fabrics." />
    </>
  );
}
