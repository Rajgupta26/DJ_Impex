/**
 * Drawn cloth.
 *
 * Most of the photography is still pending, and the brochure scans we do have are
 * 300-480px: too small to carry a hero or a full-bleed panel. Rather than grey
 * boxes or stock images, those slots are filled with the weave itself, drawn as
 * SVG in the brand navy with a thread-thin gold line.
 *
 * It costs about 1KB, scales to any size, and reads as the house's own cloth
 * rather than someone else's photograph. Replace a WeaveArt with a real image the
 * moment the client sends one.
 */

export type WeavePattern = "ogee" | "lace" | "dobby" | "herringbone" | "rib" | "check";

const TILES: Record<WeavePattern, { size: number; body: React.ReactNode }> = {
  /* Brocade ogee: the lattice on the archive jacquards. */
  ogee: {
    size: 120,
    body: (
      <>
        <path
          d="M60 0C36 28 20 44 20 60c0 20 20 38 40 60 20-22 40-40 40-60 0-16-16-32-40-60Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M0 60C-12 74-20 84-20 96c0 15 15 28 30 45M120 60c12 14 20 24 20 36 0 15-15 28-30 45"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <circle cx="60" cy="60" r="3.2" fill="currentColor" opacity="0.55" />
      </>
    ),
  },
  /* Guipure lace: petals thrown around a centre, as on the Swiss lace grounds. */
  lace: {
    size: 100,
    body: (
      <>
        {[0, 45, 90, 135].map((angle) => (
          <ellipse
            key={angle}
            cx="50"
            cy="50"
            rx="30"
            ry="11"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="5" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="100" cy="0" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="0" cy="100" r="2" fill="currentColor" opacity="0.6" />
        <circle cx="100" cy="100" r="2" fill="currentColor" opacity="0.6" />
      </>
    ),
  },
  /* Dobby: the small geometric figure repeated across a shirting. */
  dobby: {
    size: 44,
    body: (
      <>
        <path d="M22 6 38 22 22 38 6 22Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <path d="M22 15 29 22l-7 7-7-7Z" fill="currentColor" opacity="0.4" />
      </>
    ),
  },
  /* Herringbone: the broken twill of the suiting cloths. */
  herringbone: {
    size: 48,
    body: (
      <>
        <path
          d="M0 24 12 12 24 24 36 12 48 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M0 48 12 36 24 48 36 36 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M0 0 12-12 24 0 36-12 48 0" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </>
    ),
  },
  /* Rib: the fine warp rib of Atiku. */
  rib: {
    size: 16,
    body: (
      <>
        <path d="M3 0V16M11 0V16" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 0V16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      </>
    ),
  },
  /* Check: the window-pane of the champagne and camel checks. */
  check: {
    size: 72,
    body: (
      <>
        <path d="M0 0H72M0 36H72M0 0V72M36 0V72" stroke="currentColor" strokeWidth="0.8" />
        <path d="M0 18H72M18 0V72" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
      </>
    ),
  },
};

/** Pick a pattern from a slug, so the same fabric always draws the same cloth. */
export function weaveFor(slug: string): WeavePattern {
  const keys = Object.keys(TILES) as WeavePattern[];
  let sum = 0;
  for (const character of slug) sum += character.charCodeAt(0);
  return keys[sum % keys.length];
}

export function WeaveArt({
  pattern = "ogee",
  tone = "navy",
  scale = 1,
  className = "",
}: {
  pattern?: WeavePattern;
  /** navy: a dark panel. mist: a light panel for alternating sections. */
  tone?: "navy" | "mist";
  scale?: number;
  className?: string;
}) {
  const tile = TILES[pattern];
  const id = `weave-${pattern}-${tone}-${scale}`;
  const dark = tone === "navy";

  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`.trim()}>
      <div
        className={
          dark
            ? "absolute inset-0 bg-[linear-gradient(135deg,var(--color-navy-deep),var(--color-navy)_58%,var(--color-navy-soft))]"
            : "absolute inset-0 bg-[linear-gradient(135deg,var(--color-mist),#fff_60%,var(--color-mist))]"
        }
      />
      <svg
        className={`absolute inset-0 h-full w-full ${dark ? "text-zari" : "text-navy"}`}
        style={{ opacity: dark ? 0.26 : 0.14 }}
        focusable="false"
      >
        <defs>
          <pattern
            id={id}
            width={tile.size * scale}
            height={tile.size * scale}
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scale})`}
          >
            {tile.body}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      {/* A raking-light falloff, so the panel has a direction like lit cloth. */}
      <div
        className={
          dark
            ? "absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_12%,transparent,rgb(13_23_51/0.72))]"
            : "absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_12%,transparent,rgb(238_241_246/0.9))]"
        }
      />
    </div>
  );
}
