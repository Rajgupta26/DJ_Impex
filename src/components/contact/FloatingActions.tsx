"use client";

import { MapPin } from "lucide-react";

import { useAnyOverlayOpen } from "@/components/layout/OverlayContext";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { track } from "@/lib/analytics";

/**
 * On every page: WhatsApp above Directions, bottom-right, clear of the iOS home
 * indicator. They step aside while the menu or the popup is open so they never
 * float over a dialog.
 */
export function FloatingActions({
  whatsappHref,
  directionsHref,
}: {
  whatsappHref: string;
  directionsHref: string;
}) {
  const overlayOpen = useAnyOverlayOpen();

  return (
    <div
      aria-hidden={overlayOpen}
      className={`fixed right-4 z-30 grid gap-3 transition-opacity duration-[var(--duration-base)] ${
        overlayOpen ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <FloatingAction
        href={whatsappHref}
        label="Enquire on WhatsApp"
        tone="navy"
        onClick={() => track("whatsapp_click", { location: "floating" })}
        disabled={overlayOpen}
      >
        <WhatsAppGlyph size={24} />
      </FloatingAction>

      <FloatingAction
        href={directionsHref}
        label="Get directions to our Mumbai office"
        tone="white"
        onClick={() => track("directions_click", { location: "floating" })}
        disabled={overlayOpen}
      >
        <MapPin aria-hidden="true" size={22} strokeWidth={1.5} />
      </FloatingAction>
    </div>
  );
}

function FloatingAction({
  href,
  label,
  tone,
  onClick,
  disabled,
  children,
}: {
  href: string;
  label: string;
  tone: "navy" | "white";
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={onClick}
      tabIndex={disabled ? -1 : undefined}
      className={`group relative flex h-14 w-14 items-center justify-center rounded-[var(--radius-pill)] shadow-[var(--shadow-float)] transition-transform duration-[var(--duration-quick)] hover:-translate-y-0.5 ${
        tone === "navy" ? "bg-navy text-white" : "border border-line bg-white text-navy"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className="t-small pointer-events-none absolute right-[calc(100%+0.75rem)] hidden whitespace-nowrap bg-navy-deep px-3 py-1.5 font-semibold text-white opacity-0 transition-opacity duration-[var(--duration-quick)] group-hover:opacity-100 lg:block"
      >
        {label}
      </span>
    </a>
  );
}
