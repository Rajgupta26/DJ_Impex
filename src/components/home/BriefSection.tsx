import { Container } from "@/components/ui/Container";
import { getPage, getSite } from "@/lib/content";
import { field, section } from "@/lib/markdown";
import { BriefAnimated } from "@/components/home/BriefAnimated";
import { slotMap } from "@/lib/slots";
import { StatBoxes } from "@/components/home/StatBoxes";

export async function BriefSection() {
  const site = getSite();
  const slot = (await slotMap())["home-brief"];
  const brief = section(getPage("home"), "3-short-brief");
  const linkLabel = field(brief, "link").split("→")[0].replace(/"/g, "").trim();

  return (
    /* The hero above is full height and ends on a hard edge, so this does not
       need a full --spacing-section on top of it: at 1130 that was 127px of
       white before the heading. 64/80px instead. */
    <section className="overflow-hidden bg-white pt-16 lg:pt-20">
      <Container>
        <BriefAnimated
          title={`A house of cloth since ${site.brand.founded.value}`}
          paragraphs={brief.paragraphs}
          linkLabel={linkLabel}
          imageSrc={slot.src}
          imageAlt={slot.alt}
        />
      </Container>

      {/* Full screen width 4-box stat section */}
      <div className="mt-12 w-full lg:mt-16">
        <StatBoxes />
      </div>
    </section>
  );
}
