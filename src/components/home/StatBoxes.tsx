interface StatItem {
  lead: string;
  leadCaption?: string;
  title: string;
  subtitle: string;
  accentColor: string;
}

const STAT_ITEMS: StatItem[] = [
  {
    lead: "1995",
    title: "Founded",
    subtitle: "Over 30 years of textile excellence - Mumbai",
    accentColor: "var(--color-navy)",
  },
  {
    lead: "Star",
    title: "Export House",
    subtitle: "Govt. of India recognized",
    accentColor: "var(--color-navy)",
  },
  {
    lead: "1000+",
    title: "Designs & Varieties",
    subtitle: "Active shirting & suiting catalogue",
    accentColor: "var(--color-navy)",
  },
  {
    lead: "Make in India",
    leadCaption: "Chosen Across Africa",
    title: "Indigenous Craft",
    subtitle: "Mill-direct, container load",
    accentColor: "var(--color-navy)",
  },
];

export function StatBoxes({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full min-w-0 bg-transparent ${className}`.trim()}>
      {/* Keep cards in their final position from the server render onward.
          Auto-fit also stacks them when the viewport or text size needs more room. */}
      <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] px-[var(--spacing-gutter)] sm:grid-cols-2 lg:grid-cols-4 lg:px-0">
        {STAT_ITEMS.map((item, index) => {
          return (
            <div
              key={item.title}
              className="group border-line/50 hover:bg-mist/40 relative flex min-h-[11rem] min-w-0 flex-col justify-start border-b p-4 transition-colors duration-300 sm:min-h-[14rem] sm:p-7 lg:min-h-[15.5rem] lg:border-b-0 lg:p-9"
            >
              <div className="min-h-[6.25rem] sm:min-h-[7.5rem] lg:min-h-[8.25rem]">
                {/* Top Accent Line with 0 -> full length hover effect */}
                <div className="bg-line/60 mb-4 block h-[2px] w-10 overflow-hidden rounded-full sm:mb-5 sm:w-14">
                  <span
                    aria-hidden="true"
                    className="block h-full w-0 transition-all duration-500 ease-out group-hover:w-full group-active:w-full"
                    style={{ backgroundColor: item.accentColor }}
                  />
                </div>

                {/* Large Lead Stat Number / Name - single line, strictly aligned across all 4 cards */}
                <div className="flex min-w-0 flex-col justify-start">
                  <span
                    className="t-number max-w-full min-w-0 whitespace-nowrap leading-tight font-light tracking-tight text-[clamp(1.9rem,1.55rem+1.6vw,3.6rem)]"
                    style={{ color: item.accentColor }}
                  >
                    {item.lead}
                  </span>
                  {item.leadCaption && (
                    <p className="text-slate mt-1.5 text-[11px] leading-relaxed font-normal sm:mt-2 sm:text-xs lg:text-sm">
                      {item.leadCaption}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-line/50 min-w-0 border-t pt-3 [overflow-wrap:anywhere] sm:pt-4">
                {/* Title */}
                <h3 className="text-navy text-xs font-semibold tracking-normal sm:text-sm lg:text-base">
                  {item.title}
                </h3>

                {/* Subtitle */}
                <p className="text-slate mt-1 text-[11px] leading-relaxed sm:text-xs lg:text-sm">
                  {item.subtitle}
                </p>
              </div>

              {/* Dividing hairline on desktop */}
              {index < 3 && (
                <span
                  aria-hidden="true"
                  className="bg-line/70 pointer-events-none absolute top-1/2 right-0 hidden h-20 w-px -translate-y-1/2 lg:block"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
