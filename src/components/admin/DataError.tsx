import { AlertTriangle } from "lucide-react";

/** Shown when a /data file is missing, unreadable or no longer matches its shape. */
export function DataError({ title, message }: { title: string; message: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-semibold">This screen could not read its data file.</p>
          <p>{message}</p>
          <p>Nothing was written. Fix the file and reload.</p>
        </div>
      </div>
    </div>
  );
}
