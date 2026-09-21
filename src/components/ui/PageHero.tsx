import Image from "next/image";
import type { ReactNode } from "react";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { WeaveArt, type WeavePattern } from "@/components/ui/WeaveArt";

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
  pattern,
  objectPosition = "center",
}: {
  title: ReactNode;
  strapline?: ReactNode;
  image?: string;
  alt?: string;
  /** Shown instead of a photograph while the real image is pending. */
  pending?: string;
  /**
   * Draw the cloth instead of using a photograph. The gallery scans are 480px,
   * which ASSETS.md marks as tile-sized and not for large use; upscaling one
   * across a full-bleed hero looks worse than drawing the weave.
   */
  pattern?: WeavePattern;
  objectPosition?: string;
}) {
  return (
    <section
      data-hero
      className="on-dark relative flex h-[45vh] min-h-[22rem] items-end overflow-hidden bg-navy-deep text-white md:h-[55vh] md:min-h-[26rem]"
    >
      {pattern && !image ? (
        <WeaveArt pattern={pattern} scale={1.35} />
      ) : image ? (
        <Image
          src={image}
          alt={alt ?? ""}
          fill
          priority
          sizes="100vw"
          quality={88}
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
        className="absolute inset-0 bg-[linear-gradient(100deg,rgb(13_23_51/0.8)_0%,rgb(13_23_51/0.5)_38%,rgb(23_40_80/0.2)_72%,rgb(23_40_80/0.08)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[64%] bg-[linear-gradient(to_top,rgb(13_23_51/0.6)_0%,rgb(13_23_51/0.2)_46%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(125%_115%_at_0%_100%,rgb(13_23_51/0.88)_0%,rgb(13_23_51/0.5)_40%,transparent_74%)]"
      />

      <div className="container-site relative pb-[clamp(2.5rem,6vh,4.5rem)] pt-24">
        <h1 className="t-h1 max-w-[18ch]">{title}</h1>
        {strapline ? <p className="t-lead mt-6 max-w-[32rem] text-white/90">{strapline}</p> : null}
      </div>
    </section>
  );
}
