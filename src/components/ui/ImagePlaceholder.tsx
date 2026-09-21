import { showTodo } from "@/lib/env";

/**
 * Stands in for an image the client has not sent yet.
 *
 * With NEXT_PUBLIC_SHOW_TODO=true the team sees exactly what is missing.
 * Otherwise it renders as a quiet navy weave so a client preview still looks
 * intentional rather than broken.
 */
export function ImagePlaceholder({
  pending,
  className = "",
}: {
  /** What is missing, e.g. "Ali Nuhu campaign portrait". */
  pending: string;
  className?: string;
}) {
  if (!showTodo) {
    return (
      <div
        aria-hidden="true"
        className={`h-full w-full bg-[linear-gradient(135deg,var(--color-navy-deep),var(--color-navy)_55%,var(--color-navy-soft))] ${className}`.trim()}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center border border-navy bg-mist p-6 text-center ${className}`.trim()}
    >
      <span className="t-small text-slate">Image pending: {pending}</span>
    </div>
  );
}
