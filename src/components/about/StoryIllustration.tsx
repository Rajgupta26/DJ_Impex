/**
 * Line illustrations for the story chapters.
 *
 * Drawn here rather than sourced, so they belong to Nabeen: a spinning frame for
 * the founding, a rolled bolt for the craft, and a finished jacket on the form for
 * where the cloth ends up. Fine navy line on white, in the register of a technical pencil
 * drawing, and they scale to any size for about 2KB.
 */

export type StoryDrawing = "spinning-frame" | "rolled-bolt" | "tailored-jacket";

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
      {drawing === "tailored-jacket" ? <TailoredJacket /> : null}
    </svg>
  );
}

const LABELS: Record<StoryDrawing, string> = {
  "spinning-frame": "Line drawing of a spinning frame, bobbins feeding yarn onto rollers",
  "rolled-bolt": "Line drawing of a rolled bolt of cloth with a pinked edge",
  "tailored-jacket":
    "Line drawing of a tailored jacket on a tailor's form, in a fitting room",
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
function TailoredJacket() {
  /* Where a length of Nabeen cloth ends up: cut, made and standing on the form.
     Drawn as one half and mirrored, because a jacket is cut from a pattern that
     is itself symmetrical. The pieces that are not — the tie, the buttons, the
     square on the left breast — are drawn once, over the top.

     The silhouette runs shoulder, down the outside of the sleeve, round the
     cuff, then on down the body to the hem: above the cuff the body is behind
     the sleeve and has no edge of its own. The sleeve's inseam and head are
     drawn after, as seams rather than as outline, which is the difference
     between a jacket and a coat with lines through it. */
  const half = (
    <g>
      {/* Silhouette. */}
      <path d="M447 154 C414 160 366 176 334 204" />
      <path d="M334 204 C314 284 309 396 315 482" />
      <path d="M315 482 C312 498 316 509 325 516 L376 524" />
      <path d="M376 524 C374 538 371 548 368 558" />
      <path d="M368 558 C396 568 424 572 450 573" />

      {/* Peak lapel: the edge up to the peak, the notch, then the collar. */}
      <path d="M444 352 L392 258 L416 238" />
      <path d="M416 238 C424 214 434 194 447 172" />

      {/* Seams and folds, lighter than the cut edges. */}
      <g strokeWidth="0.9" opacity="0.6">
        <path d="M376 524 C383 462 383 346 379 268" />
        <path d="M334 204 C351 220 368 244 379 268" />
        <path d="M443 352 C435 306 433 246 438 196" />
      </g>

      {/* Breast welt and hip flap. */}
      <path d="M358 292 L408 302 L406 314 L356 304 Z" strokeWidth="0.9" />
      <path d="M344 406 L404 416 L400 437 L340 427 Z" strokeWidth="0.9" />

      {/* Cuff buttons. */}
      <g strokeWidth="0.8" opacity="0.7">
        <circle cx="329" cy="494" r="3.2" />
        <circle cx="339" cy="499" r="3.2" />
        <circle cx="349" cy="504" r="3.2" />
      </g>
    </g>
  );

  return (
    <g stroke="currentColor" opacity="0.72">
      {/* The room, barely there: shelves of folded cloth on one side, a rail on
          the other, so the jacket reads as standing somewhere rather than
          floating. */}
      <g strokeWidth="0.7" opacity="0.3">
        <path d="M40 500 L860 482" />
        <path d="M118 58 L118 492 M258 74 L258 486" />
        <path d="M112 268 L264 274 M112 356 L264 362" />
        <path d="M138 240 L226 244 M138 250 L226 254 M138 260 L226 264" />
        <path d="M138 330 L212 334 M138 340 L212 344 M138 350 L212 354" />
        <path d="M700 60 L700 494 M866 76 L866 488 M700 140 L866 150" />
        <path d="M782 150 L782 172 M762 172 C760 240 766 330 768 388 M802 172 C804 240 798 330 796 388" />
      </g>

      <g strokeWidth="1.5">
        {half}
        {/* The same half, mirrored about the centre of the box. */}
        <g transform="translate(900,0) scale(-1,1)">{half}</g>
      </g>

      {/* The form: a turned finial, the neck, and the post below the hem. */}
      <g strokeWidth="1.5">
        <ellipse cx="450" cy="70" rx="21" ry="15" />
        <path d="M434 80 C428 108 431 132 441 154" />
        <path d="M466 80 C472 108 469 132 459 154" />
        <path d="M446 573 L446 612 M456 573 L456 612" />
      </g>

      {/* Shirt, tie, buttons, pocket square: drawn once, so the jacket is not
          symmetrical where a real one is not. */}
      <path d="M438 192 L450 224 L462 192" strokeWidth="0.9" opacity="0.7" />
      <g strokeWidth="1.2">
        <path d="M440 202 L460 202 L464 228 L436 228 Z" />
        <path d="M439 228 C437 276 438 318 441 352" />
        <path d="M461 228 C463 276 462 318 459 352" />
      </g>
      <g strokeWidth="1.1" opacity="0.8">
        <circle cx="452" cy="360" r="7" />
        <circle cx="452" cy="428" r="7" />
      </g>
      <path d="M368 291 L394 296 L380 282 Z" strokeWidth="0.9" />
    </g>
  );
}
