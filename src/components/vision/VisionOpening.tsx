import type { ReactNode } from "react";

import { LoomArt } from "@/components/vision/LoomArt";
import { Container } from "@/components/ui/Container";

/**
 * The opening of /vision.
 *
 * It used to be two dark panels stacked: a hero carrying the H1, then a second
 * navy panel carrying the Cerruti line at 4rem. Nearly a thousand pixels of the
 * same colour with nothing in it but type, which is what made the page feel
 * empty. They are one panel now, over the drawn loom, and the quote is set as a
 * fine counterpoint rather than a second headline competing with the first.
 *
 * The H1 is t-h1, the same size /about and /contact use, not the hero display
 * size: three inner pages should speak at one volume, and what makes this one
 * interesting is the loom behind it, not a larger headline.
 */
export function VisionOpening({
  title,
  intro,
  quote,
  attribution,
}: {
  title: ReactNode;
  intro: ReactNode;
  quote: ReactNode;
  attribution: string | null;
}) {
  return (
    <section className="on-dark relative flex min-h-[clamp(32rem,80vh,48rem)] items-end overflow-hidden bg-navy-deep text-white">
      <LoomArt />

      <Container className="relative pb-[clamp(3.5rem,8vh,6rem)] pt-[clamp(8rem,20vh,12rem)]">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[1.45fr_1fr] lg:items-end">
          <div>
            <h1 className="t-h1 max-w-[17ch]">{title}</h1>
            <p className="t-lead mt-8 max-w-[34rem] text-white/85">{intro}</p>
          </div>

          {/* The client's chosen epigraph, kept but demoted: it belongs to the
              page, it is not the page's own voice. */}
          <figure className="border-l border-accent pl-6 lg:mb-2">
            <blockquote>
              <p className="max-w-[26ch] text-[1.0625rem] leading-[1.6] text-white/80">{quote}</p>
            </blockquote>
            {attribution ? (
              <figcaption className="t-small mt-4 text-white/50">{attribution}</figcaption>
            ) : null}
          </figure>
        </div>
      </Container>
    </section>
  );
}
