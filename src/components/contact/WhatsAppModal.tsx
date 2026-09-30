"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { submitEnquiry } from "@/app/actions/enquiry";
import { useWhatsAppPopup } from "@/components/layout/OverlayContext";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { track } from "@/lib/analytics";
import { COUNTRY_CODES, IDLE } from "@/lib/enquiry";
import { useFocusTrap } from "@/lib/useFocusTrap";

const DEFAULT_FABRICS = [
  "Giza Cotton",
  "Swiss Lace",
  "Atiku",
  "Voile & Jacquard",
  "Suiting",
  "Wool",
];

const USAGE_OPTIONS = [
  "Distributor",
  "Wholesaler",
  "Retailer",
  "Fashion House / Tailor",
];

export function WhatsAppModal({
  fabrics = DEFAULT_FABRICS,
}: {
  fabrics?: string[];
}) {
  const pathname = usePathname();
  const { isOpen, close: closeModal } = useWhatsAppPopup();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedUsage, setSelectedUsage] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(
    (reason: "dismiss" | "success") => {
      closeModal();
      if (reason === "dismiss") track("popup_dismiss", { path: pathname, modal: "whatsapp_form" });
    },
    [closeModal, pathname],
  );

  useFocusTrap(panelRef, isOpen, () => close("dismiss"));

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric],
    );
  };

  const toggleUsage = (usage: string) => {
    setSelectedUsage((prev) =>
      prev.includes(usage) ? prev.filter((u) => u !== usage) : [...prev, usage],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!whatsappNumber.trim()) {
      setError("Please enter your WhatsApp number.");
      return;
    }

    setError(null);

    const countryObj = COUNTRY_CODES.find((c) => c.value === countryCode);
    const countryName = countryObj
      ? countryObj.label.replace(/\s*\(\+?\d+\)$/, "").trim()
      : "my country";
    const fabricsText = selectedFabrics.length > 0 ? selectedFabrics.join(", ") : "luxury fabrics";
    const usageText = selectedUsage.length > 0 ? selectedUsage.join(", ") : "trade";

    // Client format: Hi Nabeen, I am *Name* from *country*, I am looking for *Fabrics of interest* for *usage* purposes.
    const message = `Hi Nabeen, I am ${fullName.trim()} from ${countryName}, I am looking for ${fabricsText} for ${usageText} purposes.`;
    const whatsappUrl = `https://wa.me/919819693626?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    // Save lead in background
    const formData = new FormData();
    formData.set("fullName", fullName.trim());
    formData.set("countryCode", countryCode);
    formData.set("whatsappNumber", whatsappNumber.trim());
    selectedFabrics.forEach((f) => formData.append("fabrics", f));
    selectedUsage.forEach((u) => formData.append("usage", u));
    formData.set("message", message);
    formData.set("variant", "short");

    submitEnquiry(IDLE, formData).catch(() => {});
    track("whatsapp_click", { location: "whatsapp_form_modal" });

    close("success");
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            aria-hidden="true"
            onClick={() => close("dismiss")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
            className="absolute inset-0 bg-navy-deep/60 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-modal-title"
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative max-h-[92svh] w-full max-w-[28rem] overflow-y-auto rounded-2xl bg-white p-6 shadow-[var(--shadow-float)] sm:p-8"
          >
            <button
              type="button"
              onClick={() => close("dismiss")}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate transition-colors hover:bg-mist hover:text-navy"
            >
              <span className="visually-hidden">Close</span>
              <X aria-hidden="true" size={20} strokeWidth={1.5} />
            </button>

            <div className="text-center">
              <Image
                src="/images/logos/nabeen-logo-navy.png"
                alt="Nabeen, luxury fabrics by DJI"
                width={1088}
                height={345}
                priority
                className="mx-auto h-7 w-auto"
              />
              <h2 id="whatsapp-modal-title" className="mt-4 text-xl font-bold text-navy sm:text-2xl">
                Enquire on WhatsApp
              </h2>
              <p className="mt-1 text-xs text-slate sm:text-sm">
                Connect directly with our export team with your details pre-filled.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              {error ? (
                <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600">
                  {error}
                </div>
              ) : null}

              <div>
                <label htmlFor="modal-name" className="block text-xs font-semibold text-navy">
                  Full Name <span className="text-accent">*</span>
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition focus:border-navy focus:ring-1 focus:ring-navy"
                />
              </div>

              <div>
                <label htmlFor="modal-number" className="block text-xs font-semibold text-navy">
                  WhatsApp Number <span className="text-accent">*</span>
                </label>
                <div className="mt-1.5 flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="max-w-[130px] shrink-0 rounded-lg border border-line bg-white px-2.5 py-2.5 text-xs outline-none transition focus:border-navy focus:ring-1 focus:ring-navy"
                    aria-label="Country Calling Code"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={`${c.value}-${c.label}`} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    id="modal-number"
                    type="tel"
                    required
                    placeholder="Mobile number"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none transition focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-navy">
                  Fabrics of Interest <span className="text-slate font-normal">(Optional)</span>
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {fabrics.map((fabric) => {
                    const active = selectedFabrics.includes(fabric);
                    return (
                      <button
                        key={fabric}
                        type="button"
                        onClick={() => toggleFabric(fabric)}
                        className={`rounded-md border px-2.5 py-1 text-xs transition-all ${
                          active
                            ? "border-navy bg-navy text-white"
                            : "border-line bg-white text-slate hover:border-slate/60 hover:text-navy"
                        }`}
                      >
                        {fabric}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-navy">
                  Usage <span className="text-slate font-normal">(Optional)</span>
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {USAGE_OPTIONS.map((usage) => {
                    const active = selectedUsage.includes(usage);
                    return (
                      <button
                        key={usage}
                        type="button"
                        onClick={() => toggleUsage(usage)}
                        className={`rounded-md border px-2.5 py-1 text-xs transition-all ${
                          active
                            ? "border-navy bg-navy text-white"
                            : "border-line bg-white text-slate hover:border-slate/60 hover:text-navy"
                        }`}
                      >
                        {usage}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-whatsapp)] py-3 text-sm font-bold tracking-wide text-[var(--color-whatsapp-ink)] shadow-md transition hover:opacity-95 active:scale-[0.99]"
              >
                <WhatsAppGlyph size={18} />
                <span>START WHATSAPP CHAT</span>
              </button>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
