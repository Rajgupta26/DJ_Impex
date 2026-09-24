import "server-only";

import type { Enquiry } from "@/lib/enquiry";

import type { AdminEnquiry } from "./schemas";
import { mutate, newId, nowIso } from "./store";

/** Keep the file from growing without bound on a long-lived server. */
const MAX_ROWS = 500;

/**
 * Append a website enquiry to data/enquiries.json so it appears in the admin
 * panel. Email is still the primary delivery: this is a second copy, and it must
 * never be the reason a customer sees a failure. Every error is swallowed and
 * logged, deliberately.
 */
export async function recordEnquiry(enquiry: Enquiry): Promise<void> {
  const details = [
    `WhatsApp: ${enquiry.countryCode} ${enquiry.whatsappNumber}`,
    enquiry.fabrics.length ? `Fabrics of interest: ${enquiry.fabrics.join(", ")}` : null,
    enquiry.usage.length ? `Usage: ${enquiry.usage.join(", ")}` : null,
    enquiry.message ? `\n${enquiry.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const row: AdminEnquiry = {
    id: newId(),
    name: enquiry.fullName.slice(0, 120),
    email: enquiry.email.slice(0, 160),
    subject: enquiry.variant === "short" ? "Enquiry from the contact pop-up" : "Enquiry from the home page",
    message: details.slice(0, 4000),
    date: nowIso(),
    status: "unread",
  };

  try {
    await mutate("enquiries", (rows) => ({ rows: [row, ...rows].slice(0, MAX_ROWS), result: null }));
  } catch (error) {
    console.error("[enquiry] Could not append to data/enquiries.json:", error);
  }
}
