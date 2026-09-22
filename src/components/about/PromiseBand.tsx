import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { getPage, getSite } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/**
 * The client's own sign-off, given a wall of its own.
 *
 * A page this long needs somewhere to stop reading, and a house that sells cloth
 * should be willing to show some.
 *
 * Set light, not dark. The first build put white type over a navy wash, which is
 * what every other band here does -- but this photograph is a white jacquard, and
 * a wash heavy enough to carry white type turned the whole frame into flat navy
 * with the weave invisible. Navy type on a pale scrim keeps the cloth, and it
 * gives the page one bright moment between the deep navy welcome above and the
 * mist below. The eyebrow is slate rather than gold: gold on a light ground
 * measures 2.88:1 and fails AA (question 31).
 */
export function PromiseBand() {
  const copy = section(getPage("about"), "our-promise");
  const promise = getSite().brand.brandPromiseSignoff;

  return (
    <section className="relative isolate flex min-h-[24rem] items-end overflow-hidden bg-mist md:min-h-[32rem]">
      <Image
        src="/images/hero/marconi-white.jpg"
        alt={field(copy, "photo-caption")}
        fill
        loading="lazy"
        sizes="100vw"
        quality={88}
        className="object-cover"
        style={{ objectPosition: "center 46%" }}
      />

      {/* Enough to read against, and no more: the weave still shows through it
          and is untouched past two thirds of the width. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(100deg,rgb(255_255_255/0.94)_0%,rgb(255_255_255/0.78)_32%,rgb(255_255_255/0.22)_66%,transparent_100%)]"
      />

      <Container className="relative py-[clamp(3rem,2rem+3.5vw,5.5rem)]">
        <span aria-hidden="true" className="block h-px w-12 bg-zari" />
        <h2 className="t-small mt-5 font-semibold text-slate">{field(copy, "eyebrow")}</h2>
        <p className="t-h1 mt-4 max-w-[14ch] text-navy">{withReg(promise.value)}</p>
      </Container>
    </section>
  );
}
