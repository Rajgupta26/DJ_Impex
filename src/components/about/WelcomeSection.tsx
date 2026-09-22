import { Mail, Phone } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { WeaveArt } from "@/components/ui/WeaveArt";
import { getPage } from "@/lib/content";
import { mailtoLink, telLink } from "@/lib/contact";
import { field, section } from "@/lib/markdown";

/**
 * The client's welcome, set rather than poured.
 *
 * It arrived as one 200-word block, which is how the prototype ran it and which
 * nobody reads. The sentence that carries the most is the list of seven cloths,
 * so that sentence is broken open: the lead-in, then the names set large down a
 * ruled column, then the tail. Everything else stays in the client's order and
 * the client's words.
 *
 * Light, not dark. It was on the deepest navy, directly under a hero that is
 * itself navy behind its photograph, and the two ran together into one dark mass
 * with no edge between them. On mist it is a clear step down from the hero, and
 * the seven cloths read better in navy than in white.
 *
 * The heading is "Welcome" rather than the client's full "Welcome to D J Impex &
 * Co.", because the page's h1 four inches above already says the company's name.
 * Their full line is still in about.md if they want it back.
 */
export function WelcomeSection() {
  const copy = section(getPage("about"), "welcome");
  const names = field(copy, "collection-names")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  return (
    <section className="relative isolate bg-mist">
      <WeaveArt pattern="lace" tone="mist" scale={1.6} intensity={0.1} />

      <Container className="relative py-[var(--spacing-section)]">
        <h2 className="t-h2">Welcome</h2>
        <p className="t-lead mt-6 max-w-[42rem]">{withReg(field(copy, "lead"))}</p>

        <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {/* The seven cloths, taken out of the sentence and given the room they
              were always asking for. Hairlines rather than boxes. */}
          <div>
            <p className="text-slate">{field(copy, "collection-lead")}</p>
            <ul className="mt-5">
              {names.map((name) => (
                <li
                  key={name}
                  className="t-h3 border-t border-line py-3.5 text-[clamp(1.1rem,0.95rem+0.7vw,1.5rem)] font-light text-navy"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-6 text-slate">
              {field(copy, "collection-tail")}
            </p>
          </div>

          <div className="lg:pt-1">
            <div className="grid gap-6">
              <p className="measure text-slate">{withReg(field(copy, "craft"))}</p>
              <p className="measure text-slate">{withReg(field(copy, "invitation"))}</p>
            </div>

            {/* The prototype put Call us and Mail us right here, and they belong
                here: this is the page's warmest moment. */}
            <div className="mt-10 flex flex-wrap gap-4">
              <TrackedLink
                href={telLink()}
                event="call_click"
                location="about_welcome"
                external={false}
                className="btn btn-primary"
              >
                <Phone aria-hidden="true" size={18} strokeWidth={1.6} />
                <span>Call us</span>
              </TrackedLink>
              <TrackedLink
                href={mailtoLink("Fabric enquiry")}
                event="email_click"
                location="about_welcome"
                external={false}
                className="btn btn-outline"
              >
                <Mail aria-hidden="true" size={18} strokeWidth={1.6} />
                <span>Mail us</span>
              </TrackedLink>
            </div>

            {/* The sign-off, kept as its own line with a thread of gold, because
                that is what it is: a signature, not a sentence in a paragraph.
                Gold as a rule, never as text: it fails AA on a light ground. */}
            <p className="t-small mt-12 inline-block border-t border-zari pt-4 font-semibold tracking-[0.02em] text-navy">
              {field(copy, "closing")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
