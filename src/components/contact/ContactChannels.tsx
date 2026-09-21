import { Mail, MapPin, Phone } from "lucide-react";

import { TbcTag } from "@/components/ui/TbcTag";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { getSite } from "@/lib/content";
import { directionsLink, mailtoLink, telLink, whatsappLink } from "@/lib/contact";

/** Every way to reach the team, WhatsApp first. */
export function ContactChannels() {
  const { contact } = getSite();

  return (
    <div className="grid gap-8">
      <TrackedLink
        href={whatsappLink()}
        event="whatsapp_click"
        location="contact_page"
        className="btn btn-primary w-fit"
      >
        <WhatsAppGlyph size={20} />
        <span>Enquire on WhatsApp</span>
      </TrackedLink>

      <dl className="grid gap-7">
        <div className="flex gap-4 border-t border-line pt-7">
          <Phone aria-hidden="true" size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-slate" />
          <div>
            <dt className="t-small font-semibold">Phone</dt>
            <dd className="mt-1">
              <TrackedLink
                href={telLink()}
                event="call_click"
                location="contact_page"
                external={false}
                className="text-link"
              >
                {contact.phonePrimary.display}
              </TrackedLink>
              <TbcTag status={contact.phonePrimary.status} note={contact.phonePrimary.note} />
            </dd>
          </div>
        </div>

        <div className="flex gap-4 border-t border-line pt-7">
          <Mail aria-hidden="true" size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-slate" />
          <div>
            <dt className="t-small font-semibold">Email</dt>
            <dd className="mt-1">
              <TrackedLink
                href={mailtoLink("Fabric enquiry")}
                event="email_click"
                location="contact_page"
                external={false}
                className="text-link"
              >
                {contact.emailPrimary.value}
              </TrackedLink>
            </dd>
          </div>
        </div>

        <div className="flex gap-4 border-t border-line pt-7">
          <MapPin aria-hidden="true" size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-slate" />
          <div>
            <dt className="t-small font-semibold">Visit</dt>
            <dd className="mt-1">
              <address className="not-italic text-slate">
                {contact.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <TrackedLink
                href={directionsLink()}
                event="directions_click"
                location="contact_page"
                className="mt-3 inline-block text-link"
              >
                Get directions
              </TrackedLink>
              <TbcTag status={contact.address.status} note={contact.address.note} />
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
