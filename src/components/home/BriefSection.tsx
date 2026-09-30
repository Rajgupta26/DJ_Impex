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
  const heading = field(brief, "heading") || "MORE THAN A FABRIC | A SIGNATURE OF DISTINCTION.";
  const linkLabel = field(brief, "link").split("→")[0].replace(/"/g, "").trim() || "Discover our story";
  const tagline = brief.fields["tagline"] || "Crafted In India · Chosen Across Africa";

  return (
    /* The hero above is full height and ends on a hard edge, so this does not
       need a full --spacing-section on top of it: at 1130 that was 127px of
       white before the heading. 64/80px instead. */
    <section className="overflow-hidden bg-white pt-10 sm:pt-14 lg:pt-20">
      <Container>
        <BriefAnimated
          title={heading}
          tagline={tagline}
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
