"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Pencil, Search, Trash2, Upload } from "lucide-react";

import type { AdminImage } from "@/lib/admin/schemas";

import { request } from "./request";
import {
  Badge,
  buttonDanger,
  buttonPrimary,
  buttonQuiet,
  card,
  EmptyState,
  Field,
  formatDate,
  inputClass,
  Modal,
  NoticeBar,
  type Notice,
} from "./ui";

type Draft = { title: string; alt: string; category: string; caption: string };

const EMPTY_DRAFT: Draft = { title: "", alt: "", category: "", caption: "" };

export function ImageManager({ initial }: { initial: AdminImage[] }) {
  const [images, setImages] = useState(initial);
  const [notice, setNotice] = useState<Notice>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [uploadOpen, setUploadOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<AdminImage | null>(null);
  const [confirming, setConfirming] = useState<AdminImage | null>(null);

  const categories = useMemo(
    () => [...new Set(images.map((image) => image.category).filter(Boolean))].sort(),
    [images],
  );

  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return images;
    return images.filter((image) =>
      [image.title, image.alt, image.category, image.caption, image.src].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [images, query]);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setFieldErrors({ file: "Please choose an image." });
      return;
    }

    const body = new FormData();
    body.set("file", file);
    body.set("title", draft.title || file.name);
    body.set("alt", draft.alt);
    body.set("category", draft.category);
    body.set("caption", draft.caption);

    setBusy(true);
    setFieldErrors({});
    const result = await request<{ image: AdminImage }>("/api/admin/images", { method: "POST", body });
    setBusy(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      setNotice({ tone: "error", message: result.error });
      return;
    }
    setImages((current) => [result.data.image, ...current]);
    setUploadOpen(false);
    setDraft(EMPTY_DRAFT);
    setNotice({ tone: "success", message: `“${result.data.image.title}” was uploaded.` });
  }

  async function handleSaveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    setBusy(true);
    setFieldErrors({});
    const result = await request<{ image: AdminImage }>(`/api/admin/images/${editing.id}`, {
      method: "PATCH",
      json: {
        title: editing.title,
        alt: editing.alt,
        category: editing.category,
        caption: editing.caption,
      },
    });
    setBusy(false);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors ?? {});
      setNotice({ tone: "error", message: result.error });
      return;
    }
    const saved = result.data.image;
    setImages((current) => current.map((image) => (image.id === saved.id ? saved : image)));
    setEditing(null);
    setNotice({ tone: "success", message: "The image details were saved." });
  }

  async function handleDelete() {
    if (!confirming) return;
    const target = confirming;

    setBusy(true);
    const result = await request<{ id: string }>(`/api/admin/images/${target.id}`, { method: "DELETE" });
    setBusy(false);
    setConfirming(null);

    if (!result.ok) {
      setNotice({ tone: "error", message: result.error });
      return;
    }
    setImages((current) => current.filter((image) => image.id !== target.id));
    setNotice({
      tone: "success",
      message: target.fileName
        ? `“${target.title}” and its file were deleted.`
        : `“${target.title}” was removed from the gallery list.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Image gallery</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {images.length} {images.length === 1 ? "image" : "images"} in data/images.json
            {categories.length ? ` · ${categories.length} categories` : ""}
          </p>
        </div>
        <button
          type="button"
          className={buttonPrimary}
          onClick={() => {
            setFieldErrors({});
            setUploadOpen(true);
          }}
        >
          <Upload size={16} aria-hidden="true" />
          Upload an image
        </button>
      </div>

      <NoticeBar notice={notice} onDismiss={() => setNotice(null)} />

      <div className="relative max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, alt text or category"
          aria-label="Search images"
          className={`${inputClass} pl-9`}
        />
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={images.length ? "Nothing matches that search" : "No images yet"}
          body={
            images.length
              ? "Try a shorter term, or clear the search box."
              : "Upload an image and it will be written to public/uploads and listed in data/images.json."
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((image) => (
            <li key={image.id} className={`${card} overflow-hidden`}>
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold break-words">
                    {image.title}
                    {image.usage === "cover" ? (
                      <span className="ml-2 align-middle">
                        <Badge>Blog cover</Badge>
                      </span>
                    ) : null}
                  </p>
                  {image.category ? (
                    <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                      {image.category}
                    </span>
                  ) : null}
                </div>
                <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{image.alt}</p>
                <p className="font-mono text-[11px] break-all text-slate-400 dark:text-slate-500">
                  {image.src}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Added {formatDate(image.uploadedAt)}
                  {image.fileName ? "" : " · ships with the site"}
                  {image.usage === "cover" ? " · not shown in the home gallery" : ""}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    className={`${buttonQuiet} flex-1`}
                    onClick={() => {
                      setFieldErrors({});
                      setEditing(image);
                    }}
                  >
                    <Pencil size={14} aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className={buttonDanger}
                    onClick={() => setConfirming(image)}
                    aria-label={`Delete ${image.title}`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload an image">
        <form onSubmit={handleUpload} className="space-y-4">
          <Field label="File" error={fieldErrors.file} hint="JPEG, PNG, WebP, AVIF or GIF, up to 8MB.">
            {(props) => (
              <input
                {...props}
                ref={fileRef}
                type="file"
                name="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                required
                className="file:bg-navy w-full text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-2 file:text-sm file:text-white dark:file:bg-slate-700"
              />
            )}
          </Field>

          <Field label="Title" error={fieldErrors.title}>
            {(props) => (
              <input
                {...props}
                className={inputClass}
                value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                placeholder="Aqua jacquard"
              />
            )}
          </Field>

          <Field
            label="Alt text"
            error={fieldErrors.alt}
            hint="Required. Describe the fabric for someone who cannot see it."
          >
            {(props) => (
              <input
                {...props}
                className={inputClass}
                value={draft.alt}
                onChange={(event) => setDraft({ ...draft, alt: event.target.value })}
                required
              />
            )}
          </Field>

          <Field label="Category" error={fieldErrors.category}>
            {(props) => (
              <input
                {...props}
                className={inputClass}
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                list="admin-image-categories"
                placeholder="Jacquard"
              />
            )}
          </Field>
          <datalist id="admin-image-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>

          <Field label="Caption" error={fieldErrors.caption}>
            {(props) => (
              <textarea
                {...props}
                className={inputClass}
                rows={2}
                value={draft.caption}
                onChange={(event) => setDraft({ ...draft, caption: event.target.value })}
              />
            )}
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className={buttonQuiet} onClick={() => setUploadOpen(false)}>
              Cancel
            </button>
            <button type="submit" className={buttonPrimary} disabled={busy}>
              {busy ? "Uploading…" : "Upload"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Edit image details">
        {editing ? (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800">
              <Image
                src={editing.src}
                alt={editing.alt}
                fill
                sizes="(min-width: 640px) 560px, 90vw"
                className="object-cover"
              />
            </div>

            <Field label="Title" error={fieldErrors.title}>
              {(props) => (
                <input
                  {...props}
                  className={inputClass}
                  value={editing.title}
                  onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                />
              )}
            </Field>
            <Field label="Alt text" error={fieldErrors.alt}>
              {(props) => (
                <input
                  {...props}
                  className={inputClass}
                  value={editing.alt}
                  onChange={(event) => setEditing({ ...editing, alt: event.target.value })}
                />
              )}
            </Field>
            <Field label="Category" error={fieldErrors.category}>
              {(props) => (
                <input
                  {...props}
                  className={inputClass}
                  value={editing.category}
                  onChange={(event) => setEditing({ ...editing, category: event.target.value })}
                  list="admin-image-categories"
                />
              )}
            </Field>
            <Field label="Caption" error={fieldErrors.caption}>
              {(props) => (
                <textarea
                  {...props}
                  className={inputClass}
                  rows={3}
                  value={editing.caption}
                  onChange={(event) => setEditing({ ...editing, caption: event.target.value })}
                />
              )}
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={buttonQuiet} onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className={buttonPrimary} disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        ) : null}
      </Modal>

      <Modal open={confirming !== null} onClose={() => setConfirming(null)} title="Delete this image?">
        {confirming ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              “{confirming.title}” will stop appearing in the gallery on the website
              {confirming.fileName
                ? ", and the uploaded file will be deleted."
                : ". The image file ships with the site, so it stays in the project and only " +
                  "stops being shown."}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {confirming.fileName
                ? "This cannot be undone."
                : "A developer can put it back; you cannot from here."}
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" className={buttonQuiet} onClick={() => setConfirming(null)}>
                Keep it
              </button>
              <button type="button" className={buttonDanger} onClick={handleDelete} disabled={busy}>
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
