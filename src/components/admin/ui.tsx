"use client";

import { AlertTriangle, Check, Info, X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * The panel's small parts. Internal tooling, so it deliberately does not use the
 * brand's `t-*` type classes: those live unlayered in tokens.css and beat every
 * Tailwind utility, which makes them unusable for dense UI.
 */

export const card = "rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900";

export const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none " +
  "disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 " +
  "dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-400/20";

export const labelClass =
  "block text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400";

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium " +
  "transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy " +
  "disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:outline-slate-300";

export const buttonPrimary = `${buttonBase} bg-navy text-white hover:bg-navy-soft dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white`;

export const buttonQuiet = `${buttonBase} border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800`;

export const buttonDanger = `${buttonBase} border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950`;

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; "aria-describedby"?: string }) => ReactNode;
}) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children({ id, "aria-describedby": message ? messageId : undefined })}
      {message ? (
        <p
          id={messageId}
          className={
            error ? "text-xs text-red-600 dark:text-red-400" : "text-xs text-slate-500 dark:text-slate-400"
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

const badgeTones = {
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  blue: "bg-navy/10 text-navy dark:bg-slate-700 dark:text-slate-100",
  live: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  warn: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
} as const;

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof badgeTones;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeTones[tone]}`}
    >
      {children}
    </span>
  );
}

/**
 * A dialog built on <dialog>, so focus containment, Escape and the top layer
 * come from the platform rather than from a hand-rolled focus trap.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Only a click on the backdrop itself, never one that bubbled from inside.
        if (event.target === ref.current) onClose();
      }}
      aria-label={title}
      className={`m-auto w-[calc(100vw-2rem)] rounded-lg bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/50 dark:bg-slate-900 dark:text-slate-100 ${
        wide ? "max-w-3xl" : "max-w-xl"
      }`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <h2 className="text-base font-semibold">{title}</h2>
        <button type="button" onClick={onClose} className={`${buttonQuiet} !px-2 !py-1`} aria-label="Close">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
    </dialog>
  );
}

export type Notice = { tone: "success" | "error" | "info"; message: string } | null;

export function NoticeBar({ notice, onDismiss }: { notice: Notice; onDismiss: () => void }) {
  if (!notice) return null;
  const tone = {
    success: {
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
      Icon: Check,
    },
    error: {
      className:
        "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
      Icon: AlertTriangle,
    },
    info: {
      className:
        "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
      Icon: Info,
    },
  }[notice.tone];

  return (
    <div
      // Announced rather than rendered silently: most of these follow a write
      // that the reader cannot otherwise confirm.
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${tone.className}`}
    >
      <tone.Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="flex-1">{notice.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className={`${card} px-6 py-14 text-center`}>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{body}</p>
    </div>
  );
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${formatDate(value)}, ${date.toLocaleTimeString("en-IN", { timeStyle: "short" })}`;
}
