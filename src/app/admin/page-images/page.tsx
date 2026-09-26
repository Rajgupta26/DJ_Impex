import { SlotManager } from "@/components/admin/SlotManager";
import { resolveSlots } from "@/lib/slots";

export const dynamic = "force-dynamic";

// resolveSlots falls back to the shipped defaults rather than throwing, so
// there is no error state to render here: the worst case is the page showing
// the design's own images, which is what the site would be showing too.
export default async function AdminPageImages() {
  return <SlotManager initial={await resolveSlots()} />;
}
