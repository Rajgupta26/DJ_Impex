"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageUp, RotateCcw } from "lucide-react";

import { request } from "./request";
import { Badge, buttonPrimary, buttonQuiet, card, NoticeBar, type Notice } from "./ui";

export type SlotView = {
  id: string;
  label: string;
  where: string;
  hint: string;
  src: string;
  alt: string;
  replaced: boolean;
};

/**
 * The images built into the page design, as opposed to the gallery.
 *
 * A gallery swatch can be deleted, because the grid just gets shorter. These
 * cannot: the design has a hole where one used to be. So each is replaced or
 * put back, and there is no delete.
 */
export function SlotManager({ initial }: { initial: SlotView[] }) {
  const [slots, setSlots] = useState(initial);
  const [notice, setNotice] = useState<Notice>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function replace(slot: SlotView, file: File) {
    const body = new FormData();
    body.set("id", slot.id);
    body.set("file", file);
    body.set("alt", slot.alt);

    setBusyId(slot.id);
    const result = await request<{ slot: SlotView }>("/api/admin/slots", { method: "POST", body });
    setBusyId(null);

    if (!result.ok) {
      setNotice({ tone: "error", message: `${slot.label}: ${result.error}` });
      return;
    }
    setSlots((current) => current.map((s) => (s.id === slot.id ? { ...s, ...result.data.slot } : s)));
    setNotice({ tone: "success", message: `${slot.label} was replaced.` });
  }

  async function revert(slot: SlotView) {
    setBusyId(slot.id);
    const result = await request<{ slot: SlotView }>(`/api/admin/slots/${slot.id}`, {
      method: "DELETE",
    });
    setBusyId(null);

    if (!result.ok) {
      setNotice({ tone: "error", message: `${slot.label}: ${result.error}` });
      return;
    }
    setSlots((current) => current.map((s) => (s.id === slot.id ? { ...s, ...result.data.slot } : s)));
    setNotice({ tone: "success", message: `${slot.label} is back to the original image.` });
  }

  const replaced = slots.filter((slot) => slot.replaced).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Page images</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {slots.length} images built into the page design ·{" "}
          {replaced === 0 ? "none replaced" : `${replaced} replaced`}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          These sit in fixed positions, so they can be swapped but not removed — taking one away would leave a
          gap in the layout. To add or remove pictures freely, use the{" "}
          <span className="font-medium">Image gallery</span> instead.
        </p>
      </div>

      <NoticeBar notice={notice} onDismiss={() => setNotice(null)} />

      <ul className="space-y-3">
        {slots.map((slot) => (
          <li key={slot.id} className={`${card} flex flex-wrap items-center gap-4 p-4`}>
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
              <Image src={slot.src} alt="" fill sizes="112px" className="object-cover" />
            </div>

            <div className="min-w-[14rem] flex-1">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                {slot.label}
                {slot.replaced ? <Badge tone="blue">Replaced</Badge> : null}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{slot.where}</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{slot.hint}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className={buttonPrimary}
                disabled={busyId === slot.id}
                onClick={() => inputs.current[slot.id]?.click()}
              >
                <ImageUp size={14} aria-hidden="true" />
                {busyId === slot.id ? "Working…" : "Replace"}
              </button>
              {slot.replaced ? (
                <button
                  type="button"
                  className={buttonQuiet}
                  disabled={busyId === slot.id}
                  onClick={() => revert(slot)}
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  Use the original
                </button>
              ) : null}
            </div>

            <input
              ref={(node) => {
                inputs.current[slot.id] = node;
              }}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              aria-label={`Replace ${slot.label}`}
              onChange={(event) => {
                const file = event.target.files?.[0];
                // Cleared first, so picking the same file again after a failure
                // still fires a change event.
                event.target.value = "";
                if (file) void replace(slot, file);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
