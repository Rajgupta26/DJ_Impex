import Image from "next/image";

import { Selvedge } from "@/components/layout/Selvedge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reg, withReg } from "@/components/ui/Reg";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { TrustMarks } from "@/components/ui/TrustMarks";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { getPage, getSite } from "@/lib/content";
import { whatsappLink } from "@/lib/contact";
import { section } from "@/lib/markdown";

/**
 * Phase 1 placeholder: enough of the home page to prove the shell works
 * (header scroll state, selvedge, footer, floating actions, popup).
 * Phase 2 replaces this with the client's full section order.
 */
export default function HomePage() {
  const site = getSite();
  const home = getPage("home");
  const brief = section(home, "3-short-brief-client-copy-lightly-trimmed");

  return (
    <>
      <section
        data-hero
        className="on-dark relative flex h-[min(92vh,860px)] min-h-[34rem] items-end overflow-hidden bg-navy-deep text-white"
      >
        <Image
          src="/images/brand-imagery/fabric-blush-stripe-macro.jpg"
          alt="Blush striped Nabeen shirting fabric in raking light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "60% 40%" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(95deg,rgb(13_23_51/0.92)_0%,rgb(23_40_80/0.72)_42%,rgb(23_40_80/0.15)_78%)]"
        />

        <Container className="relative pb-[clamp(3rem,9vh,6rem)] pt-28">
          <p className="mb-5 font-medium text-white/80">
            {withReg(site.brand.brand.value)} by {site.brand.company.value}
          </p>
          <h1 className="t-display max-w-[14ch]">House of luxury men&rsquo;s fabrics</h1>
          <p className="t-lead mt-6 max-w-[32rem] text-white/80">
            Woven in India since {site.brand.founded.value} for {site.brand.markets.value}.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <TrackedLink
              href={whatsappLink()}
              event="whatsapp_click"
              location="hero"
              className="btn btn-on-dark"
            >
              <WhatsAppGlyph size={20} />
              <span>Enquire on WhatsApp</span>
            </TrackedLink>
            <ButtonLink href="/nabeen" variant="ghost">
              Explore Nabeen
              <Reg />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Selvedge variant="hero" />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-20">
          <div>
            <h2 className="t-h2 max-w-[16ch]">{withReg(`A house of fabric since ${site.brand.founded.value}`)}</h2>
            {brief.paragraphs.map((paragraph) => (
              <p key={paragraph} className="measure mt-6 text-slate">
                {withReg(paragraph)}
              </p>
            ))}
            <p className="mt-9">
              <TextLink href="/about">Read our story</TextLink>
            </p>
          </div>

          <TrustMarks />
        </div>
      </Section>
    </>
  );
}
