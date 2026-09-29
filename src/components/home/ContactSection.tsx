import { ExternalLink, MapPin } from "lucide-react";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { Container } from "@/components/ui/Container";
import { getSite } from "@/lib/content";
import { whatsappLink } from "@/lib/contact";

const MAPS_PLACE_URL =
  "https://www.google.com/maps/place/D+J+Impex+%26+Co.+(DJI)/@18.9481781,72.8319929,17z/data=!4m6!3m5!1s0x3be7cfd0a3ffc597:0x746cc6b47455ff2c!8m2!3d18.9481781!4d72.8319929!16s%2Fg%2F11f61wcms2";
const MAPS_EMBED_URL = "https://maps.google.com/maps?q=18.9481781,72.8319929&hl=en&z=16&output=embed";

/**
 * The exact contact section from /contact, situated on the home page directly before the footer.
 */
export function ContactSection() {
  const site = getSite();

  return (
    <section id="contact" className="scroll-mt-20 lg:scroll-mt-24 border-t border-line bg-white pt-[var(--spacing-section)] pb-8 sm:pb-12">
      <Container>
        <div className="grid min-w-0 gap-16 lg:grid-cols-[5fr_7fr] lg:gap-20 items-start">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="min-w-0 rounded-2xl bg-navy text-white on-dark p-6 sm:p-7 shadow-lg">
              <h2 className="t-h3 text-white">Talk to us directly</h2>
              <div className="mt-5 sm:mt-6">
                <ContactChannels onDark={true} />
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="t-h3 text-navy">find nabeen</h3>
              <p className="mt-1 text-sm text-slate">Visit us at our location below.</p>
              <a
                href={MAPS_PLACE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-3 block h-[162px] w-full min-w-0 overflow-hidden rounded-2xl border border-line bg-sand/30 shadow-sm transition-all duration-300 hover:shadow-md"
                aria-label="Open company location in Google Maps (opens in a new tab)"
              >
                <iframe
                  title="D J Impex & Co. location map"
                  src={MAPS_EMBED_URL}
                  className="pointer-events-none absolute -top-[48px] -left-[30px] h-[calc(100%+96px)] w-[calc(100%+60px)] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-navy/90 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm transition-colors group-hover:bg-navy">
                  <MapPin size={13} className="text-accent" />
                  <span>Open in Maps</span>
                  <ExternalLink size={12} className="text-white/70" />
                </div>
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="t-h3">Send an enquiry</h2>
            <EnquiryForm
              variant="full"
              fabrics={site.fabricTypes.items.map(({ slug, name }) => ({ slug, name }))}
              whatsappHref={whatsappLink()}
              className="mt-8"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
