import { notFound } from "next/navigation";

/**
 * Sends unmatched /admin/* URLs to the panel's own not-found.
 *
 * Without it, /admin/typo matches nothing at all, so Next falls back to the
 * root not-found and a mistyped admin URL lands on the marketing 404, header,
 * footer and all. Real routes are static segments and win over this catch-all.
 */
export default function AdminCatchAll(): never {
  notFound();
}
