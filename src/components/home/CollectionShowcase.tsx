import { FabricHoverShowcase } from "@/components/about/FabricHoverShowcase";
import { Container } from "@/components/ui/Container";
import { WeaveArt } from "@/components/ui/WeaveArt";
import { getPage } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/**
 * The collection, on the home page: the same hover showcase that runs on /about,
 * placed here on the agency's instruction (2026-09-23) in the slot the fabric
 * journal used to hold.
 *
 * It reads the same three fields from about.md that /about reads -- the lead,
 * the eight names and the tail -- rather than taking a copy into home.md. They
 * are one sentence ("Our exclusive collection of ... fabrics embodies the
 * highest standards of quality ..."), and the site already has three different
 * fabric lists in three places (questions 119 and 134). A fourth, kept in step
 * by hand, was not worth it.
 *
 * The showcase sets its lead as body text, not a heading, because on /about the
 * "Welcome" heading sits above it. Here there is nothing above it, so the
 * section carries a heading for the outline and hides it: putting "Our exclusive
 * collection of" on screen twice, once as a heading and again as the showcase's
 * own first line, would read as a mistake.
 */
export function CollectionShowcase() {
  const copy = section(getPage("about"), "welcome");
  const names = field(copy, "collection-names")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  return (
    <section className="relative isolate bg-mist">
      <WeaveArt pattern="lace" tone="mist" scale={1.6} intensity={0.1} />

      {/* The showcase opens with its own mt-16, so this pays almost nothing at
          the top. */}
      <Container className="relative pb-10 pt-2 lg:pb-14">
        <h2 className="visually-hidden">Our exclusive collection</h2>

        <FabricHoverShowcase
          names={names}
          collectionLead={field(copy, "collection-lead")}
          collectionTail={field(copy, "collection-tail")}
        />
      </Container>
    </section>
  );
}
