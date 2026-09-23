import { Container } from "@/components/ui/Container";
import { getPage, getSite } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { BriefAnimated } from "@/components/home/BriefAnimated";
import { StatBoxes } from "@/components/home/StatBoxes";

export function BriefSection() {
  const site = getSite();
  const brief = section(getPage("home"), "3-short-brief");
  const linkLabel = field(brief, "link").split("→")[0].replace(/"/g, "").trim();

  return (
    <section className="overflow-hidden bg-white pt-[var(--spacing-section)]">
      <Container>
        <BriefAnimated
          title={`A house of cloth since ${site.brand.founded.value}`}
          paragraphs={brief.paragraphs}
          linkLabel={linkLabel}
        />
      </Container>

      {/* Full screen width 4-box stat section */}
      <div className="mt-16 w-full lg:mt-24">
        <StatBoxes />
      </div>
    </section>
  );
}
