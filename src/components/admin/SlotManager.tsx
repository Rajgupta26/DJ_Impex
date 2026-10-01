"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageUp, Pencil, RotateCcw, Video } from "lucide-react";

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

export type SlotView = {
  id: string;
  label: string;
  where: string;
  hint: string;
  src: string;
  alt: string;
  mediaType?: "image" | "video";
  poster?: string;
  title?: string;
  description?: string;
  weave?: string;
  replaced: boolean;
};

/**
 * The media and text slots built into the page design, as opposed to the gallery.
 *
 * A gallery swatch can be deleted, because the grid just gets shorter. These
 * cannot: the design has a hole where one used to be. So each is replaced or
 * put back, and text/captions can be customized directly.
 */
export function SlotManager({ initial }: { initial: SlotView[] }) {
  const [slots, setSlots] = useState(initial);
  const [notice, setNotice] = useState<Notice>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<SlotView | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; alt: string; description: string }>({
    title: "",
    alt: "",
    description: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  function openEditModal(slot: SlotView) {
    setEditingSlot(slot);
    setEditForm({
      title: slot.title || "",
      alt: slot.alt || "",
      description: slot.description || "",
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
        alt: editForm.alt.trim(),
        description: editForm.description.trim(),
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
      message: `Updated text details for ${editingSlot.label}.`,
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
    if (slot.description) body.set("description", slot.description);
    if (slot.weave) body.set("weave", slot.weave);

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
    setNotice({ tone: "success", message: `${slot.label} is back to the original content.` });
  }

  const replaced = slots.filter((slot) => slot.replaced).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Page images & Media</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {slots.length} media slots built into the page design ·{" "}
          {replaced === 0 ? "none replaced" : `${replaced} replaced / customized`}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          These sit in fixed positions, so they can be swapped or text can be edited directly. To add or remove pictures freely, use the{" "}
          <span className="font-medium">Image gallery</span> instead.
        </p>
      </div>

      <NoticeBar notice={notice} onDismiss={() => setNotice(null)} />

      <ul className="space-y-3">
        {slots.map((slot) => {
          const isVideoFile = slot.src.endsWith(".mp4") || slot.src.endsWith(".webm") || slot.src.endsWith(".mov");
          const isVideo = slot.mediaType === "video" || isVideoFile;

          return (
            <li key={slot.id} className={`${card} flex flex-wrap items-center gap-4 p-4`}>
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {isVideoFile ? (
                  <video
                    src={slot.src}
                    poster={slot.poster}
                    muted
                    playsInline
                    autoPlay
                    loop
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image src={slot.src} alt={slot.alt || ""} fill sizes="112px" className="object-cover" />
                )}
                {isVideo && (
                  <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[10px] text-white flex items-center gap-0.5">
                    <Video size={10} /> Video
                  </span>
                )}
              </div>

              <div className="min-w-[14rem] flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  {slot.label}
                  {slot.replaced ? <Badge tone="blue">Replaced</Badge> : null}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{slot.where}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{slot.hint}</p>
                {slot.alt && (
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 italic">
                    Alt/Caption: &ldquo;{slot.alt}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={buttonQuiet}
                  disabled={busyId === slot.id}
                  onClick={() => openEditModal(slot)}
                >
                  <Pencil size={14} aria-hidden="true" />
                  Edit details
                </button>

                <button
                  type="button"
                  className={buttonPrimary}
                  disabled={busyId === slot.id}
                  onClick={() => inputs.current[slot.id]?.click()}
                >
                  <ImageUp size={14} aria-hidden="true" />
                  {busyId === slot.id ? "Working…" : isVideo ? "Replace video" : "Replace image"}
                </button>

                {slot.replaced ? (
                  <button
                    type="button"
                    className={buttonQuiet}
                    disabled={busyId === slot.id}
                    onClick={() => revert(slot)}
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    Use original
                  </button>
                ) : null}
              </div>

              <input
                ref={(node) => {
                  inputs.current[slot.id] = node;
                }}
                type="file"
                accept={
                  isVideo
                    ? "video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"
                    : "image/jpeg,image/png,image/webp,image/avif"
                }
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

      {/* Edit Details Modal */}
      {editingSlot && (
        <Modal
          open={Boolean(editingSlot)}
          onClose={() => setEditingSlot(null)}
          title={`Edit Details · ${editingSlot.label}`}
        >
          <form onSubmit={handleSaveDetails} className="space-y-4">
            <Field label="Title / Heading (Optional)" hint="Displayed headline or brand label if used in the section.">
              {(props) => (
                <input
                  {...props}
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. DJ IMPEX & CO."
                />
              )}
            </Field>

            <Field label="Alt Text / Accessibility Description" hint="Describes the media for search engines and screen readers.">
              {(props) => (
                <input
                  {...props}
                  type="text"
                  value={editForm.alt}
                  onChange={(e) => setEditForm((f) => ({ ...f, alt: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Luxury in every thread"
                />
              )}
            </Field>

            <Field label="Description / Strapline (Optional)" hint="Supporting subtext or subtitle associated with this media slot.">
              {(props) => (
                <textarea
                  {...props}
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputClass}
                  placeholder="Additional context or description..."
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
                {savingEdit ? "Saving…" : "Save Details"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
