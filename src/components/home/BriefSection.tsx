import { Container } from "@/components/ui/Container";
import { TrustMarks } from "@/components/ui/TrustMarks";
import { getPage, getSite } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { BriefAnimated } from "@/components/home/BriefAnimated";

/**
 * The company in two paragraphs, set 7/5 against the trust marks, with a single
 * archive swatch to break the column. Asymmetric on purpose: rows of equal
 * columns are what make a site look templated.
 */
export function BriefSection() {
  const site = getSite();
  const brief = section(getPage("home"), "3-short-brief");
  const linkLabel = field(brief, "link").split("→")[0].replace(/"/g, "").trim();

  return (
    <section className="bg-white py-[var(--spacing-section)]">
      <Container>
        <BriefAnimated
          title={`A house of cloth since ${site.brand.founded.value}`}
          paragraphs={brief.paragraphs}
          linkLabel={linkLabel}
          trustMarksSlot={<TrustMarks className="mt-auto pt-14" />}
        />
      </Container>
    </section>
  );
}
