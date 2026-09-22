import type { Status } from "@/lib/site";

/**
 * TBC badge is permanently disabled across the site.
 */
export function TbcTag({ status, note }: { status?: Status; note?: string } = {}) {
  void status;
  void note;
  return null;
}
