"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";

import { enquirySchema, formDataToEnquiry, type Enquiry, type EnquiryState } from "@/lib/enquiry";

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
  const fullWhatsApp = `${enquiry.countryCode} ${enquiry.whatsappNumber}`;
  const rows: Array<[string, string]> = [
    ["Name", enquiry.fullName],
    ["WhatsApp", fullWhatsApp],
    ["Email", enquiry.email || "—"],
    ["Fabrics of interest", enquiry.fabrics.length ? enquiry.fabrics.join(", ") : "—"],
    ["Usage", enquiry.usage.length ? enquiry.usage.join(", ") : "—"],
    ["Message", enquiry.message || "—"],
    ["Form", enquiry.variant === "short" ? "Contact pop-up" : "Homepage contact section"],
  ];
  return rows.map(([label, value]) => `${label}: ${value}`).join("\n");
}

function getAdminHtml(enquiry: Enquiry): string {
  const fullWhatsApp = `${enquiry.countryCode} ${enquiry.whatsappNumber}`;
  const cleanNumber = fullWhatsApp.replace(/[^0-9]/g, "");
  const rows = [
    ["Full Name", enquiry.fullName],
    [
      "WhatsApp Number",
      `<a href="https://wa.me/${cleanNumber}" style="color: #172850; font-weight: 600; text-decoration: underline;">${fullWhatsApp}</a>`,
    ],
    [
      "Email",
      enquiry.email
        ? `<a href="mailto:${enquiry.email}" style="color: #172850; text-decoration: underline;">${enquiry.email}</a>`
        : "—",
    ],
    ["Fabrics of Interest", enquiry.fabrics.length ? enquiry.fabrics.join(", ") : "—"],
    ["Usage", enquiry.usage.length ? enquiry.usage.join(", ") : "—"],
    ["Message", enquiry.message || "—"],
    ["Form Source", enquiry.variant === "short" ? "Contact Pop-up" : "Homepage Contact Section"],
  ];

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Fabric Enquiry</title>
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .content-cell { padding: 18px !important; }
      .row-label { width: 100% !important; display: block !important; padding-bottom: 2px !important; }
      .row-val { width: 100% !important; display: block !important; padding-top: 2px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px 10px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #172850; padding: 26px 24px; text-align: left; border-bottom: 3px solid #B8925A;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Nabeen&reg; &middot; New Fabric Enquiry</h1>
              <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 13px;">Submitted on ${new Date().toLocaleDateString("en-IN", { dateStyle: "medium" })} at ${new Date().toLocaleTimeString("en-IN", { timeStyle: "short" })}</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="content-cell" style="padding: 24px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; line-height: 1.6; border-collapse: collapse;">
                ${rows
                  .map(
                    ([label, val]) => `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td class="row-label" style="padding: 10px 8px; font-weight: 600; color: #475569; width: 36%; vertical-align: top;">${label}</td>
                      <td class="row-val" style="padding: 10px 8px; color: #0f172a; vertical-align: top;">${val}</td>
                    </tr>
                  `,
                  )
                  .join("")}
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 24px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; text-align: center;">
              D J Impex &amp; Co. &middot; B-90 Gopal Gully Mangaldas Market Mumbai 400002
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getCustomerHtml(enquiry: Enquiry): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Enquiry Confirmation - Nabeen Luxury Fabrics</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .fluid-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-title { font-size: 20px !important; }
      .mobile-text { font-size: 14px !important; line-height: 1.6 !important; }
      .btn-table { width: 100% !important; }
      .btn-link { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 10px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #172850; padding: 32px 24px 28px; text-align: center;">
              <h1 class="mobile-title" style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: 2px;">NABEEN<span style="font-size: 14px; vertical-align: top;">&reg;</span></h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: #B8925A; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500;">Luxury Fabrics by DJI &middot; Est. 1995</p>
            </td>
          </tr>

          <!-- Gold Accent Rule -->
          <tr>
            <td style="height: 3px; background-color: #B8925A; line-height: 3px; font-size: 3px;">&nbsp;</td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="fluid-padding" style="padding: 32px 32px 24px; text-align: left;">
              <p class="mobile-text" style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #1e293b;">Dear <strong>${enquiry.fullName}</strong>,</p>
              
              <p class="mobile-text" style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Thank you for your enquiry with <strong>Nabeen&reg;</strong>. We have safely received your request regarding our fabric collections.
              </p>
              
              <p class="mobile-text" style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Our export and customer support team is reviewing your requirements and will reach out to you directly on WhatsApp at <strong>${enquiry.countryCode} ${enquiry.whatsappNumber}</strong> or via this email.
              </p>

              <!-- Summary Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-left: 3px solid #B8925A; border-radius: 4px; margin: 0 0 24px 0;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; color: #172850; letter-spacing: 0.5px;">Your Enquiry Details</p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; line-height: 1.6; color: #475569;">
                      ${enquiry.fabrics.length ? `<tr><td style="padding: 3px 0; width: 35%;"><strong>Fabrics:</strong></td><td style="padding: 3px 0; color: #0f172a;">${enquiry.fabrics.join(", ")}</td></tr>` : ""}
                      ${enquiry.usage.length ? `<tr><td style="padding: 3px 0; width: 35%;"><strong>Usage:</strong></td><td style="padding: 3px 0; color: #0f172a;">${enquiry.usage.join(", ")}</td></tr>` : ""}
                      ${enquiry.message ? `<tr><td style="padding: 3px 0; width: 35%; vertical-align: top;"><strong>Message:</strong></td><td style="padding: 3px 0; color: #0f172a;">${enquiry.message}</td></tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- WhatsApp CTA Button -->
              <table role="presentation" class="btn-table" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 28px auto 24px;">
                <tr>
                  <td align="center" style="border-radius: 4px; background-color: #172850;">
                    <a href="https://wa.me/919819693626" class="btn-link" target="_blank" style="font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 12px 26px; display: inline-block; border-radius: 4px;">
                      Chat with us on WhatsApp &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p class="mobile-text" style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                Warm regards,<br />
                <strong style="color: #1e293b;">The Nabeen&reg; Team</strong><br />
                D J Impex &amp; Co., Mumbai
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; line-height: 1.5; color: #64748b;">
              <p style="margin: 0 0 4px 0; font-weight: 600; color: #172850;">D J Impex &amp; Co. &middot; Star Export House</p>
              <p style="margin: 0 0 8px 0;">B-90, 2nd Building, Gopal Gully, Mangaldas Market, Mumbai 400002, Maharashtra, India</p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">This is an automated confirmation of your enquiry sent via our official website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function submitEnquiry(_previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
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

  const rawUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const rawPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const smtpUser = rawUser?.replace(/^["']|["']$/g, "").trim();
  const smtpPass = rawPass?.replace(/^["']|["']$/g, "").trim();
  const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").replace(/^["']|["']$/g, "").trim();
  const smtpPort = Number((process.env.SMTP_PORT || "465").replace(/^["']|["']$/g, "").trim());

  const enquiryTo = (
    process.env.CONTACT_RECEIVER_EMAIL ||
    process.env.ENQUIRY_TO_EMAIL ||
    smtpUser ||
    "ceo@djimpex.in"
  )
    .replace(/^["']|["']$/g, "")
    .trim();

  // Crucial for SPF/DKIM delivery: The from address must match the authenticated Gmail account
  const fromAddress = smtpUser || "akshaychavan44.ac@gmail.com";
  const enquiryFrom = `"Nabeen Luxury Fabrics" <${fromAddress}>`;

  // No credentials, no email. This used to log the enquiry and then return
  // success, which told the customer their enquiry had been sent when nothing
  // had left the building: the only copy was one line in a server log, and on a
  // serverless host those roll off. A form that lies about delivering is worse
  // than a form that fails, because nobody goes looking for the lost ones.
  //
  // It now fails the way a send failure fails, which the form already handles:
  // it shows the message and offers WhatsApp. The enquiry is still logged, at
  // error level, so a misconfiguration is loud and the lead is recoverable from
  // the logs while it is still there.
  if (!smtpUser || !smtpPass) {
    console.error(
      "[enquiry] SMTP is not configured (EMAIL_USER / EMAIL_PASS are unset), so this enquiry was NOT sent:\n%s",
      asText(enquiry),
    );
    return {
      status: "error",
      message: "We could not send your enquiry just now. Please message us on WhatsApp.",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 1. Send all enquiry details to the business
    await transporter.sendMail({
      from: enquiryFrom,
      to: enquiryTo,
      replyTo: enquiry.email || undefined,
      subject: `New Fabric Enquiry: ${enquiry.fullName} (${enquiry.countryCode} ${enquiry.whatsappNumber})`,
      text: asText(enquiry),
      html: getAdminHtml(enquiry),
      headers: {
        "X-Priority": "3",
        "X-Mailer": "Nabeen Luxury Fabrics Mailer",
      },
    });

    // 2. Send auto-reply confirmation to the customer (if email provided)
    if (enquiry.email) {
      const customerText = `Dear ${enquiry.fullName},\n\nThank you for reaching out to Nabeen®. We have received your enquiry regarding our luxury fabric collection.\n\nOur export team will connect with you shortly on WhatsApp (${enquiry.countryCode} ${enquiry.whatsappNumber}) or by email.\n\nEnquiry Summary:\n- Fabrics of interest: ${enquiry.fabrics.length ? enquiry.fabrics.join(", ") : "General enquiry"}\n${enquiry.usage.length ? `- Usage: ${enquiry.usage.join(", ")}\n` : ""}${enquiry.message ? `- Message: ${enquiry.message}\n` : ""}\nIf you need urgent assistance, you can reach us on WhatsApp: https://wa.me/919819693626\n\nWarm regards,\nThe Nabeen® Team\nD J Impex & Co., Mumbai`;

      await transporter.sendMail({
        from: enquiryFrom,
        to: enquiry.email,
        replyTo: enquiryTo, // Replies from customer go directly to your business email
        subject: "Enquiry Confirmation - Nabeen Luxury Fabrics",
        text: customerText,
        html: getCustomerHtml(enquiry),
        headers: {
          "Auto-Submitted": "auto-replied",
          "X-Auto-Response-Suppress": "All",
          Precedence: "bulk",
          "X-Priority": "3",
          "X-Mailer": "Nabeen Luxury Fabrics Mailer",
        },
      });
    }
  } catch (error) {
    console.error("[enquiry] Nodemailer send failed:", error);
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
