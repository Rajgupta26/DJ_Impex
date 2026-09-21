import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

type Tone = "white" | "mist" | "navy" | "navy-deep";

const TONES: Record<Tone, string> = {
  white: "bg-white text-navy",
  mist: "bg-mist text-navy",
  navy: "bg-navy text-white on-dark",
  "navy-deep": "bg-navy-deep text-white on-dark",
};

/**
 * Vertical rhythm between sections: 80px on mobile opening to 160px on desktop
 * (--spacing-section). Backgrounds alternate white and Giza Mist; no borders,
 * no card shadows.
 */
export function Section({
  tone = "white",
  id,
  className = "",
  bleed = false,
  children,
}: {
  tone?: Tone;
  id?: string;
  className?: string;
  /** Skip the container when the section lays out its own full-bleed grid. */
  bleed?: boolean;
  children: ReactNode;
}) {
  const content = bleed ? children : <Container>{children}</Container>;
  return (
    <section
      id={id}
      className={`${TONES[tone]} py-[var(--spacing-section)] ${className}`.trim()}
    >
      {content}
    </section>
  );
}
