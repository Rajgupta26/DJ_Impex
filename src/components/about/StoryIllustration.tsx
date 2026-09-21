/**
 * Line illustrations for the story chapters.
 *
 * Drawn here rather than sourced, so they belong to Nabeen: a spinning frame for
 * the founding, a rolled bolt for the craft, and a folded stack for the cloth as
 * it ships today. Fine navy line on white, in the register of a technical pencil
 * drawing, and they scale to any size for about 2KB.
 */

export type StoryDrawing = "spinning-frame" | "rolled-bolt" | "folded-stack";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function StoryIllustration({
  drawing,
  className = "",
}: {
  drawing: StoryDrawing;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 900 620"
      role="img"
      aria-label={LABELS[drawing]}
      className={`h-full w-full text-navy ${className}`.trim()}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {drawing === "spinning-frame" ? <SpinningFrame /> : null}
      {drawing === "rolled-bolt" ? <RolledBolt /> : null}
      {drawing === "folded-stack" ? <FoldedStack /> : null}
    </svg>
  );
}

const LABELS: Record<StoryDrawing, string> = {
  "spinning-frame": "Line drawing of a spinning frame, bobbins feeding yarn onto rollers",
  "rolled-bolt": "Line drawing of a rolled bolt of cloth with a pinked edge",
  "folded-stack": "Line drawing of folded lengths of cloth, stacked",
};

/* ---- The beginning: a spinning frame ------------------------------------- */
function SpinningFrame() {
  const COUNT = 13;
  const frontY = (t: number) => lerp(176, 146, t);
  const frontX = (t: number) => lerp(120, 700, t);

  const bobbins = Array.from({ length: COUNT }, (_, i) => {
    const t = i / (COUNT - 1);
    return { x: frontX(t), y: frontY(t), t };
  });

  return (
    <g stroke="currentColor" opacity="0.72">
      {/* Canopy */}
      <g strokeWidth="1.5">
        <path d="M120 176 L700 146 L800 104 L220 134 Z" />
        <path d="M120 176 L120 152 M700 146 L700 122 M800 104 L800 82 M220 134 L220 112" />
        <path d="M120 152 L700 122 L800 82 L220 112 Z" opacity="0.5" />
      </g>

      {/* Creel: bobbins hanging from the canopy rail */}
      {bobbins.map(({ x, y }, i) => (
        <g key={`b-${i}`} strokeWidth="1.15">
          <ellipse cx={x} cy={y + 6} rx="9" ry="3.6" />
          <path d={`M${x - 9} ${y + 6} L${x - 7} ${y + 36} M${x + 9} ${y + 6} L${x + 7} ${y + 36}`} />
          <ellipse cx={x} cy={y + 36} rx="7" ry="3" />
        </g>
      ))}

      {/* Yarn running from each bobbin down to the draw rollers */}
      <g strokeWidth="0.7" opacity="0.75">
        {bobbins.map(({ x, y, t }, i) => (
          <path key={`y-${i}`} d={`M${x} ${y + 39} L${x - 34} ${lerp(348, 318, t)}`} />
        ))}
      </g>

      {/* Two roller beams */}
      <g strokeWidth="1.5">
        <path d="M86 352 L666 322" />
        <path d="M86 372 L666 342" />
        <ellipse cx="86" cy="362" rx="5" ry="10" />
        <ellipse cx="666" cy="332" rx="5" ry="10" />
        <path d="M78 410 L658 380" />
        <path d="M78 430 L658 400" />
        <ellipse cx="78" cy="420" rx="5" ry="10" />
        <ellipse cx="658" cy="390" rx="5" ry="10" />
      </g>

      {/* Spindles along the base */}
      <g strokeWidth="1.1">
        {Array.from({ length: 19 }, (_, i) => {
          const t = i / 18;
          const x = lerp(96, 648, t);
          const y = lerp(470, 440, t);
          return (
            <g key={`s-${i}`}>
              <ellipse cx={x} cy={y} rx="7" ry="2.8" />
              <path d={`M${x - 7} ${y} L${x - 5} ${y + 30} M${x + 7} ${y} L${x + 5} ${y + 30}`} />
              <ellipse cx={x} cy={y + 30} rx="5" ry="2.2" />
            </g>
          );
        })}
      </g>

      {/* Frame and machine end */}
      <g strokeWidth="1.5">
        <path d="M120 176 L120 540 M700 146 L700 510 M220 134 L220 500" />
        <path d="M120 540 L700 510 M220 500 L700 478" opacity="0.5" />
        <path d="M700 168 L836 138 L836 470 L700 500 Z" />
        <path d="M722 210 L812 190 L812 246 L722 266 Z" opacity="0.6" />
        <circle cx="742" cy="316" r="11" />
        <circle cx="784" cy="306" r="7" />
      </g>

      {/* Floor */}
      <g strokeWidth="0.7" opacity="0.4">
        <path d="M40 566 L860 512" />
        <path d="M120 584 L520 556 M300 596 L740 560" />
      </g>
    </g>
  );
}

