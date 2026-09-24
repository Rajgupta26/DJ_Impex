"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useOverlay } from "@/components/layout/OverlayContext";
import { withReg } from "@/components/ui/Reg";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { track } from "@/lib/analytics";
import { useFocusTrap } from "@/lib/useFocusTrap";

const SEEN_KEY = "nabeen-popup-seen";
const SENT_KEY = "nabeen-enquiry-sent";

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * The welcome pop-up, rebuilt to the agency's mock (2026-09-23): the mark, a
 * rule, the line, a rule, and one WhatsApp button. The short enquiry form that
 * used to sit here is gone -- the mock has no form.
 *
 * It opens six seconds after the first page load, once per session, and never
 * once someone has already sent an enquiry. It no longer skips the home page:
 * the instruction is that it appears when a visitor arrives, and the home page
 * is where they arrive. The enquiry form is at the foot of that page, which the
 * reader will not have reached six seconds in.
 *
 * The button is WhatsApp's own green. See the note on `--color-whatsapp` in
 * tokens.css: the authentic green carries white at 1.98:1, which fails, and the
 * agency asked for the authentic green anyway. 05-open-questions 143.
 */
export function ContactPopup({
  whatsappHref,
  line,
  cta,
  delaySeconds,
}: {
  whatsappHref: string;
  line: string;
  cta: string;
  delaySeconds: number;
}) {
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
    if (readSession(SEEN_KEY) || readSession(SENT_KEY)) return;

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* Private browsing: show it, just do not remember it. */
      }
      setOpen(true);
      track("popup_open", { path: pathname });
    }, delaySeconds * 1000);

    return () => window.clearTimeout(timer);
    // Once per session, on whichever page the visitor happens to land on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusTrap(panelRef, open, () => close("dismiss"));

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-[44rem] bg-white px-6 pb-12 pt-14 text-center shadow-[var(--shadow-float)] sm:px-12 sm:pb-16 sm:pt-16"
          >
            <button
              type="button"
              onClick={() => close("dismiss")}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-slate transition-colors hover:text-navy"
            >
              <span className="visually-hidden">Close</span>
              <X aria-hidden="true" size={30} strokeWidth={1.25} />
            </button>

            <Image
              src="/images/logos/nabeen-logo-navy.png"
              alt="Nabeen, luxury fabrics by DJI"
              width={1088}
              height={345}
              priority
              className="mx-auto h-auto w-[min(20rem,70%)]"
            />

            <p
              id="contact-popup-title"
              className="mt-12 border-y border-line py-6 text-[clamp(1rem,0.9rem+0.5vw,1.25rem)] leading-relaxed text-navy-mid sm:mt-14"
            >
              {withReg(line)}
            </p>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "popup" })}
              className="mt-12 inline-flex min-h-12 items-center justify-center gap-2.5 bg-[var(--color-whatsapp)] px-8 py-3.5 font-semibold uppercase tracking-[0.06em] text-[var(--color-whatsapp-ink)] transition-opacity duration-[var(--duration-quick)] hover:opacity-90 sm:mt-14"
            >
              <WhatsAppGlyph size={20} />
              <span>{cta}</span>
            </a>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
