import type { Metadata } from "next";

import { EnquiryBand } from "@/components/layout/EnquiryBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { withReg } from "@/components/ui/Reg";
import { TextLink } from "@/components/ui/TextLink";
import { WeaveArt } from "@/components/ui/WeaveArt";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("Our Vision"),
  description:
    "Five pillars behind Nabeen® and D J Impex & Co.: inspiring admiration, world-class pursuit, quantum growth, ethical excellence and empowering minds.",
  path: "/vision",
});

export default function VisionPage() {
  const vision = getPage("vision");
  const head = section(vision, "our-vision");
  const pillars = section(vision, "the-five-pillars");
  const closing = section(vision, "closing-line");

  const quote = field(head, "opening-quote");
  const [quoteText, attribution] = splitQuote(quote);

  return (
    <>
      <PageHero
        title={withReg(field(head, "h1"))}
        pattern="dobby"
      />

      {/* The Nino Cerruti line opens the page, set very large. */}
      <section className="relative overflow-hidden bg-navy-deep py-[clamp(4.5rem,3rem+6vw,8rem)]">
        <WeaveArt pattern="herringbone" scale={1.1} />
        <Container className="on-dark relative text-white">
          <figure className="border-l border-zari pl-8 sm:pl-12">
            <blockquote>
              <p className="max-w-[20ch] text-[clamp(2rem,1.3rem+3.2vw,4rem)] font-light leading-[1.12] tracking-[-0.01em] [font-stretch:80%]">
                {withReg(quoteText)}
              </p>
            </blockquote>
            {attribution ? (
              <figcaption className="t-small mt-8 text-white/60">{attribution}</figcaption>
            ) : null}
          </figure>
        </Container>
      </section>

      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <p className="t-lead measure">{withReg(field(head, "intro"))}</p>

          {/* Five equal pillars, not a sequence: never numbered. */}
          <ul className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {pillars.items.map((pillar) => (
              <li key={pillar.lead} className="border-t border-line pt-7">
                <h2 className="t-h3">{withReg(pillar.lead ?? "")}</h2>
                <p className="mt-3 max-w-[34rem] text-slate">{withReg(pillar.text)}</p>
                {pillar.lead === "Empowering Minds" ? (
                  <p className="mt-5">
                    <TextLink href="/nabeen-x-ali-nuhu">About Wear2Care</TextLink>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-mist py-[clamp(4rem,2.5rem+5vw,7rem)]">
        <Container>
          {closing.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-[24ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-light leading-[1.22] [font-stretch:80%]"
            >
              {withReg(paragraph)}
            </p>
          ))}
        </Container>
      </section>

      <EnquiryBand />
    </>
  );
}

/** '"Only an excellent fabric…" (Nino Cerruti)' -> [quote, "Nino Cerruti"] */
function splitQuote(raw: string): [string, string | null] {
  const match = /^"?(.+?)"?\s*\(([^)]+)\)\s*$/.exec(raw.trim());
  if (!match) return [raw.replace(/^"|"$/g, ""), null];
  return [match[1].replace(/^"|"$/g, ""), match[2]];
}
