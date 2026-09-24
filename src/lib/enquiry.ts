import { z } from "zod";

/** Common country calling codes for WhatsApp enquiries. */
export const COUNTRY_CODES = [
  { value: "+91", label: "India (+91)" },
  { value: "+234", label: "Nigeria (+234)" },
  { value: "+233", label: "Ghana (+233)" },
  { value: "+971", label: "UAE (+971)" },
  { value: "+966", label: "Saudi Arabia (+966)" },
  { value: "+1", label: "United States / Canada (+1)" },
  { value: "+44", label: "United Kingdom (+44)" },
] as const;

const countryCodeValues = COUNTRY_CODES.map(({ value }) => value) as [
  (typeof COUNTRY_CODES)[number]["value"],
  ...(typeof COUNTRY_CODES)[number]["value"][],
];

export const enquirySchema = z.object({
  /** Honeypot. Real people never fill this in; bots do. */
  website: z.string().max(0, "Something went wrong. Please try again.").optional().default(""),
  variant: z.enum(["full", "short"]).default("full"),
  fullName: z.string().trim().min(2, "Please tell us your name.").max(100),
  countryCode: z.enum(countryCodeValues, { message: "Please choose a country code." }),
  whatsappNumber: z
    .string()
    .trim()
    .min(5, "Please add your WhatsApp number.")
    .max(20)
    .regex(/^[0-9\s()-]{5,20}$/, "Please use digits only for your WhatsApp number."),
  email: z
    .union([z.literal(""), z.email("Please check this email address.")])
    .optional()
    .default(""),
  fabrics: z.array(z.string()).max(12).optional().default([]),
  usage: z
    .array(z.enum(["Wholesale", "Retail", "Personal use"]))
    .max(3)
    .optional()
    .default([]),
  message: z.string().trim().max(2000).optional().default(""),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

export type EnquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success"; message: string };

export const IDLE: EnquiryState = { status: "idle" };

export function formattedWhatsAppNumber(enquiry: Pick<Enquiry, "countryCode" | "whatsappNumber">): string {
  return `${enquiry.countryCode} ${enquiry.whatsappNumber}`;
}

/** Turn FormData into the shape the schema expects. */
export function formDataToEnquiry(formData: FormData): EnquiryInput {
  return {
    website: String(formData.get("website") ?? ""),
    variant: (String(formData.get("variant") ?? "full") as "full" | "short") ?? "full",
    fullName: String(formData.get("fullName") ?? ""),
    countryCode: String(formData.get("countryCode") ?? "") as Enquiry["countryCode"],
    whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
    email: String(formData.get("email") ?? ""),
    fabrics: formData.getAll("fabrics").map(String),
    usage: formData.getAll("usage").map(String) as Enquiry["usage"],
    message: String(formData.get("message") ?? ""),
  };
}
