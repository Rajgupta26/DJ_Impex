import { NabeenCollectionManager } from "@/components/admin/NabeenCollectionManager";
import { resolveSlots } from "@/lib/slots";

export const dynamic = "force-dynamic";

export default async function AdminNabeenCollectionPage() {
  const slots = await resolveSlots();
  return <NabeenCollectionManager initial={slots} />;
}