/* ---- The craft: a rolled bolt --------------------------------------------- */
function RolledBolt() {
  const rings = Array.from({ length: 7 }, (_, i) => {
    const k = 0.82 ** i;
    return { rx: 142 * k, ry: 176 * k, cx: 596 + i * 5, cy: 312 - i * 3 };
  });

  return (
    <g stroke="currentColor" opacity="0.72">
      {/* The body of the roll, running back to the left */}
      <g strokeWidth="1.5">
        <path d="M584 138 C430 126 300 146 214 186" />
        <path d="M596 486 C446 496 318 474 236 430" />
        <path d="M214 186 C186 200 176 232 180 262 C186 330 202 386 236 430" />
      </g>

      {/* Cloth falling from the roll, finished with a pinked edge */}
      <g strokeWidth="1.4">
        <path d="M236 430 C300 476 380 500 470 508 L470 560 C378 552 296 528 232 480 Z" />
        <path
          d="M232 480 L246 494 L260 480 L274 494 L288 480 L302 494 L316 480 L330 494 L344 480 L358 494 L372 480 L386 494 L400 480 L414 494 L428 480 L442 494 L456 480 L470 494"
          strokeWidth="1"
          opacity="0.8"
        />
      </g>

      {/* Weave running along the roll */}
      <g strokeWidth="0.6" opacity="0.55">
        {Array.from({ length: 9 }, (_, i) => {
          const t = (i + 1) / 10;
          return (
            <path
              key={`w-${i}`}
              d={`M${lerp(214, 584, t)} ${lerp(186, 138, t)} C${lerp(196, 566, t)} ${lerp(260, 250, t)} ${lerp(206, 576, t)} ${lerp(360, 360, t)} ${lerp(236, 596, t)} ${lerp(430, 486, t)}`}
            />
          );
        })}
      </g>

      {/* The face: cloth wound in on itself */}
      <g strokeWidth="1.5">
        <ellipse cx="596" cy="312" rx="142" ry="176" transform="rotate(-7 596 312)" />
      </g>
      <g strokeWidth="0.9" opacity="0.85">
        {rings.slice(1).map((r, i) => (
          <ellipse
            key={`r-${i}`}
            cx={r.cx}
            cy={r.cy}
            rx={r.rx}
            ry={r.ry}
            transform={`rotate(-7 ${r.cx} ${r.cy})`}
          />
        ))}
        <path d="M636 296 C650 302 654 318 644 330 C634 342 616 340 612 326 C608 312 622 290 636 296 Z" />
      </g>
    </g>
  );
}

/* ---- Today: folded lengths, stacked --------------------------------------- */
function FoldedStack() {
  // Chunky enough to read as folded cloth rather than as boards.
  const layers = [
    { y: 492, w: 248, d: 104 },
    { y: 384, w: 226, d: 96 },
    { y: 284, w: 206, d: 88 },
    { y: 192, w: 182, d: 78 },
  ];

  return (
    <g stroke="currentColor" opacity="0.72">
      {layers.map((layer, i) => {
        const cx = 450 + (i % 2 === 0 ? -8 : 10);
        const left = cx - layer.w;
        const right = cx + layer.w;
        return (
          <g key={`l-${i}`}>
            <g strokeWidth="1.5">
              {/* The rounded fold at the left, the face, then the cut end at the
                  right where the cloth was taken off the roll. */}
              <path
                d={`M${left + 10} ${layer.y} C${left - 40} ${layer.y - 6} ${left - 40} ${layer.y - layer.d + 6} ${left + 10} ${layer.y - layer.d} L${right - 18} ${layer.y - layer.d - 18}`}
              />
              <path d={`M${left + 10} ${layer.y} L${right - 6} ${layer.y - 18}`} />
              <path
                d={`M${right - 18} ${layer.y - layer.d - 18} C${right + 8} ${layer.y - layer.d - 10} ${right + 8} ${layer.y - 26} ${right - 6} ${layer.y - 18}`}
              />
            </g>
            {/* Weave across the face */}
            <g strokeWidth="0.55" opacity="0.5">
              {Array.from({ length: 7 }, (_, k) => {
                const t = (k + 1) / 8;
                const y = lerp(layer.y - layer.d, layer.y, t);
                return (
                  <path key={`f-${i}-${k}`} d={`M${left + 4} ${y} L${right - 12} ${y - 18}`} />
                );
              })}
            </g>
          </g>
        );
      })}

      {/* Counter line */}
      <g strokeWidth="0.7" opacity="0.4">
        <path d="M80 470 L820 440" />
        <path d="M150 492 L700 466" />
      </g>
    </g>
  );
}
