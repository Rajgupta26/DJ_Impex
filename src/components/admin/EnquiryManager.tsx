"use client";

import { useMemo, useState } from "react";
import { Mail, Search, Trash2 } from "lucide-react";

import { ENQUIRY_STATUSES, type AdminEnquiry, type EnquiryStatus } from "@/lib/admin/schemas";

import { request } from "./request";
import {
  Badge,
  buttonDanger,
  buttonPrimary,
  buttonQuiet,
  card,
  EmptyState,
  formatDateTime,
  inputClass,
  Modal,
  NoticeBar,
  type Notice,
} from "./ui";

const STATUS_LABEL: Record<EnquiryStatus, string> = {
  unread: "Unread",
  read: "Read",
  replied: "Replied",
};

const STATUS_TONE: Record<EnquiryStatus, "warn" | "blue" | "live"> = {
  unread: "warn",
  read: "blue",
  replied: "live",
};

export function EnquiryManager({ initial }: { initial: AdminEnquiry[] }) {
  const [enquiries, setEnquiries] = useState(initial);
  const [notice, setNotice] = useState<Notice>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | "all">("all");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<AdminEnquiry | null>(null);
  const [confirming, setConfirming] = useState<AdminEnquiry | null>(null);

  const counts = useMemo(() => {
    const tally: Record<EnquiryStatus, number> = { unread: 0, read: 0, replied: 0 };
    for (const enquiry of enquiries) tally[enquiry.status] += 1;
    return tally;
  }, [enquiries]);

  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      if (statusFilter !== "all" && enquiry.status !== statusFilter) return false;
      if (!term) return true;
      return [enquiry.name, enquiry.email, enquiry.subject, enquiry.message].some((value) =>
        value.toLowerCase().includes(term),
      );
    });
  }, [enquiries, query, statusFilter]);

  async function setStatus(enquiry: AdminEnquiry, status: EnquiryStatus) {
    if (enquiry.status === status) return;

    setBusy(true);
    const result = await request<{ enquiry: AdminEnquiry }>(`/api/admin/enquiries/${enquiry.id}`, {
      method: "PATCH",
      json: { status },
    });
    setBusy(false);

    if (!result.ok) {
      setNotice({ tone: "error", message: result.error });
      return;
    }
    const saved = result.data.enquiry;
    setEnquiries((current) => current.map((row) => (row.id === saved.id ? saved : row)));
    setOpen((current) => (current && current.id === saved.id ? saved : current));
  }

  /** Opening an enquiry marks it read, the way a mail client does. */
  function openEnquiry(enquiry: AdminEnquiry) {
    setOpen(enquiry);
    if (enquiry.status === "unread") void setStatus(enquiry, "read");
  }

  async function handleDelete() {
    if (!confirming) return;
    const target = confirming;
    setBusy(true);
    const result = await request<{ id: string }>(`/api/admin/enquiries/${target.id}`, {
      method: "DELETE",
    });
    setBusy(false);
    setConfirming(null);

    if (!result.ok) {
      setNotice({ tone: "error", message: result.error });
      return;
    }
    setEnquiries((current) => current.filter((row) => row.id !== target.id));
    setOpen((current) => (current && current.id === target.id ? null : current));
    setNotice({ tone: "success", message: `The enquiry from ${target.name} was deleted.` });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Enquiries</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {enquiries.length} in data/enquiries.json · {counts.unread} unread · {counts.replied} replied
        </p>
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
            placeholder="Search name, email, subject or message"
            aria-label="Search enquiries"
            className={`${inputClass} pl-9`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as EnquiryStatus | "all")}
          aria-label="Filter by status"
          className={`${inputClass} w-auto!`}
        >
          <option value="all">All statuses</option>
          {ENQUIRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          title={enquiries.length ? "Nothing matches those filters" : "No enquiries yet"}
          body={
            enquiries.length
              ? "Clear the search box or choose a different status."
              : "Submissions from the website's enquiry form are appended to data/enquiries.json."
          }
        />
      ) : (
        <ul className="space-y-2">
          {shown.map((enquiry) => (
            <li key={enquiry.id} className={`${card} p-4`}>
              <div className="flex flex-wrap items-start gap-4">
                <button
                  type="button"
                  onClick={() => openEnquiry(enquiry)}
                  className="min-w-[14rem] flex-1 text-left"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm ${enquiry.status === "unread" ? "font-semibold" : "font-medium"}`}
                    >
                      {enquiry.name}
                    </span>
                    <Badge tone={STATUS_TONE[enquiry.status]}>{STATUS_LABEL[enquiry.status]}</Badge>
                  </span>
                  <span className="mt-1 block text-sm text-slate-700 dark:text-slate-300">
                    {enquiry.subject || "No subject"}
                  </span>
                  <span className="mt-1 line-clamp-1 block text-xs text-slate-500 dark:text-slate-400">
                    {enquiry.message}
                  </span>
                  <span className="mt-1 block text-[11px] text-slate-400 dark:text-slate-500">
                    {formatDateTime(enquiry.date)}
                    {enquiry.email ? ` · ${enquiry.email}` : ""}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <select
                    value={enquiry.status}
                    onChange={(event) => setStatus(enquiry, event.target.value as EnquiryStatus)}
                    aria-label={`Status of the enquiry from ${enquiry.name}`}
                    disabled={busy}
                    className={`${inputClass} w-auto! py-1.5 text-xs`}
                  >
                    {ENQUIRY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={buttonDanger}
                    onClick={() => setConfirming(enquiry)}
                    aria-label={`Delete the enquiry from ${enquiry.name}`}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open !== null} onClose={() => setOpen(null)} title="Enquiry" wide>
        {open ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold">{open.subject || "No subject"}</p>
              <Badge tone={STATUS_TONE[open.status]}>{STATUS_LABEL[open.status]}</Badge>
            </div>

            <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[8rem_1fr]">
              <dt className="text-slate-500 dark:text-slate-400">From</dt>
              <dd>{open.name}</dd>
              <dt className="text-slate-500 dark:text-slate-400">Email</dt>
              <dd>
                {open.email ? (
                  <a
                    href={`mailto:${encodeURIComponent(open.email)}`}
                    className="text-navy underline dark:text-slate-200"
                  >
                    {open.email}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt className="text-slate-500 dark:text-slate-400">Received</dt>
              <dd>{formatDateTime(open.date)}</dd>
            </dl>

            <div className={`${card} p-4 text-sm whitespace-pre-wrap`}>{open.message || "—"}</div>

            <div className="flex flex-wrap justify-end gap-2 pt-1">
              {open.email ? (
                <a href={`mailto:${encodeURIComponent(open.email)}`} className={buttonQuiet}>
                  <Mail size={14} aria-hidden="true" />
                  Reply by email
                </a>
              ) : null}
              {open.status !== "replied" ? (
                <button
                  type="button"
                  className={buttonPrimary}
                  disabled={busy}
                  onClick={() => setStatus(open, "replied")}
                >
                  Mark as replied
                </button>
              ) : (
                <button
                  type="button"
                  className={buttonQuiet}
                  disabled={busy}
                  onClick={() => setStatus(open, "read")}
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={confirming !== null} onClose={() => setConfirming(null)} title="Delete this enquiry?">
        {confirming ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The enquiry from {confirming.name} will be removed from data/enquiries.json. This cannot be
              undone, and it is the only copy the panel holds.
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
