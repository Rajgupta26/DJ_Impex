import { DataError } from "@/components/admin/DataError";
import { EnquiryManager } from "@/components/admin/EnquiryManager";
import { loadCollection } from "@/lib/admin/load";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const result = await loadCollection("enquiries");
  if (!result.ok) return <DataError title="Enquiries" message={result.message} />;
  const newestFirst = [...result.rows].sort((a, b) => b.date.localeCompare(a.date));
  return <EnquiryManager initial={newestFirst} />;
}
