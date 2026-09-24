import { Mail, MapPin, Phone } from "lucide-react";

import { TbcTag } from "@/components/ui/TbcTag";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { getSite } from "@/lib/content";
import { directionsLink, mailtoLink, telLink, whatsappLink } from "@/lib/contact";

/** Every way to reach the team, WhatsApp first. */
export function ContactChannels({ onDark = true }: { onDark?: boolean } = {}) {
  const { contact } = getSite();

  return (
    <div className="grid gap-8">
      <TrackedLink
        href={whatsappLink()}
        event="whatsapp_click"
        location="contact_page"
        className={onDark ? "btn btn-on-dark w-fit" : "btn btn-primary w-fit"}
      >
        <WhatsAppGlyph size={20} />
        <span>Enquire on WhatsApp</span>
      </TrackedLink>

      <dl className="grid gap-7">
        <div className={`flex gap-4 border-t pt-7 ${onDark ? "border-white/15" : "border-line"}`}>
          <Phone
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className={`mt-1 shrink-0 ${onDark ? "text-accent" : "text-slate"}`}
          />
          <div>
            <dt className={`t-small font-semibold ${onDark ? "text-white/80" : ""}`}>Phone</dt>
            <dd className="mt-1">
              <TrackedLink
                href={telLink()}
                event="call_click"
                location="contact_page"
                external={false}
                className={`text-link ${onDark ? "text-link-on-dark" : ""}`}
              >
                {contact.phonePrimary.display}
              </TrackedLink>
              <TbcTag status={contact.phonePrimary.status} note={contact.phonePrimary.note} />
            </dd>
          </div>
        </div>

        <div className={`flex gap-4 border-t pt-7 ${onDark ? "border-white/15" : "border-line"}`}>
          <Mail
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className={`mt-1 shrink-0 ${onDark ? "text-accent" : "text-slate"}`}
          />
          <div>
            <dt className={`t-small font-semibold ${onDark ? "text-white/80" : ""}`}>Email</dt>
            <dd className="mt-1">
              <span className="grid gap-1">
                {[contact.emailPrimary.value, contact.emailAdmin.value, contact.emailSecondary.value].map((email) => (
                  <TrackedLink
                    key={email}
                    href={`mailto:${email}?subject=${encodeURIComponent("Fabric enquiry")}`}
                    event="email_click"
                    location="contact_page"
                    external={false}
                    className={`text-link w-fit ${onDark ? "text-link-on-dark" : ""}`}
                  >
                    {email}
                  </TrackedLink>
                ))}
              </span>
            </dd>
          </div>
        </div>

        <div className={`flex gap-4 border-t pt-7 ${onDark ? "border-white/15" : "border-line"}`}>
          <MapPin
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className={`mt-1 shrink-0 ${onDark ? "text-accent" : "text-slate"}`}
          />
          <div>
            <dt className={`t-small font-semibold ${onDark ? "text-white/80" : ""}`}>Head Office</dt>
            <dd className="mt-1">
              <TrackedLink
                href={directionsLink()}
                event="directions_click"
                location="contact_page"
                className={`block w-fit transition-opacity hover:opacity-80 ${onDark ? "text-white" : "text-slate"}`}
                aria-label="Open Head Office directions in Google Maps"
              >
                <address className="not-italic">
                  {contact.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </TrackedLink>
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
