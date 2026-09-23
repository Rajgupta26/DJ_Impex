import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { WeaveArt } from "@/components/ui/WeaveArt";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/**
 * The client's welcome.
 *
 * The collection sentence used to be broken open here into the hover showcase --
 * the lead-in, the names down a ruled column, the tail. That showcase moved to
 * the home page on 2026-09-23 and was cut from this page the same day, so the
 * two would not carry the same block. The copy for it is still in about.md, and
 * the home page reads it from there; `Craft` in that file has never been
 * rendered anywhere. See 05-open-questions 137.
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

  return (
    <section className="relative isolate bg-mist">
      <WeaveArt pattern="lace" tone="mist" scale={1.6} intensity={0.1} />

      <Container className="relative py-[var(--spacing-section)]">
        <h2 className="t-h2">Welcome</h2>
        <p className="t-lead mt-6 max-w-[42rem]">{withReg(field(copy, "lead"))}</p>
      </Container>
    </section>
  );
}
