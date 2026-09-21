import Image from "next/image";
import type { ReactNode } from "react";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * The inner-page hero: shorter than the home hero, a fabric photograph under a
 * navy veil, the H1 set bottom-left. No selvedge here: the selvedge belongs only
 * to the home hero and the footer.
 */
export function PageHero({
  title,
  strapline,
  image,
  alt,
  pending,
  objectPosition = "center",
}: {
  title: ReactNode;
  strapline?: ReactNode;
  image?: string;
  alt?: string;
  /** Shown instead of a photograph while the real image is pending. */
  pending?: string;
  objectPosition?: string;
}) {
  return (
    <section className="on-dark relative flex h-[45vh] min-h-[22rem] items-end overflow-hidden bg-navy-deep text-white md:h-[55vh] md:min-h-[26rem]">
      {image ? (
        <Image
          src={image}
          alt={alt ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      ) : (
        <div className="absolute inset-0">
          <ImagePlaceholder pending={pending ?? "page hero photograph"} />
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(95deg,rgb(13_23_51/0.92)_0%,rgb(23_40_80/0.74)_46%,rgb(23_40_80/0.28)_82%)]"
      />

      <div className="container-site relative pb-[clamp(2.5rem,6vh,4.5rem)] pt-24">
        <h1 className="t-h1 max-w-[18ch]">{title}</h1>
        {strapline ? <p className="t-lead mt-6 max-w-[38rem] text-white/80">{strapline}</p> : null}
      </div>
    </section>
  );
}
