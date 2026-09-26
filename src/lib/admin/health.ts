import "server-only";

/**
 * Whether the things the site depends on are actually configured.
 *
 * This exists because an enquiry form that cannot send mail fails quietly from
 * the operator's side: the visitor sees "please message us on WhatsApp" and
 * nobody else finds out until someone reads the logs. A variable that is
 * present but empty looks configured in the Vercel dashboard and is not.
 *
 * It never reports a value, only whether one is there and how long it is.
 * Length is enough to tell an empty string from a Gmail app password (16
 * characters) without putting a secret on a web page.
 */

export type Check = {
  label: string;
  ok: boolean;
  detail: string;
};

/** The same reading the enquiry action does, so this cannot disagree with it. */
function clean(value: string | undefined): string {
  return (value ?? "").replace(/^["']|["']$/g, "").trim();
}

export function mailChecks(): Check[] {
  const user = clean(process.env.EMAIL_USER || process.env.SMTP_USER);
  const pass = clean(process.env.EMAIL_PASS || process.env.SMTP_PASS);
  const host = clean(process.env.SMTP_HOST) || "smtp.gmail.com (default)";
  const port = clean(process.env.SMTP_PORT) || "465 (default)";
  const to = clean(process.env.CONTACT_RECEIVER_EMAIL || process.env.ENQUIRY_TO_EMAIL);

  const raw = process.env.EMAIL_USER ?? process.env.SMTP_USER;
  const rawPass = process.env.EMAIL_PASS ?? process.env.SMTP_PASS;

  return [
    {
      label: "SMTP user",
      ok: Boolean(user),
      detail: user
        ? `set, ${user.length} characters`
        : raw === undefined
          ? "not set at all"
          : "present but empty once quotes and spaces are stripped",
    },
    {
      label: "SMTP password",
      ok: Boolean(pass),
      detail: pass
        ? `set, ${pass.length} characters`
        : rawPass === undefined
          ? "not set at all"
          : "present but empty once quotes and spaces are stripped",
    },
    { label: "SMTP host", ok: true, detail: host },
    { label: "SMTP port", ok: true, detail: port },
    {
      label: "Enquiries are sent to",
      ok: Boolean(to || user),
      detail: to || (user ? "the SMTP user's own address" : "nowhere: no address configured"),
    },
  ];
}

export function mailWorking(): boolean {
  return mailChecks()
    .filter((check) => check.label.startsWith("SMTP user") || check.label.startsWith("SMTP password"))
    .every((check) => check.ok);
}
