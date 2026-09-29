"use client";

import { useWhatsAppPopup } from "@/components/layout/OverlayContext";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { track } from "@/lib/analytics";

export function WhatsAppEnquiryButton({
  className = "",
  location = "contact_page",
  label = "Enquire on WhatsApp",
}: {
  className?: string;
  location?: string;
  label?: string;
}) {
  const { open } = useWhatsAppPopup();

  return (
    <button
      type="button"
      onClick={() => {
        track("whatsapp_click", { location });
        open();
      }}
      className={className}
    >
      <WhatsAppGlyph size={20} />
      <span>{label}</span>
    </button>
  );
}
