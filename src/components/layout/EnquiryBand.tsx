import { Container } from "@/components/ui/Container";
import { Reg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { whatsappLink } from "@/lib/contact";

/**
 * The same closing band on every inner page (Contact excepted, which is the
 * band's destination).
 */
export function EnquiryBand({ prefill }: { prefill?: string }) {
  return (
    <section className="on-dark bg-navy py-[clamp(4rem,2.5rem+5vw,7rem)] text-white">
      <Container className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <h2 className="t-h2 max-w-[16ch]">
            Talk to the Nabeen
            <Reg /> team
          </h2>
          <p className="t-lead mt-5 max-w-[34rem] text-white/75">
            Tell us which fabrics you trade in, your market and the quantities you need.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 md:justify-end">
          <TrackedLink
            href={whatsappLink(prefill)}
            event="whatsapp_click"
            location="enquiry_band"
            className="btn btn-on-dark"
          >
            <WhatsAppGlyph size={20} />
            <span>Enquire on WhatsApp</span>
          </TrackedLink>
          <ButtonLink href="/#contact" variant="ghost">
            Contact us
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
