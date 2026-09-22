"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mail, Phone, X } from "lucide-react";
import { useRef } from "react";

import type { HeaderContact } from "@/components/layout/Header";
import { useOverlay } from "@/components/layout/OverlayContext";
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
  useFocusTrap(panelRef, open, onClose);

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
          className="on-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-navy-deep text-white lg:hidden"
        >
          <div className="container-site flex h-[4.5rem] shrink-0 items-center justify-between">
            <Image
              src="/images/logos/nabeen-logo-white.png"
              alt="Nabeen, luxury fabrics by DJI"
              width={1088}
              height={345}
              className="h-8 w-auto"
            />
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 flex h-11 w-11 items-center justify-center"
            >
              <span className="visually-hidden">Close menu</span>
              <X aria-hidden="true" strokeWidth={1.25} size={26} />
            </button>
          </div>

          <nav aria-label="Main" className="container-site mt-6 flex-1">
            <ul className="grid">
              {navigation.map((item) => {
                const isContact = item.href === "/contact" || item.href === "/#contact";

                return (
                  <li key={item.href} className="border-t border-white/12">
                    <Link
                      href={isContact ? "/#contact" : item.href}
                      onClick={(e) => {
                        onClose();
                        if (isContact && pathname === "/") {
                          e.preventDefault();
                          setTimeout(() => {
                            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                            window.history.pushState(null, "", "/#contact");
                          }, 150);
                        }
                      }}
                      className="t-h3 block py-5 font-light [font-stretch:80%] text-[clamp(1.5rem,1.1rem+2.4vw,2.25rem)]"
                    >
                      {withReg(item.label)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className="container-site mt-10 border-t border-white/12 pt-8"
            style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
          >
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
                className="flex items-center gap-3"
              >
                <Phone aria-hidden="true" size={17} strokeWidth={1.5} />
                <span>{contact.telDisplay}</span>
              </a>
              <a
                href={contact.email}
                onClick={() => track("email_click", { location: "menu" })}
                className="flex items-center gap-3"
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
