"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { HeartHandshake, ImageUp, RotateCcw } from "lucide-react";

import { mb, prepareImage } from "./prepareImage";
import { request } from "./request";
import { Badge, buttonPrimary, buttonQuiet, card, NoticeBar, type Notice } from "./ui";
import type { SlotView } from "./SlotManager";

export function Wear2CareManager({ initial }: { initial: SlotView[] }) {
  // Filter only Wear2Care campaign slots
  const wear2careSlots = useMemo(
    () => initial.filter((s) => s.id.startsWith("wear2care-")),
    [initial],
  );

  const [slots, setSlots] = useState<SlotView[]>(wear2careSlots);
  const [notice, setNotice] = useState<Notice>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function replace(slot: SlotView, file: File) {
    setBusyId(slot.id);
    const prepared = await prepareImage(file);

    const body = new FormData();
    body.set("id", slot.id);
    body.set("file", prepared.file);
    body.set("alt", slot.alt);

    const result = await request<{ slot: SlotView }>("/api/admin/slots", { method: "POST", body });
    setBusyId(null);

    if (!result.ok) {
      setNotice({ tone: "error", message: `${slot.label}: ${result.error}` });
      return;
    }
    setSlots((current) => current.map((s) => (s.id === slot.id ? { ...s, ...result.data.slot } : s)));
    setNotice({
      tone: "success",
      message: prepared.resized
        ? `${slot.label} was replaced, resized from ${mb(prepared.from)} to ${mb(prepared.to)}.`
        : `${slot.label} was replaced.`,
    });
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
    setNotice({ tone: "success", message: `${slot.label} is back to the original photograph.` });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-brand" />
          <h1 className="text-2xl font-semibold tracking-tight">Wear2Care images</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Manage and replace the hero banner and donation photographs featured on the Wear2Care × Ali Nuhu page.
        </p>
      </div>

      <NoticeBar notice={notice} onDismiss={() => setNotice(null)} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => {
          const isBusy = busyId === slot.id;

          return (
            <article key={slot.id} className={`${card} flex flex-col justify-between overflow-hidden`}>
              <div>
                <figure className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={slot.src}
                    alt={slot.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    unoptimized={slot.src.startsWith("/api/")}
                  />
                  {isBusy && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white backdrop-blur-xs">
                      Updating…
                    </div>
                  )}
                </figure>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {slot.label}
                    </h2>
                    <Badge tone={slot.replaced ? "blue" : "neutral"}>
                      {slot.replaced ? "Replaced" : "Original"}
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs font-medium text-brand">{slot.where}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{slot.hint}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 p-4 pt-3 dark:border-slate-800">
                <input
                  ref={(node) => {
                    inputs.current[slot.id] = node;
                  }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) replace(slot, file);
                    event.target.value = "";
                  }}
                />

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => inputs.current[slot.id]?.click()}
                    className={buttonPrimary}
                  >
                    <ImageUp size={14} />
                    <span>Replace image</span>
                  </button>

                  {slot.replaced && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => revert(slot)}
                      className={buttonQuiet}
                      title="Restore original image"
                    >
                      <RotateCcw size={14} />
                      <span className="hidden sm:inline">Original</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
