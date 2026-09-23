import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TbcTag } from "@/components/ui/TbcTag";
import { getPage, getSite } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/**
 * Our exclusive collection of — the range, on the home page.
 *
 * The heading is deliberately unfinished. The agency wrote it that way on
 * 2026-09-23: it runs on into the fabric names below it as one sentence, which
 * is why the names are set at heading weight rather than as a caption, and why
 * nothing punctuates the end of the heading. Do not add a noun to it.
 *
 * `fabricTypes` is marked tbc in site.json, so the block carries the dev-only
 * TBC tag: the structure and the one-line descriptions are both proposed and
 * still need the client's word. The Fabric Journal used to stand here and is at
 * /journal now.
 */
export function FabricCollection() {
  const site = getSite();
  const collection = section(getPage("home"), "4-our-exclusive-collection");
  const fabrics = site.fabricTypes;

  return (
    <section className="bg-mist py-10 lg:py-14">
      <Container>
        <h2 className="t-h2 max-w-[20ch]">
          {withReg(field(collection, "heading"))}
          <TbcTag status={fabrics.status} note={fabrics._note} />
        </h2>

        <ul className="mt-10 grid gap-x-16 gap-y-9 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-y-11">
          {fabrics.items.map((fabric) => (
            <li key={fabric.slug} className="border-t border-line pt-5">
              <h3 className="t-h3 font-light [font-stretch:80%]">{withReg(fabric.name)}</h3>
              <p className="t-small mt-2 max-w-[24rem] text-slate">{withReg(fabric.line)}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
