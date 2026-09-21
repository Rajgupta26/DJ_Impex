"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { enquirySchema, formDataToEnquiry, type Enquiry, type EnquiryState } from "@/lib/enquiry";

/**
 * Enquiries are the site's whole point, so this path stays simple and never
 * silently swallows a lead: if email cannot be sent, the form says so and offers
 * WhatsApp instead.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

function asText(enquiry: Enquiry): string {
  const rows: Array<[string, string]> = [
    ["Name", enquiry.fullName],
    ["Company / shop", enquiry.company || "—"],
    ["Market", enquiry.market],
    ["City", enquiry.city || "—"],
    ["WhatsApp", enquiry.whatsappNumber],
    ["Email", enquiry.email || "—"],
    ["Fabrics of interest", enquiry.fabrics.length ? enquiry.fabrics.join(", ") : "—"],
    ["Message", enquiry.message || "—"],
    ["Form", enquiry.variant === "short" ? "Contact pop-up" : "Contact page"],
  ];
  return rows.map(([label, value]) => `${label}: ${value}`).join("\n");
}

export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const parsed = enquirySchema.safeParse(formDataToEnquiry(formData));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const enquiry = parsed.data;

  // The honeypot is invisible to people. If it is filled in, accept quietly.
  if (enquiry.website) {
    return { status: "success", message: "Enquiry sent. Our team will contact you on WhatsApp shortly." };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "That is a lot of enquiries from one place. Please message us on WhatsApp instead.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV === "development") {
      console.info("[enquiry] Email is not configured. Payload:\n%s", asText(enquiry));
      return {
        status: "success",
        message: "Enquiry sent. Our team will contact you on WhatsApp shortly.",
      };
    }
    return {
      status: "error",
      message: "We could not send your enquiry just now. Please message us on WhatsApp.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: enquiry.email || undefined,
      subject: `Fabric enquiry from ${enquiry.fullName} (${enquiry.market})`,
      text: asText(enquiry),
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[enquiry] Resend failed", error);
    return {
      status: "error",
      message: "We could not send your enquiry just now. Please message us on WhatsApp.",
    };
  }

  return {
    status: "success",
    message: "Enquiry sent. Our team will contact you on WhatsApp shortly.",
  };
}
