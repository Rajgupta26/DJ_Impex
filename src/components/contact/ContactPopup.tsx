"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { useOverlay } from "@/components/layout/OverlayContext";
import { Reg } from "@/components/ui/Reg";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { track } from "@/lib/analytics";
import { useFocusTrap } from "@/lib/useFocusTrap";

const SEEN_KEY = "nabeen-popup-seen";
const SENT_KEY = "nabeen-enquiry-sent";
const DELAY_MS = 5000;

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Client requirement: a contact pop-up five seconds after the first page load.
 *
 * Once per session, never on /contact, and never once someone has already sent
 * an enquiry. A centred panel on desktop, a bottom sheet on a phone.
 */
export function ContactPopup({ whatsappHref }: { whatsappHref: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useOverlay("contact-popup", open);

  const close = useCallback(
    (reason: "dismiss" | "success") => {
      setOpen(false);
      if (reason === "dismiss") track("popup_dismiss", { path: pathname });
    },
    [pathname],
  );

  useEffect(() => {
    if (pathname === "/contact") return;
    if (readSession(SEEN_KEY) || readSession(SENT_KEY)) return;

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* Private browsing: show it, just do not remember it. */
      }
      setOpen(true);
      track("popup_open", { path: pathname });
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useFocusTrap(panelRef, open, () => close("dismiss"));

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={() => close("dismiss")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
            className="absolute inset-0 h-full w-full cursor-default bg-navy-deep/60"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-popup-title"
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative w-full max-w-[26rem] border-t-[3px] border-navy bg-white px-6 pb-8 pt-9 shadow-[var(--shadow-float)] sm:px-8"
            style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
          >
            <button
              type="button"
              onClick={() => close("dismiss")}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-slate transition-colors hover:text-navy"
            >
              <span className="visually-hidden">Close</span>
              <X aria-hidden="true" size={22} strokeWidth={1.25} />
            </button>

            <h2 id="contact-popup-title" className="t-h3">
              Talk to the Nabeen
              <Reg /> team
            </h2>
            <p className="t-small mt-2 text-slate">
              Tell us what you trade in. We&rsquo;ll reply on WhatsApp.
            </p>

            <EnquiryForm
              variant="short"
              whatsappHref={whatsappHref}
              onSuccess={() => {
                window.setTimeout(() => close("success"), 2600);
              }}
              className="mt-6"
            />

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "popup" })}
              className="t-small mt-6 flex items-center justify-center gap-2 text-slate transition-colors hover:text-navy"
            >
              <WhatsAppGlyph size={16} />
              <span>Or chat with us on WhatsApp now</span>
            </a>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
