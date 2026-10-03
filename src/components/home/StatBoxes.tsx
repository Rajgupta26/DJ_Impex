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
    leadCaption: "Chosen Across Africa",
    title: "Indigenous Craft",
    subtitle: "Mill-direct, container load",
    accentColor: "var(--color-navy-deep)", // 17.68:1 on white
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
              className="group border-line/50 hover:bg-mist/40 relative flex min-h-[11rem] min-w-0 flex-col justify-between border-b p-4 transition-colors duration-300 sm:min-h-[14rem] sm:p-7 lg:min-h-[15.5rem] lg:border-b-0 lg:p-9"
            >
              <div>
                {/* Top Accent Line with 0 -> full length hover effect */}
                <div className="bg-line/60 mb-4 block h-[2px] w-10 overflow-hidden rounded-full sm:mb-5 sm:w-14">
                  <span
                    aria-hidden="true"
                    className="block h-full w-0 transition-all duration-500 ease-out group-hover:w-full group-active:w-full"
                    style={{ backgroundColor: item.accentColor }}
                  />
                </div>

                {/* Large Lead Stat Number / Name - BOLD IN REVERTED BRAND COLORS */}
                <div
                  className={`flex min-w-0 items-start ${
                    item.leadCaption ? "" : "min-h-[2.5rem] sm:min-h-[3.5rem] lg:min-h-[4rem]"
                  }`}
                >
                  <span
                    className={`t-number max-w-full min-w-0 leading-tight font-bold tracking-tight [overflow-wrap:anywhere] ${
                      item.lead === "Make in India"
                        ? "text-[clamp(1.15rem,3.8vw,2.75rem)]"
                        : "text-[clamp(2.1rem,1.8rem+2.2vw,4.5rem)]"
                    }`}
                    style={{ color: item.accentColor }}
                  >
                    {item.lead}
                  </span>
                </div>
                {item.leadCaption && (
                  <p className="text-slate mt-1.5 text-[11px] leading-relaxed font-medium [overflow-wrap:anywhere] sm:mt-2 sm:text-xs lg:text-sm">
                    {item.leadCaption}
                  </p>
                )}
              </div>

              <div className="border-line/50 mt-4 min-w-0 border-t pt-2.5 [overflow-wrap:anywhere] sm:mt-5 sm:pt-3">
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
