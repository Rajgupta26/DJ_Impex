import { Mail, Phone } from "lucide-react";

import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WeaveArt } from "@/components/ui/WeaveArt";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { getPage, getSite } from "@/lib/content";
import { mailtoLink, telLink, whatsappLink } from "@/lib/contact";
import { field, section } from "@/lib/markdown";

/**
 * The foot of the home page: the enquiry, asked for where the reader has just
 * finished looking at the cloth.
 *
 * Paper on cloth. The ground is the house weave drawn in navy, and the form sits
 * on a white panel over it with a thread of gold along its top edge. That keeps
 * the form itself on the white it was designed for -- its labels, hints and
 * validation states are all tuned for a light ground -- while the section still
 * reads as the dark band that carries the page into the footer.
 *
 * It is the same EnquiryForm as /contact, in the same full variant, posting
 * through the same Server Action. There is one enquiry, not two.
 */
export function EnquirySection() {
  const site = getSite();
  const home = getPage("home");
  const copy = section(home, "enquiry");

  // No overflow-hidden on the section, however much it looks like it wants one:
  // it would make the section a scroll container and the sticky column inside it
  // would stop sticking. WeaveArt already clips itself.
  return (
    <section className="relative isolate bg-navy text-white">
      <WeaveArt pattern="ogee" scale={1.3} />

      <Container className="relative py-[clamp(3rem,2rem+2.6vw,4.5rem)]">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {/* Both columns start at the top and read straight down. The form is set
              two fields to a row so that it is close to the height of the words
              beside it; pushing these to a far-off foot, or making them travel
              with the scroll, were both worse answers to the same gap. */}
          <div className="on-dark lg:pr-6">
            <p className="t-small font-semibold text-zari">{field(copy, "eyebrow")}</p>
            <h2 className="t-h2 mt-4 max-w-[15ch]">{withReg(field(copy, "heading"))}</h2>
            <p className="measure mt-6 text-white/75">{withReg(field(copy, "intro"))}</p>

            <TrackedLink
              href={whatsappLink()}
              event="whatsapp_click"
              location="home_enquiry"
              className="btn btn-ghost mt-10 w-fit"
            >
              <WhatsAppGlyph size={20} />
              <span>Enquire on WhatsApp</span>
            </TrackedLink>

            {/* The two other ways through, for anyone who would rather not use
                WhatsApp. Hairline rules rather than boxes: this is a list, not a
                row of cards. */}
            <dl className="mt-10 grid gap-6 lg:mt-14">
              <div className="flex gap-4 border-t border-white/20 pt-6">
                <Phone
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.5}
                  className="mt-1 shrink-0 text-white/55"
                />
                <div>
                  <dt className="t-small font-semibold">Phone</dt>
                  <dd className="mt-1">
                    <TrackedLink
                      href={telLink()}
                      event="call_click"
                      location="home_enquiry"
                      external={false}
                      className="text-link text-link-on-dark"
                    >
                      {site.contact.phonePrimary.display}
                    </TrackedLink>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4 border-t border-white/20 pt-6">
                <Mail
                  aria-hidden="true"
                  size={18}
                  strokeWidth={1.5}
                  className="mt-1 shrink-0 text-white/55"
                />
                <div>
                  <dt className="t-small font-semibold">Email</dt>
                  <dd className="mt-1">
                    <TrackedLink
                      href={mailtoLink("Fabric enquiry")}
                      event="email_click"
                      location="home_enquiry"
                      external={false}
                      className="text-link text-link-on-dark"
                    >
                      {site.contact.emailPrimary.value}
                    </TrackedLink>
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="relative bg-white p-[clamp(1.5rem,1rem+1.4vw,2.25rem)] text-navy">
            {/* A thread of gold at the corner rather than a rule across the whole
                edge. The accent is meant to be thread-thin in both directions. */}
            <span aria-hidden="true" className="absolute left-0 top-0 h-px w-24 bg-zari" />
            <h3 className="t-h3">{field(copy, "form-heading")}</h3>
            <EnquiryForm
              variant="full"
              paired
              fabrics={site.fabricTypes.items.map(({ slug, name }) => ({ slug, name }))}
              whatsappHref={whatsappLink()}
              className="mt-6"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
