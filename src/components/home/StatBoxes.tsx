"use client";

import { motion, useReducedMotion } from "motion/react";

interface StatItem {
  lead: string;
  title: string;
  subtitle: string;
  accentColor: string;
}

/* A tonal ladder, lightest to deepest. These were ochre, crimson, navy and
   forest green, which is four hues the palette does not have: CLAUDE.md says the
   site is blue only. Each is used for the large lead text as well as the rule
   above it, so each is measured against white and clears 4.5:1. */
const STAT_ITEMS: StatItem[] = [
  {
    lead: "1995",
    title: "Founded",
    subtitle: "Over 30 years in trade · Mumbai",
    accentColor: "var(--color-navy-mid)", // 5.63:1 on white
  },
  {
    lead: "Star",
    title: "Export House",
    subtitle: "Govt. of India recognized",
    accentColor: "var(--color-navy-soft)", // 11.36:1 on white
  },
  {
    lead: "1000+",
    title: "Designs & Varieties",
    subtitle: "Active shirting & suiting catalogue",
    accentColor: "var(--color-navy)", // 14.43:1 on white
  },
  {
    lead: "Make in India",
    title: "Indigenous Craft",
    subtitle: "Mill-direct, container load",
    accentColor: "var(--color-navy-deep)", // 17.68:1 on white
  },
];

export function StatBoxes({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 0.61, 0.36, 1] as const;

  // Dual-direction staggered animation configuration:
  // Boxes 0 and 1 slide in from the left, one after another.
  // Boxes 2 and 3 slide in from the right, one after another.
  const getBoxAnimation = (index: number) => {
    if (reduceMotion) {
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.01 },
      };
    }

    const isLeft = index < 2;
    const initialX = isLeft ? -80 : 80;
    // Stagger timing:
    // Left pair: Box 0 (0.10s) -> Box 1 (0.28s)
    // Right pair: Box 2 (0.28s) -> Box 3 (0.46s)
    const delays = [0.1, 0.28, 0.28, 0.46];

    return {
      initial: { opacity: 0, x: initialX },
      whileInView: { opacity: 1, x: 0 },
      viewport: { once: true, amount: 0.05 },
      transition: {
        duration: 0.45,
        delay: delays[index] ?? 0.1,
        ease,
      },
    };
  };

  return (
    <div className={`w-full overflow-hidden bg-white ${className}`.trim()}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_ITEMS.map((item, index) => {
          const anim = getBoxAnimation(index);

          return (
            <motion.div
              key={item.title}
              initial={anim.initial}
              whileInView={anim.whileInView}
              viewport={anim.viewport}
              transition={anim.transition}
              className="group relative flex min-h-[12.5rem] sm:min-h-[14rem] lg:min-h-[15.5rem] flex-col justify-between p-6 sm:p-7 lg:p-9 cursor-pointer transition-colors duration-300 hover:bg-mist/40"
            >
              <div>
                {/* Top Accent Line with 0 -> full length hover effect */}
                <div className="mb-5 block h-[2px] w-14 overflow-hidden rounded-full bg-line/60">
                  <span
                    aria-hidden="true"
                    className="block h-full w-0 transition-all duration-500 ease-out group-hover:w-full group-active:w-full"
                    style={{ backgroundColor: item.accentColor }}
                  />
                </div>

                {/* Large Lead Stat Number / Name - BOLD IN REVERTED BRAND COLORS */}
                <div className="flex min-h-[3.5rem] items-baseline lg:min-h-[4rem]">
                  <span
                    className={`t-number leading-none font-bold tracking-tight ${
                      item.lead.length > 5
                        ? "text-[clamp(1.85rem,1.4rem+1.2vw,2.5rem)] uppercase"
                        : "text-[clamp(3.25rem,2.4rem+2.2vw,4.5rem)]"
                    }`}
                    style={{ color: item.accentColor }}
                  >
                    {item.lead}
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-line/50 pt-3">
                {/* Title */}
                <h3 className="text-sm font-semibold tracking-normal text-navy lg:text-base">
                  {item.title}
                </h3>

                {/* Subtitle */}
                <p className="mt-1 text-xs text-slate lg:text-sm leading-relaxed">
                  {item.subtitle}
                </p>
              </div>

              {/* Smaller, centered subtle vertical dividing hairline (NOT a full box border) */}
              {index < 3 && (
                <span
                  aria-hidden="true"
                  className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-20 w-px bg-line/70 pointer-events-none"
                />
              )}
              {index % 2 === 0 && (
                <span
                  aria-hidden="true"
                  className="hidden sm:block lg:hidden absolute right-0 top-1/2 -translate-y-1/2 h-20 w-px bg-line/70 pointer-events-none"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
