"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Eye, FilePlus2, ImageUp, Pencil, Search, Trash2 } from "lucide-react";

import { blogInputSchema, type AdminBlog, type AdminImage, type BlogStatus } from "@/lib/admin/schemas";

import { Markdown, adminTheme } from "@/components/markdown/Markdown";
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
  labelClass,
  Modal,
  NoticeBar,
  type Notice,
} from "./ui";

type Draft = Omit<AdminBlog, "id" | "updatedAt">;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function emptyDraft(): Draft {
  return {
    slug: "",
    title: "",
    excerpt: "",
    category: "",
    content: "",
    coverImage: "",
    author: "Nabeen editorial",
    publishedDate: new Date().toISOString().slice(0, 10),
    status: "draft",
  };
}

export function BlogManager({ initial }: { initial: AdminBlog[] }) {
  const [blogs, setBlogs] = useState(initial);
  const [notice, setNotice] = useState<Notice>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
  const [busy, setBusy] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  /** null = closed, string = editing that id, "new" = creating. */
  const [editorFor, setEditorFor] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [slugTouched, setSlugTouched] = useState(false);
  /** Which fields the writer has edited, and whether they have tried to save. */
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [attempted, setAttempted] = useState(false);
  const [confirming, setConfirming] = useState<AdminBlog | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

  /**
   * Upload a cover straight from the editor, rather than making the writer
   * find a path and paste it in.
   *
   * It goes through the same endpoint as the gallery, so the file is managed
   * and deletable like any other, but it is marked as a cover so it does not
   * turn up as a swatch on the home page. Alt text is required by the API and
   * a cover is decorative next to its own headline, so the post's title is
   * sent as a reasonable description rather than prompting for one.
   */
  async function uploadCover(file: File) {
    const body = new FormData();
    body.set("file", file);
    body.set("usage", "cover");
    body.set("title", draft.title ? `Cover: ${draft.title}` : file.name);
    body.set("alt", draft.title || file.name);

    setCoverBusy(true);
    setCoverError(null);
    const result = await request<{ image: AdminImage }>("/api/admin/images", {
      method: "POST",
      body,
    });
    setCoverBusy(false);

    if (!result.ok) {
      setCoverError(result.fieldErrors?.file ?? result.error);
      return;
    }
    edit("coverImage", result.data.image.src);
  }

  // Validated on every keystroke against the same schema the API uses, so the
  // form cannot disagree with the server about what is acceptable.
  const validation = useMemo(() => {
    const result = blogInputSchema.safeParse(draft);
    if (result.success) return { valid: true, errors: {} as Record<string, string> };
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      errors[String(issue.path[0] ?? "form")] ??= issue.message;
    }
    return { valid: false, errors };
  }, [draft]);

  // An empty new post is invalid by definition, so showing every message at
  // once would greet the writer with a wall of red before they have typed a
  // character. A field speaks up once it has been edited, or once a save is
  // attempted.
  const visible = { ...validation.errors, ...serverErrors };
  const errors: Record<string, string> = {};
  for (const [field, message] of Object.entries(visible)) {
    if (attempted || touched.has(field) || serverErrors[field]) errors[field] = message;
  }

  function edit(field: keyof Draft, value: string) {
    setTouched((current) => (current.has(field) ? current : new Set(current).add(field)));
    setDraft((current) => ({ ...current, [field]: value }));
  }

  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    return blogs.filter((blog) => {
      if (statusFilter !== "all" && blog.status !== statusFilter) return false;
      if (!term) return true;
      return [blog.title, blog.slug, blog.excerpt, blog.author, blog.content].some((value) =>
        value.toLowerCase().includes(term),
      );
    });
  }, [blogs, query, statusFilter]);

  function openNew() {
    setDraft(emptyDraft());
    setSlugTouched(false);
    setTouched(new Set());
    setAttempted(false);
    setServerErrors({});
    setCoverError(null);
    setEditorFor("new");
  }

  function openEdit(blog: AdminBlog) {
    setDraft({
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      content: blog.content,
      coverImage: blog.coverImage,
      author: blog.author,
      publishedDate: blog.publishedDate,
      status: blog.status,
    });
    setSlugTouched(true);
    setTouched(new Set());
    setAttempted(false);
    setServerErrors({});
    setCoverError(null);
    setEditorFor(blog.id);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    if (!validation.valid || editorFor === null) return;

    setBusy(true);
    setServerErrors({});
    const creating = editorFor === "new";
    const result = await request<{ blog: AdminBlog }>(
      creating ? "/api/admin/blogs" : `/api/admin/blogs/${editorFor}`,
      { method: creating ? "POST" : "PATCH", json: draft },
    );
    setBusy(false);

    if (!result.ok) {
      setServerErrors(result.fieldErrors ?? {});
      setNotice({ tone: "error", message: result.error });
      return;
    }

    const saved = result.data.blog;
    setBlogs((current) =>
      creating ? [saved, ...current] : current.map((blog) => (blog.id === saved.id ? saved : blog)),
    );
    setEditorFor(null);
    setNotice({
      tone: "success",
      message: creating ? `“${saved.title}” was created.` : `“${saved.title}” was saved.`,
    });
  }

  async function toggleStatus(blog: AdminBlog) {
    const next: BlogStatus = blog.status === "published" ? "draft" : "published";
    setBusy(true);
    const result = await request<{ blog: AdminBlog }>(`/api/admin/blogs/${blog.id}`, {
      method: "PATCH",
      json: { status: next },
    });
    setBusy(false);

    if (!result.ok) {
      setNotice({ tone: "error", message: result.error });
      return;
    }
    const saved = result.data.blog;
    setBlogs((current) => current.map((row) => (row.id === saved.id ? saved : row)));
    setNotice({
      tone: "success",
      message:
        next === "published" ? `“${saved.title}” is now published.` : `“${saved.title}” is back to draft.`,
    });
  }

  async function handleDelete() {
    if (!confirming) return;
    const target = confirming;
    setBusy(true);
    const result = await request<{ id: string }>(`/api/admin/blogs/${target.id}`, { method: "DELETE" });
    setBusy(false);
    setConfirming(null);

    if (!result.ok) {
      setNotice({ tone: "error", message: result.error });
      return;
    }
    setBlogs((current) => current.filter((blog) => blog.id !== target.id));
    setNotice({ tone: "success", message: `“${target.title}” was deleted.` });
  }

  const published = blogs.filter((blog) => blog.status === "published").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Blog manager</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {blogs.length} {blogs.length === 1 ? "post" : "posts"} in data/blogs.json · {published} published
          </p>
        </div>
        <button type="button" className={buttonPrimary} onClick={openNew}>
          <FilePlus2 size={16} aria-hidden="true" />
          New post
        </button>
      </div>

      <NoticeBar notice={notice} onDismiss={() => setNotice(null)} />

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[16rem] flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts"
            aria-label="Search posts"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as BlogStatus | "all")}
          aria-label="Filter by status"
          className={`${inputClass} w-auto!`}
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={blogs.length ? "Nothing matches those filters" : "No posts yet"}
          body={
            blogs.length
              ? "Clear the search box or choose a different status."
              : "Create a post and it will be written to data/blogs.json."
          }
        />
      ) : (
        <ul className="space-y-3">
          {shown.map((blog) => (
            <li key={blog.id} className={`${card} flex flex-wrap items-center gap-4 p-4`}>
              {blog.coverImage ? (
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                  <Image src={blog.coverImage} alt="" fill sizes="96px" className="object-cover" />
                </div>
              ) : null}

              <div className="min-w-[12rem] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{blog.title}</p>
                  <Badge tone={blog.status === "published" ? "live" : "warn"}>
                    {blog.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                  {blog.excerpt || "No excerpt"}
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  /{blog.slug} · {formatDate(blog.publishedDate)}
                  {blog.author ? ` · ${blog.author}` : ""}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className={buttonQuiet}
                  onClick={() => toggleStatus(blog)}
                  disabled={busy}
                >
                  {blog.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button type="button" className={buttonQuiet} onClick={() => openEdit(blog)}>
                  <Pencil size={14} aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  className={buttonDanger}
                  onClick={() => setConfirming(blog)}
                  aria-label={`Delete ${blog.title}`}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={editorFor !== null}
        onClose={() => setEditorFor(null)}
        title={editorFor === "new" ? "New post" : "Edit post"}
        wide
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title" error={errors.title}>
            {(props) => (
              <input
                {...props}
                className={inputClass}
                value={draft.title}
                onChange={(event) => {
                  const title = event.target.value;
                  setTouched((current) => new Set(current).add("title"));
                  // The slug follows the title until someone edits it by hand.
                  setDraft((current) => ({
                    ...current,
                    title,
                    slug: slugTouched ? current.slug : slugify(title),
                  }));
                }}
              />
            )}
          </Field>

          <Field label="Slug" error={errors.slug} hint="The URL segment: lower case, hyphens.">
            {(props) => (
              <input
                {...props}
                className={inputClass}
                value={draft.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  edit("slug", event.target.value);
                }}
              />
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Author" error={errors.author}>
              {(props) => (
                <input
                  {...props}
                  className={inputClass}
                  value={draft.author}
                  onChange={(event) => edit("author", event.target.value)}
                />
              )}
            </Field>
            <Field label="Published date" error={errors.publishedDate}>
              {(props) => (
                <input
                  {...props}
                  type="date"
                  className={inputClass}
                  value={draft.publishedDate.slice(0, 10)}
                  onChange={(event) => edit("publishedDate", event.target.value)}
                />
              )}
            </Field>
            <Field label="Status" error={errors.status}>
              {(props) => (
                <select
                  {...props}
                  className={inputClass}
                  value={draft.status}
                  onChange={(event) => edit("status", event.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              )}
            </Field>
          </div>

          <Field
            label="Category"
            error={errors.category}
            hint="Shown above the title on the published post, for example Guide or Market guide."
          >
            {(props) => (
              <input
                {...props}
                className={inputClass}
                value={draft.category}
                onChange={(event) => edit("category", event.target.value)}
              />
            )}
          </Field>

          <div className="space-y-1.5">
            <p className={labelClass}>Cover image</p>

            {draft.coverImage ? (
              <div className="flex items-start gap-3">
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  <Image src={draft.coverImage} alt="" fill sizes="128px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="font-mono text-[11px] break-all text-slate-400 dark:text-slate-500">
                    {draft.coverImage}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={buttonQuiet}
                      onClick={() => coverRef.current?.click()}
                      disabled={coverBusy}
                    >
                      <ImageUp size={14} aria-hidden="true" />
                      {coverBusy ? "Uploading…" : "Replace"}
                    </button>
                    <button
                      type="button"
                      className={buttonQuiet}
                      onClick={() => edit("coverImage", "")}
                      disabled={coverBusy}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={buttonQuiet}
                onClick={() => coverRef.current?.click()}
                disabled={coverBusy}
              >
                <ImageUp size={14} aria-hidden="true" />
                {coverBusy ? "Uploading…" : "Upload a cover image"}
              </button>
            )}

            {/* The picker itself stays hidden: the buttons above are the control,
                and a bare file input cannot show the image already chosen. */}
            <input
              ref={coverRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                // Clear the input first, so choosing the same file twice after a
                // failure still fires a change event.
                event.target.value = "";
                if (file) void uploadCover(file);
              }}
            />

            {errors.coverImage || coverError ? (
              <p className="text-xs text-red-600 dark:text-red-400">{coverError ?? errors.coverImage}</p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                JPEG, PNG, WebP, AVIF or GIF, up to 8MB. It is stored with the site&rsquo;s other images but
                stays out of the home page gallery.
              </p>
            )}
          </div>

          <Field label="Excerpt" error={errors.excerpt}>
            {(props) => (
              <textarea
                {...props}
                className={inputClass}
                rows={2}
                value={draft.excerpt}
                onChange={(event) => edit("excerpt", event.target.value)}
              />
            )}
          </Field>

          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Content" error={errors.content} hint="Markdown: headings, lists, links, bold.">
              {(props) => (
                <textarea
                  {...props}
                  className={`${inputClass} min-h-[18rem] font-mono text-[13px]`}
                  value={draft.content}
                  onChange={(event) => edit("content", event.target.value)}
                />
              )}
            </Field>
            <div className="space-y-1.5">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400">
                <Eye size={13} aria-hidden="true" />
                Preview
              </p>
              <div className={`${card} max-h-[18rem] overflow-y-auto p-4`} aria-live="off">
                <Markdown
                  source={draft.content}
                  theme={adminTheme}
                  emptyMessage="Nothing to preview yet. Start typing in the content box."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {!validation.valid && (attempted || touched.size > 0) ? (
              <p className="mr-auto text-xs text-slate-500 dark:text-slate-400">
                Fix the highlighted fields to save.
              </p>
            ) : null}
            <button type="button" className={buttonQuiet} onClick={() => setEditorFor(null)}>
              Cancel
            </button>
            {/* Deliberately not disabled while the post is invalid: a dead button
                with no explanation is worse than a press that reveals what is
                missing. handleSubmit refuses and marks every field as attempted. */}
            <button type="submit" className={buttonPrimary} disabled={busy}>
              {busy ? "Saving…" : editorFor === "new" ? "Create post" : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={confirming !== null} onClose={() => setConfirming(null)} title="Delete this post?">
        {confirming ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              “{confirming.title}” will be removed from data/blogs.json. This cannot be undone.
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
