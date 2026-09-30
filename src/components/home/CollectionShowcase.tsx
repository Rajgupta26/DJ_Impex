import { FabricHoverShowcase } from "@/components/about/FabricHoverShowcase";
import { Container } from "@/components/ui/Container";
import { WeaveArt } from "@/components/ui/WeaveArt";
import { getPage } from "@/lib/content";
import { slotMap } from "@/lib/slots";
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
 * The showcase keeps its lead as body text, because it is supporting copy rather
 * than the section title. On the home page, “The Nabeen Collection” provides the
 * visible heading and keeps the collection easy to scan.
 */
export async function CollectionShowcase() {
  const copy = section(getPage("about"), "welcome");
  const slots = await slotMap();
  const names = field(copy, "collection-names")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  return (
    <section className="bg-mist relative isolate">
      <WeaveArt pattern="lace" tone="mist" scale={1.6} intensity={0.1} />

      <Container className="relative pt-2 pb-10 lg:pb-14">
        <h2 className="t-h2 mt-8 text-navy lg:mt-12">The Nabeen Collection</h2>

        <FabricHoverShowcase
          names={names}
          collectionLead={field(copy, "collection-lead")}
          collectionTail={field(copy, "collection-tail")}
          images={slots}
        />
      </Container>
    </section>
  );
}
