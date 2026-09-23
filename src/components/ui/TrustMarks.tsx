import { getSite } from "@/lib/content";
import { visible } from "@/lib/site";
import { TrustMarksClient } from "@/components/ui/TrustMarksClient";

/**
 * A vertical list of big light leads with small labels behind a single animated hairline.
 */
export function TrustMarks({ className = "" }: { className?: string }) {
  const marks = visible(getSite().trustMarks);
  return <TrustMarksClient marks={marks} className={className} />;
}
