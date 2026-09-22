import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/** The step label is split off the sentence, which leaves the remainder starting
 *  in lower case ("Cotton: the finest ..." -> "the finest ..."). Sentence case is
 *  a house rule, so the first letter is restored here rather than in the content:
 *  the content file keeps the client's line whole. */
const sentence = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

/** Brochure order, one photograph a step. */
const STEP_IMAGES = [
  "/images/manufacturing/01-cotton.jpg",
  "/images/manufacturing/02-spinning.jpg",
  "/images/manufacturing/03-warping.jpg",
  "/images/manufacturing/04-yarn.jpg",
  "/images/manufacturing/05-stitching-finishing.jpg",
  "/images/manufacturing/06-quality-and-packing.jpg",
  "/images/manufacturing/07-finished-rolls.jpg",
];

/**
 * How the cloth is made: a real sequence, so it is numbered.
 *
 * The brochure photographs are 374-437px square, which is why they are set as
 * squares at about a quarter of the page and never larger. A hairline and a large
 * numeral above each carry the weight the photographs cannot, so the sequence
 * still reads as made rather than as a contact sheet.
 *
 * It scrolls sideways below the grid breakpoint rather than stacking into seven
 * full-width blocks, which would be most of a page of scrolling on a phone.
 */
export function MakingSequence() {
  const process = section(getPage("about"), "how-our-fabric-is-made-brochure-p-4-p-6");

  return (
    <section className="bg-mist py-[var(--spacing-section)]">
      <Container>
        <div className="max-w-[46rem]">
          <h2 className="t-h2">{withReg(process.heading.replace(/\s*\(.*\)$/, ""))}</h2>
          <p className="t-lead mt-5">{withReg(field(process, "intro"))}</p>
        </div>
      </Container>

      <div className="mt-14 overflow-x-auto pb-4 lg:mt-20">
        <ol className="container-site flex min-w-fit gap-6 lg:grid lg:min-w-0 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {process.items.map((step, index) => (
            <li key={step.lead ?? index} className="w-[15rem] shrink-0 lg:w-auto">
              <div className="flex items-baseline gap-4 border-t border-line pt-4">
                <span className="t-number text-[clamp(1.75rem,1.4rem+1.1vw,2.5rem)] leading-none text-navy">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="t-h3">{step.lead}</h3>
              </div>

              <div className="relative mt-6 aspect-square overflow-hidden bg-mist">
                <Image
                  src={STEP_IMAGES[index] ?? STEP_IMAGES[0]}
                  alt={`${step.lead}: ${step.text}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 15rem, 20vw"
                  className="object-cover"
                />
              </div>

              <p className="t-small mt-4 text-slate">{withReg(sentence(step.text))}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
