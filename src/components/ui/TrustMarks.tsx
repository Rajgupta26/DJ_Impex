import { TbcTag } from "@/components/ui/TbcTag";
import { getSite } from "@/lib/content";
import { visible } from "@/lib/site";

/**
 * A vertical list of big light leads with small labels behind a single hairline.
 * Not badge icons, not a row of cards.
 *
 * The lead is the part worth setting large. Which part that is follows from the
 * label itself, so the marks stay driven by site.json:
 *   "Since 1995"                        -> 1995 / Founded
 *   "1000+ designs"                     -> 1000+ / Designs
 *   "Star Export House, Govt. of India" -> Star / Export House, Govt. of India
 *   "Make in India"                     -> Make in India
 */
function split(label: string): { lead: string; rest: string } {
  const sentence = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : "");

  const number = /(\d[\d,]*\+?)/.exec(label);
  if (number) {
    const rest = label.replace(number[0], "").replace(/^since\s*/i, "").trim();
    return { lead: number[0], rest: sentence(rest) || "Founded" };
  }

  if (label.length <= 13) return { lead: label, rest: "" };

  const [first, ...remainder] = label.split(" ");
  return { lead: first, rest: sentence(remainder.join(" ")) };
}

export function TrustMarks({ className = "" }: { className?: string }) {
  const marks = visible(getSite().trustMarks);

  return (
    <dl className={`hairline-left grid gap-7 pl-8 ${className}`.trim()}>
      {marks.map((mark) => {
        const { lead, rest } = split(mark.label);
        return (
          <div key={mark.label}>
            <dt className="t-number text-[clamp(2.25rem,1.6rem+1.9vw,3.25rem)] leading-none">
              {lead}
              <TbcTag status={mark.status} />
            </dt>
            {rest ? <dd className="t-small mt-1.5 text-slate">{rest}</dd> : null}
          </div>
        );
      })}
    </dl>
  );
}
