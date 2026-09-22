import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TrustMarks } from "@/components/ui/TrustMarks";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/**
 * The house at a glance, directly under the hero.
 *
 * One sentence set large, the four marks beneath it as numerals, and a single
 * photograph standing full height beside them. The marks are the rich part: 1995
 * and 1000+ set at three times body size in the condensed numeral face is what a
 * house of this age is entitled to, and it costs no photography we do not have.
 *
 * The statement is a heading in the document even though it does not look like
 * one, so the page has a spine a screen reader can follow: h1 in the hero, then
 * one h2 a section.
 */
export function AboutOverture() {
  const copy = section(getPage("about"), "the-house");

  return (
    <section className="bg-white py-[var(--spacing-section)]">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[7fr_5fr] lg:items-stretch lg:gap-20">
          {/* Words take the wide column; the marks are pushed to its foot so the
              column reaches the photograph's bottom edge rather than trailing
              off. The same move BriefSection makes on the home page. */}
          <div className="flex flex-col">
            <h2 className="t-small font-semibold text-slate">{field(copy, "eyebrow")}</h2>
            <p className="t-h2 mt-7 max-w-[17ch] text-balance text-[clamp(1.7rem,1.15rem+2.3vw,3rem)] text-navy">
              {withReg(field(copy, "statement"))}
            </p>
            <p className="measure mt-7 text-slate">{withReg(field(copy, "expansion"))}</p>
            <TrustMarks className="mt-auto pt-16" />
          </div>

          <figure className="relative min-h-[24rem] overflow-hidden bg-mist">
            <Image
              src="/images/brand-imagery/spinning-frames-bw.jpg"
              alt="Spinning frames drawing cotton into yarn"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              quality={88}
              className="object-cover"
            />
            <figcaption className="t-small absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgb(13_23_51/0.8))] p-5 font-semibold text-white">
              {field(copy, "photo-caption")}
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
