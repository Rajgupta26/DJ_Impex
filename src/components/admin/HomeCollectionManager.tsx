"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ImageUp, Pencil, RotateCcw } from "lucide-react";

import { mb, prepareImage } from "./prepareImage";
import { request } from "./request";
import {
  Badge,
  buttonPrimary,
  buttonQuiet,
  card,
  Field,
  inputClass,
  Modal,
  NoticeBar,
  type Notice,
} from "./ui";
import type { SlotView } from "./SlotManager";

const FABRIC_DEFAULTS: Record<string, { name: string; weave: string; description: string }> = {
  "fabric-wool": {
    name: "Wool",
    weave: "Fine Merino & Worsted Wool",
    description: "Sumptuous, breathable luxury wool tailored for premier traditional attire, executive suiting, and cold-weather elegance.",
  },
  "fabric-atiku": {
    name: "Atiku",
    weave: "Structured Dobby Weave",
    description: "Signature textured cotton renowned in West African couture for its crisp finish and rich body.",
  },
  "fabric-suiting": {
    name: "Suiting",
    weave: "Wool-Touch Broken Twill",
    description: "Substantial drape and structured weave tailored for ceremonial and formal suiting.",
  },
  "fabric-jacquard": {
    name: "Jacquard",
    weave: "Embossed Jacquard Weave",
    description: "Intricate woven motifs with subtle luster and substantial hand, perfect for statement traditional wear.",
  },
  "fabric-swiss-voile": {
    name: "Swiss Voile",
    weave: "High-Twist Fine Voile",
    description: "Ultra-fine yarn counts producing a featherweight, silky hand feel with graceful drape.",
  },
  "fabric-african-wax-prints": {
    name: "African Wax Prints",
    weave: "Vibrant Wax-Resist Cotton",
    description: "Richly patterned, color-fast premium cotton textiles celebrated across African celebrations and everyday luxury.",
  },
  "fabric-giza-cotton-shirting": {
    name: "Giza Cotton Shirting",
    weave: "Extra-Long Staple Cotton",
    description: "Spun from prestigious Giza Egyptian cotton fibers for peerless luster, strength, and crisp garment silhouettes.",
  },
  "fabric-zurique-swiss-men-lace": {
    name: "Zürique Swiss Men Lace",
    weave: "Swiss-Inspired Viscose & Cotton",
    description: "Refined openwork lace tailored specifically for West African menswear, agbada tailoring, and prestigious occasions.",
  },
};

