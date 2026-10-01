"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mail, Phone, X } from "lucide-react";
import { useRef } from "react";

import type { HeaderContact } from "@/components/layout/Header";
import { useOverlay } from "@/components/layout/OverlayContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { withReg } from "@/components/ui/Reg";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { track } from "@/lib/analytics";
import { useFocusTrap } from "@/lib/useFocusTrap";
import type { NavItem } from "@/lib/site";

/** Full-screen Midnight Loom menu: large condensed links and the contact shortcuts. */
export function MobileMenu({
  open,
  onClose,
  navigation,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  navigation: NavItem[];
  contact: HeaderContact;
}) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useOverlay("mobile-menu", open);
  useFocusTrap(panelRef, open, onClose, "nav a");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          tabIndex={-1}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: [0.22, 0.61, 0.36, 1] }}
          className="on-dark fixed inset-0 z-50 flex h-dvh flex-col overflow-y-auto overscroll-contain bg-navy-deep text-white xl:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:h-[4.5rem] sm:px-8">
            {/* Mobile emblem: DJI crest emblem on mobile */}
            <div className="block sm:hidden">
              <Image
                src="/images/logos/dji-logo-transparent.png"
                alt="D J Impex & Co."
                width={120}
                height={120}
                className="h-9 w-auto object-contain"
              />
            </div>

            {/* Tablet & Desktop logo */}
            <div className="hidden sm:block">
              <Image
                src="/images/logos/nabeen-logo-white.png"
                alt="Nabeen, luxury fabrics by DJI"
                width={1088}
                height={345}
                className="h-8 w-auto"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-white/10 active:scale-95"
            >
              <span className="visually-hidden">Close menu</span>
              <X aria-hidden="true" strokeWidth={1.5} size={24} />
            </button>
          </div>

          <nav aria-label="Main" className="mt-4 flex-1 px-4 sm:px-8">
            <ul className="grid">
              {navigation.map((item) => {
                const active = pathname === item.href;

                return (
                  <li key={item.href} className="border-t border-white/12">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className="t-h3 block py-3.5 font-light text-[clamp(1.4rem,1.1rem+2vw,2.15rem)] transition-colors hover:text-accent sm:py-4"
                    >
                      {withReg(item.label)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className="mt-6 border-t border-white/12 px-4 pt-5 sm:px-8"
            style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
          >
            <LanguageSelector variant="mobile" className="mb-6" />

            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "menu" })}
              className="btn btn-on-dark w-full justify-center"
            >
              <WhatsAppGlyph size={20} />
              <span>Enquire on WhatsApp</span>
            </a>

            <div className="mt-6 grid gap-3 text-white/75">
              <a
                href={contact.tel}
                onClick={() => track("call_click", { location: "menu" })}
                className="flex min-h-11 min-w-0 items-center gap-3 break-words hover:text-white"
              >
                <Phone aria-hidden="true" size={17} strokeWidth={1.5} />
                <span>{contact.telDisplay}</span>
              </a>
              <a
                href={contact.email}
                onClick={() => track("email_click", { location: "menu" })}
                className="flex min-h-11 min-w-0 items-center gap-3 break-words hover:text-white"
              >
                <Mail aria-hidden="true" size={17} strokeWidth={1.5} />
                <span>{contact.emailDisplay}</span>
              </a>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
