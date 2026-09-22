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
 * Ground is the deepest navy with the lace drawn across it, because the hero
 * above is a photograph and the section below is white: this is the page's one
 * dark, quiet moment.
 */
export function WelcomeSection() {
  const copy = section(getPage("about"), "welcome");
  const names = field(copy, "collection-names")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  return (
    <section className="on-dark relative isolate bg-navy-deep text-white">
      {/* Lower than the default 0.26: the lace tile is a busy motif and this
          section is 200 words of the client's writing, not a display panel. */}
      <WeaveArt pattern="lace" scale={1.6} intensity={0.14} />

      <Container className="relative py-[var(--spacing-section)]">
        <p className="t-small font-semibold text-zari">{field(copy, "eyebrow")}</p>
        <h2 className="t-h2 mt-4 max-w-[24ch] text-balance text-[clamp(2rem,1.4rem+2.2vw,3.25rem)]">
          {withReg(field(copy, "heading"))}
        </h2>
        <p className="t-lead mt-8 max-w-[42rem] text-white/85">
          {withReg(field(copy, "lead"))}
        </p>

        <div className="mt-16 grid gap-14 lg:mt-20 lg:grid-cols-[5fr_7fr] lg:gap-20">
          {/* The seven cloths, taken out of the sentence and given the room they
              were always asking for. Hairlines rather than boxes. */}
          <div>
            <p className="text-white/70">{field(copy, "collection-lead")}</p>
            <ul className="mt-5">
              {names.map((name) => (
                <li
                  key={name}
                  className="t-h3 border-t border-white/15 py-3.5 text-[clamp(1.1rem,0.95rem+0.7vw,1.5rem)] font-light"
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-white/15 pt-6 text-white/70">
              {field(copy, "collection-tail")}
            </p>
          </div>

          <div className="lg:pt-1">
            <div className="grid gap-6">
              <p className="measure text-white/75">{withReg(field(copy, "craft"))}</p>
              <p className="measure text-white/75">{withReg(field(copy, "invitation"))}</p>
            </div>

            {/* The prototype put Call us and Mail us right here, and they belong
                here: this is the page's warmest moment. */}
            <div className="mt-10 flex flex-wrap gap-4">
              <TrackedLink
                href={telLink()}
                event="call_click"
                location="about_welcome"
                external={false}
                className="btn btn-ghost"
              >
                <Phone aria-hidden="true" size={18} strokeWidth={1.6} />
                <span>Call us</span>
              </TrackedLink>
              <TrackedLink
                href={mailtoLink("Fabric enquiry")}
                event="email_click"
                location="about_welcome"
                external={false}
                className="btn btn-ghost"
              >
                <Mail aria-hidden="true" size={18} strokeWidth={1.6} />
                <span>Mail us</span>
              </TrackedLink>
            </div>

            {/* The sign-off, kept as its own line with a thread of gold, because
                that is what it is: a signature, not a sentence in a paragraph. */}
            <p className="t-small mt-12 inline-block border-t border-zari pt-4 font-semibold tracking-[0.02em] text-white/80">
              {field(copy, "closing")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
