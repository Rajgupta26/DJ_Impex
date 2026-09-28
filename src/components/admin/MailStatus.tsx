import { Fragment } from "react";

import { mailChecks, mailWorking } from "@/lib/admin/health";

/**
 * Whether enquiries are actually being emailed.
 *
 * This lived on the dashboard, which has been removed. It belongs with the
 * enquiries rather than on a summary page anyway: a form that cannot send mail
 * fails quietly from the operator's side, and this is the screen they are on
 * when they wonder why nothing reached their inbox.
 *
 * It never prints a value, only whether one is set and how long it is.
 */
export function MailStatus() {
  const checks = mailChecks();
  const ok = mailWorking();

  if (ok) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm dark:border-red-900 dark:bg-red-950">
      <h2 className="font-semibold text-red-900 dark:text-red-200">Enquiries are not being emailed</h2>
      <p className="mt-2 text-red-900 dark:text-red-200">
        The website still records every enquiry on this screen, so nothing is lost, but no email goes out and
        the form tells visitors to use WhatsApp instead. Set the missing values in the Vercel project settings
        and redeploy.
      </p>
      <dl className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-[12rem_1fr]">
        {checks.map((check) => (
          <Fragment key={check.label}>
            <dt className="text-red-800/80 dark:text-red-300/80">{check.label}</dt>
            <dd
              className={
                check.ok ? "text-red-900 dark:text-red-200" : "font-medium text-red-900 dark:text-red-200"
              }
            >
              {check.detail}
            </dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}
