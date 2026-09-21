import Image from "next/image";
import type { Metadata } from "next";

import { EnquiryBand } from "@/components/layout/EnquiryBand";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { withReg } from "@/components/ui/Reg";
import { TrustMarks } from "@/components/ui/TrustMarks";
import { getPage, getSite } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("About D J Impex & Co."),
  description:
    "D J Impex & Co. has sourced, manufactured, supplied and traded fabric from Mumbai since 1995, exporting to Africa and the Middle East under the brand Nabeen®.",
  path: "/about",
});

const STEP_IMAGES = [
  "/images/manufacturing/01-cotton.jpg",
  "/images/manufacturing/02-spinning.jpg",
  "/images/manufacturing/03-warping.jpg",
  "/images/manufacturing/04-yarn.jpg",
  "/images/manufacturing/05-stitching-finishing.jpg",
  "/images/manufacturing/06-quality-and-packing.jpg",
  "/images/manufacturing/07-finished-rolls.jpg",
];

export default function AboutPage() {
  const site = getSite();
  const about = getPage("about");
  const head = section(about, "about-d-j-impex-co-dji");
  const story = section(about, "our-story");
  const recognition = section(about, "recognition");
  const process = section(about, "how-our-fabric-is-made-brochure-p-4-p-6");

  return (
    <>
      <PageHero
        title={withReg(field(head, "page-title-h1"))}
        strapline={withReg(field(head, "strapline"))}
        image="/images/hero/spinning-frames.jpg"
        alt="Spinning frames drawing cotton into yarn"
      />

      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
            <div>
              <h2 className="t-h2 max-w-[14ch]">Our story</h2>
              <div className="mt-8 grid gap-5">
                {story.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="measure text-slate">
                    {withReg(paragraph)}
                  </p>
                ))}
              </div>
            </div>

            <figure className="relative aspect-[4/5] overflow-hidden bg-mist">
              <Image
                src="/images/brand-imagery/weaving-loom.jpg"
                alt="Warp threads running through a loom"
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="object-cover saturate-[0.5]"
              />
            </figure>
          </div>
        </Container>
      </section>

      <section className="bg-mist py-[var(--spacing-section)]">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:gap-20">
            <div>
              <Image
                src="/images/logos/dji-logo-transparent.png"
                alt="D J Impex & Co."
                width={736}
                height={735}
                className="mb-8 h-16 w-16"
              />
              <h2 className="t-h2 max-w-[14ch]">Recognition</h2>
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
            <TrustMarks className="lg:pt-2" />
          </div>
        </Container>
      </section>

      {/* The process is a real sequence, so numbering it is correct here.
          The brochure images are small, so they stay thumbnails: never full bleed. */}
      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          <div className="max-w-[46rem]">
            <h2 className="t-h2">{withReg(process.heading.replace(/\s*\(.*\)$/, ""))}</h2>
            <p className="t-lead mt-5">{withReg(field(process, "intro"))}</p>
          </div>
        </Container>

        <div className="mt-14 overflow-x-auto pb-4">
          <ol className="container-site flex min-w-fit gap-6 lg:grid lg:min-w-0 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
            {process.items.map((step, index) => (
              <li key={step.lead ?? index} className="w-[15rem] shrink-0 lg:w-auto">
                <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                  <Image
                    src={STEP_IMAGES[index] ?? STEP_IMAGES[0]}
                    alt={`${step.lead}: ${step.text}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 15rem, 20vw"
                    className="object-cover"
                  />
                </div>
                <p className="t-number mt-4 text-[1.5rem] leading-none text-slate">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="t-h3 mt-2">{step.lead}</h3>
                <p className="t-small mt-2 text-slate">{withReg(step.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <EnquiryBand />
    </>
  );
}
