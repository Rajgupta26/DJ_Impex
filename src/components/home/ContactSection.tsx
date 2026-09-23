import { ContactChannels } from "@/components/contact/ContactChannels";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { Container } from "@/components/ui/Container";
import { getSite } from "@/lib/content";
import { whatsappLink } from "@/lib/contact";

/**
 * The exact contact section from /contact, situated on the home page directly before the footer.
 */
export function ContactSection() {
  const site = getSite();

  return (
    <section id="contact" className="page-end scroll-mt-20 lg:scroll-mt-24 border-t border-line bg-white py-[var(--spacing-section)]">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[5fr_7fr] lg:gap-20 items-start">
          <div className="rounded-2xl bg-navy text-white on-dark p-8 lg:p-10 shadow-lg">
            <h2 className="t-h3 text-white">Talk to us directly</h2>
            <div className="mt-8">
              <ContactChannels onDark={true} />
            </div>
          </div>

          <div>
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
