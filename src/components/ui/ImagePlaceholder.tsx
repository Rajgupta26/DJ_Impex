import { WeaveArt, type WeavePattern } from "@/components/ui/WeaveArt";
import { showTodo } from "@/lib/env";

/**
 * Stands in for an image the client has not sent yet.
 *
 * With NEXT_PUBLIC_SHOW_TODO=true the team sees exactly what is missing, over the
 * drawn cloth. In production it is just the cloth, so a client preview reads as
 * art direction rather than a hole in the page.
 */
export function ImagePlaceholder({
  pending,
  pattern = "ogee",
  tone = "navy",
  scale = 1,
  className = "",
}: {
  /** What is missing, e.g. "Ali Nuhu campaign portrait". */
  pending: string;
  pattern?: WeavePattern;
  tone?: "navy" | "mist";
  scale?: number;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`.trim()}>
      <WeaveArt pattern={pattern} tone={tone} scale={scale} />
      {showTodo ? (
        <div className="absolute inset-0 flex items-start justify-end p-5">
          <span
            className={`t-small border border-dashed px-2.5 py-1 ${
              tone === "navy"
                ? "border-white/45 text-white/80"
                : "border-navy/35 text-slate"
            }`}
          >
            Image pending: {pending}
          </span>
        </div>
      ) : null}
    </div>
  );
}
