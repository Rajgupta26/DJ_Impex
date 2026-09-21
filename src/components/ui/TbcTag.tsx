import type { Status } from "@/lib/site";
import { showTodo } from "@/lib/env";

/**
 * Dev-only marker for a fact the client has not confirmed.
 * Renders nothing in production, and nothing for confirmed facts.
 */
export function TbcTag({ status, note }: { status: Status; note?: string }) {
  if (!showTodo || status !== "tbc") return null;
  return (
    <span className="tbc-tag" title={note ?? "Awaiting client confirmation"}>
      TBC
    </span>
  );
}
