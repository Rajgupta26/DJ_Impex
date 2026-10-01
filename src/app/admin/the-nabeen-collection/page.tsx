import type { Metadata } from "next";

import { HomeCollectionManager } from "@/components/admin/HomeCollectionManager";
import { resolveSlots } from "@/lib/slots";

export const metadata: Metadata = {
  title: "The Nabeen Collection · Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminTheNabeenCollectionPage() {
  const slots = await resolveSlots();
  return <HomeCollectionManager initial={slots} />;
}