export function HomeCollectionManager({ initial }: { initial: SlotView[] }) {
  // Filter strictly to the 7 home collection fabrics
  const homeFabricSlots = useMemo(
    () => initial.filter((s) => s.id.startsWith("fabric-")),
    [initial],
  );

  const [slots, setSlots] = useState<SlotView[]>(homeFabricSlots);
  const [notice, setNotice] = useState<Notice>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<SlotView | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    weave: string;
    description: string;
    alt: string;
  }>({
    title: "",
    weave: "",
    description: "",
    alt: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  function openEditModal(slot: SlotView) {
    const fallback = FABRIC_DEFAULTS[slot.id];
    setEditingSlot(slot);
    setEditForm({
      title: slot.title || fallback?.name || slot.label.replace(/^Home Collection:\s*/, ""),
      weave: slot.weave || fallback?.weave || "",
      description: slot.description || fallback?.description || "",
      alt: slot.alt || "",
    });
  }

  async function handleSaveDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSlot) return;

    setSavingEdit(true);
    const result = await request<{ slot: SlotView }>(`/api/admin/slots/${editingSlot.id}`, {
      method: "PATCH",
      json: {
        title: editForm.title.trim(),
        weave: editForm.weave.trim(),
        description: editForm.description.trim(),
        alt: editForm.alt.trim(),
      },
    });
    setSavingEdit(false);

    if (!result.ok) {
      setNotice({ tone: "error", message: `${editingSlot.label}: ${result.error}` });
      return;
    }

    setSlots((current) =>
      current.map((s) => (s.id === editingSlot.id ? { ...s, ...result.data.slot } : s)),
    );
    setNotice({
      tone: "success",
      message: `Updated details for ${editForm.title || editingSlot.label}.`,
    });
    setEditingSlot(null);
  }

  async function replace(slot: SlotView, file: File) {
    setBusyId(slot.id);
    const prepared = await prepareImage(file);

    const body = new FormData();
    body.set("id", slot.id);
    body.set("file", prepared.file);
    body.set("alt", slot.alt);
    if (slot.title) body.set("title", slot.title);
    if (slot.weave) body.set("weave", slot.weave);
    if (slot.description) body.set("description", slot.description);

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
        : `${slot.label} image was replaced.`,
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
    setNotice({ tone: "success", message: `${slot.label} is back to the original image and text.` });
  }

  const replacedCount = slots.filter((s) => s.replaced).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">The Nabeen Collection</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          8 signature fabrics featured in the interactive home page showcase ·{" "}
          {replacedCount === 0 ? "none customized" : `${replacedCount} customized`}
        </p>
        <p className="mt-2 max-w-2xl text-xs text-slate-500 dark:text-slate-400">
          Upload custom high-resolution photographs or edit fabric names, weave specifications, and descriptions for any of the 8 fabrics on the home page showcase.
        </p>
      </div>

      <NoticeBar notice={notice} onDismiss={() => setNotice(null)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => {
          const fallback = FABRIC_DEFAULTS[slot.id];
          const fabricName = slot.title || fallback?.name || slot.label.replace(/^Home Collection:\s*/, "");
          const weaveText = slot.weave || fallback?.weave;
          const descriptionText = slot.description || fallback?.description;

          return (
            <div key={slot.id} className={`${card} flex flex-col justify-between p-4.5 space-y-4`}>
              <div>
                {/* Image Preview Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                  <Image
                    src={slot.src}
                    alt={slot.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {slot.replaced ? (
                    <div className="absolute top-2.5 right-2.5">
                      <Badge tone="blue">Customized</Badge>
                    </div>
                  ) : null}
                </div>

                {/* Fabric Info */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                      {fabricName}
                    </h3>
                  </div>
                  {weaveText ? (
                    <p className="text-xs font-medium text-[#52968e]">
                      {weaveText}
                    </p>
                  ) : null}
                  {descriptionText ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
                      {descriptionText}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={`${buttonQuiet} flex-1 justify-center py-2 text-xs`}
                  disabled={busyId === slot.id}
                  onClick={() => openEditModal(slot)}
                >
                  <Pencil size={13} aria-hidden="true" />
                  Edit text
                </button>

                <button
                  type="button"
                  className={`${buttonPrimary} flex-1 justify-center py-2 text-xs`}
                  disabled={busyId === slot.id}
                  onClick={() => inputs.current[slot.id]?.click()}
                >
                  <ImageUp size={13} aria-hidden="true" />
                  {busyId === slot.id ? "Uploading…" : "Replace photo"}
                </button>

                {slot.replaced ? (
                  <button
                    type="button"
                    className={`${buttonQuiet} py-2 text-xs`}
                    disabled={busyId === slot.id}
                    onClick={() => revert(slot)}
                    title="Restore original image and text"
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    <span className="sr-only sm:not-sr-only">Original</span>
                  </button>
                ) : null}

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
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Fabric Details Modal */}
      {editingSlot && (
        <Modal
          open={Boolean(editingSlot)}
          onClose={() => setEditingSlot(null)}
          title={`Edit Fabric · ${editingSlot.label}`}
        >
          <form onSubmit={handleSaveDetails} className="space-y-4">
            <Field label="Fabric Name (Title)" hint="The name shown in the collection tab bar and hero card.">
              {(props) => (
                <input
                  {...props}
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Atiku"
                />
              )}
            </Field>

            <Field label="Weave Type" hint="Technical weave description (e.g. Structured Dobby Weave).">
              {(props) => (
                <input
                  {...props}
                  type="text"
                  value={editForm.weave}
                  onChange={(e) => setEditForm((f) => ({ ...f, weave: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Structured Dobby Weave"
                />
              )}
            </Field>

            <Field label="Description" hint="Detailed textile description displayed in the hero showcase.">
              {(props) => (
                <textarea
                  {...props}
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputClass}
                  placeholder="Signature textured cotton renowned in West African couture..."
                />
              )}
            </Field>

            <Field label="Image Alt Text" hint="Describes the image for search engines and accessibility.">
              {(props) => (
                <input
                  {...props}
                  type="text"
                  value={editForm.alt}
                  onChange={(e) => setEditForm((f) => ({ ...f, alt: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Nabeen Atiku dobby woven fabric"
                />
              )}
            </Field>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                className={buttonQuiet}
                onClick={() => setEditingSlot(null)}
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button type="submit" className={buttonPrimary} disabled={savingEdit}>
                {savingEdit ? "Saving…" : "Save Fabric Details"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
