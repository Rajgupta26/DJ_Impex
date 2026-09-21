import { z } from "zod";

/** The markets offered in the form's select, per brand-kit/content/contact.md. */
export const MARKETS = ["Nigeria", "Ghana", "UAE", "Saudi Arabia", "India", "Other"] as const;

export const enquirySchema = z.object({
  /** Honeypot. Real people never fill this in; bots do. */
  website: z.string().max(0, "Something went wrong. Please try again.").optional().default(""),
  variant: z.enum(["full", "short"]).default("full"),
  fullName: z.string().trim().min(2, "Please tell us your name.").max(100),
  company: z.string().trim().max(120).optional().default(""),
  market: z.enum(MARKETS, { message: "Please choose your market." }),
  city: z.string().trim().max(80).optional().default(""),
  whatsappNumber: z
    .string()
    .trim()
    .min(7, "Please add your WhatsApp number, with country code.")
    .max(24)
    .regex(/^\+?[0-9\s()-]{7,24}$/, "Please use digits, with the country code."),
  email: z.union([z.literal(""), z.email("Please check this email address.")]).optional().default(""),
  fabrics: z.array(z.string()).max(12).optional().default([]),
  message: z.string().trim().max(2000).optional().default(""),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

export type EnquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success"; message: string };

export const IDLE: EnquiryState = { status: "idle" };

/** Turn FormData into the shape the schema expects. */
export function formDataToEnquiry(formData: FormData): EnquiryInput {
  return {
    website: String(formData.get("website") ?? ""),
    variant: (String(formData.get("variant") ?? "full") as "full" | "short") ?? "full",
    fullName: String(formData.get("fullName") ?? ""),
    company: String(formData.get("company") ?? ""),
    market: String(formData.get("market") ?? "") as Enquiry["market"],
    city: String(formData.get("city") ?? ""),
    whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
    email: String(formData.get("email") ?? ""),
    fabrics: formData.getAll("fabrics").map(String),
    message: String(formData.get("message") ?? ""),
  };
}
