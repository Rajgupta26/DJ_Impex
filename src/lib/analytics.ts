"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Contact events are the site's main success metric, so keep this boring and reliable:
 * fire and forget, never block navigation, never throw.
 */
export type AnalyticsEvent =
  | "whatsapp_click"
  | "directions_click"
  | "call_click"
  | "email_click"
  | "enquiry_submit"
  | "popup_open"
  | "popup_dismiss";

export type AnalyticsProps = Record<string, string | number | boolean | null>;

export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  try {
    vercelTrack(event, props);
  } catch {
    /* Analytics must never break a contact action. */
  }
}
