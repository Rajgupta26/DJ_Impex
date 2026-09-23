import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { WeaveArt } from "@/components/ui/WeaveArt";
import { getPage } from "@/lib/content";
import { mailtoLink, telLink } from "@/lib/contact";
import { field, section } from "@/lib/markdown";
import { FabricHoverShowcase } from "@/components/about/FabricHoverShowcase";

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

        <FabricHoverShowcase
          names={names}
          collectionLead={field(copy, "collection-lead")}
          collectionTail={field(copy, "collection-tail")}
        />
      </Container>
    </section>
  );
}
