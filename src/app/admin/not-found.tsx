import Link from "next/link";

/**
 * The panel's own 404, reached through the [...rest] catch-all so a mistyped
 * /admin URL lands in the sidebar layout rather than on the marketing 404.
 *
 * It does not stop the root not-found from travelling in this route's flight
 * payload: Next ships the root boundary regardless, so the marketing header and
 * footer are serialised into every admin page (~25KB). That is accepted rather
 * than fixed, because the alternative is a root 404 with no header or footer for
 * real visitors.
 */
export default function AdminNotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">That admin screen does not exist</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Check the address, or pick a section from the sidebar.
      </p>
      <Link href="/admin" className="text-navy text-sm underline dark:text-slate-200">
        Back to the dashboard
      </Link>
    </div>
  );
}
