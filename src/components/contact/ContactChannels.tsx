import { Mail, MapPin, Phone } from "lucide-react";

import { TbcTag } from "@/components/ui/TbcTag";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { getSite } from "@/lib/content";
import { directionsLink, mailtoLink, telLink } from "@/lib/contact";

/** Every way to reach the team. */
export function ContactChannels({ onDark = true }: { onDark?: boolean } = {}) {
  const { contact } = getSite();

  return (
    <div className="grid gap-5">
      <dl className="grid gap-5">
        <div className="flex gap-4">
          <Phone
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className={`mt-1 shrink-0 ${onDark ? "text-accent" : "text-slate"}`}
          />
          <div className="min-w-0 flex-1">
            <dt className={`t-small font-semibold ${onDark ? "text-white/80" : ""}`}>Phone</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-x-2">
              <TrackedLink
                href={telLink()}
                event="call_click"
                location="contact_page"

                className={`text-link ${onDark ? "text-link-on-dark" : ""}`}
              >
                {contact.phonePrimary.display}
              </TrackedLink>
              <TbcTag status={contact.phonePrimary.status} note={contact.phonePrimary.note} />
              <span className={onDark ? "text-white/40" : "text-slate/40"} aria-hidden="true">
                /
              </span>
              <TrackedLink
                href={`tel:${contact.phoneSecondary.e164}`}
                event="call_click"
                location="contact_page"

                className={`text-link ${onDark ? "text-link-on-dark" : ""}`}
              >
                {contact.phoneSecondary.display}
              </TrackedLink>
            </dd>
          </div>
        </div>

        <div className={`flex gap-4 border-t pt-5 ${onDark ? "border-white/15" : "border-line"}`}>
          <Mail
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className={`mt-1 shrink-0 ${onDark ? "text-accent" : "text-slate"}`}
          />
          <div className="min-w-0 flex-1">
            <dt className={`t-small font-semibold ${onDark ? "text-white/80" : ""}`}>Email</dt>
            <dd className="mt-1">
              <span className="grid gap-1">
                {[contact.emailPrimary.value, contact.emailAdmin.value, contact.emailSecondary.value].map(
                  (email) => (
                    <TrackedLink
                      key={email}
                      href={mailtoLink("Fabric enquiry", email)}
                      event="email_click"
                      location="contact_page"

                      className={`text-link w-fit max-w-full break-words ${onDark ? "text-link-on-dark" : ""}`}
                    >
                      {email}
                    </TrackedLink>
                  ),
                )}
              </span>
            </dd>
          </div>
        </div>

        <div className={`flex gap-4 border-t pt-5 ${onDark ? "border-white/15" : "border-line"}`}>
          <MapPin
            aria-hidden="true"
            size={18}
            strokeWidth={1.5}
            className={`mt-1 shrink-0 ${onDark ? "text-accent" : "text-slate"}`}
          />
          <div className="min-w-0 flex-1">
            <dt className={`t-small font-semibold ${onDark ? "text-white/80" : ""}`}>Address</dt>
            <dd className="mt-1">
              <TrackedLink
                href={directionsLink()}
                event="directions_click"
                location="contact_page"
                className={`text-link block ${onDark ? "text-link-on-dark" : ""}`}
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
