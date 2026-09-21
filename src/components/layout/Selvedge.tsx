import { Fragment } from "react";

import { Reg } from "@/components/ui/Reg";
import { getSite } from "@/lib/content";

/**
 * The signature.
 *
 * A bolt of fine cloth carries its maker's name woven into the selvedge, the
 * finished edge. This band does the same, and appears exactly twice on the site:
 * along the bottom edge of the hero, and along the top edge of the footer.
 * Do not use it anywhere else.
 *
 * Decorative, so aria-hidden. The hero band drifts on a 60s loop; the footer band
 * is static. Both are static under prefers-reduced-motion (handled in tokens.css).
 */
export function Selvedge({ variant }: { variant: "hero" | "footer" }) {
  const site = getSite();

  const words = [
    <>
      {site.brand.brand.value.replace("®", "")}
      <Reg />
    </>,
    site.brand.logoTagline.value,
    `Est. ${site.brand.founded.value}`,
    "Star Export House",
  ];

  // Six repeats so the -50% loop in tokens.css lands on an identical frame
  // at any viewport width.
  const run = Array.from({ length: 6 }, (_, group) => (
    <Fragment key={group}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span>{word}</span>
          <i className="selvedge__mark" />
        </Fragment>
      ))}
    </Fragment>
  ));

  return (
    <div className="selvedge" aria-hidden="true">
      <div className="selvedge__track" style={variant === "footer" ? { animation: "none" } : undefined}>
        {run}
      </div>
    </div>
  );
}
