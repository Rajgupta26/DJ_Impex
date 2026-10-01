"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ImageUp, Search } from "lucide-react";

import { mb, prepareImage } from "./prepareImage";
import { request } from "./request";
import { Badge, buttonPrimary, card, NoticeBar, type Notice } from "./ui";
import type { SlotView } from "./SlotManager";

interface CollectionCategory {
  id: string;
  label: string;
  prefix?: string;
}

const CATEGORIES: readonly CollectionCategory[] = [
  { id: "all", label: "All collections" },
  { id: "classic", label: "01 Nabeen Classic", prefix: "nabeen-classic-" },
  { id: "royale", label: "02 Nabeen Royale", prefix: "nabeen-royale-" },
  { id: "luxure", label: "03 Nabeen Luxuré", prefix: "nabeen-luxure-" },
  { id: "white", label: "04 Nabeen White", prefix: "nabeen-white-" },
];

export function NabeenCollectionManager({ initial }: { initial: SlotView[] }) {
  // Filter only Nabeen signature collection slots
  const signatureSlots = useMemo(
    () => initial.filter((s) => s.id.startsWith("nabeen-")),
    [initial],
  );

  const [slots, setSlots] = useState<SlotView[]>(signatureSlots);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
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
        : `${slot.label} swatch image was replaced.`,
    });
  }

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      // Category filter
      if (selectedCategory !== "all") {
        const cat = CATEGORIES.find((c) => c.id === selectedCategory);
        if (cat?.prefix && !slot.id.startsWith(cat.prefix)) {
          return false;
        }
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesLabel = slot.label.toLowerCase().includes(q);
        const matchesWhere = slot.where.toLowerCase().includes(q);
        const matchesAlt = slot.alt.toLowerCase().includes(q);
        return matchesLabel || matchesWhere || matchesAlt;
      }

      return true;
    });
  }, [slots, selectedCategory, search]);

  const replacedCount = slots.filter((s) => s.replaced).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Nabeen Collection Swatches</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {slots.length} fabric swatches across 4 signature lines ·{" "}
            {replacedCount === 0 ? "none replaced" : `${replacedCount} replaced`}
          </p>
        </div>
      </div>

      <NoticeBar notice={notice} onDismiss={() => setNotice(null)} />

      {/* Category Filter Tabs and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2 sm:border-b-0 sm:pb-0 dark:border-slate-800">
          {CATEGORIES.map((cat) => {
            const count =
              cat.prefix
                ? slots.filter((s) => s.id.startsWith(cat.prefix!)).length
                : slots.length;
            const active = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                  active
                    ? "bg-navy text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {cat.label} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            aria-label="Search swatches"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search swatches…"
            className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-xs focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Grid of Swatches */}
      {filteredSlots.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No fabric swatches matched your search.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {filteredSlots.map((slot) => {
            const [collectionName, swatchName] = slot.label.includes(":")
              ? slot.label.split(":").map((s) => s.trim())
              : ["Nabeen", slot.label];

            return (
              <li
                key={slot.id}
                className={`${card} flex flex-col justify-between gap-4 p-4 transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-xs dark:border-slate-700 dark:bg-slate-800">
                    <Image
                      src={slot.src}
                      alt={slot.alt}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider dark:text-slate-500">
                        {collectionName}
                      </span>
                      {slot.replaced ? <Badge tone="blue">Replaced</Badge> : null}
                    </div>
                    <h3 className="break-words text-base font-semibold text-slate-900 dark:text-slate-100">
                      {swatchName}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                  <button
                    type="button"
                    className={buttonPrimary}
                    disabled={busyId === slot.id}
                    onClick={() => inputs.current[slot.id]?.click()}
                  >
                    <ImageUp size={14} aria-hidden="true" />
                    {busyId === slot.id ? "Uploading…" : "Replace"}
                  </button>
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
                    event.target.value = "";
                    if (file) void replace(slot, file);
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
