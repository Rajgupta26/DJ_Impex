import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { JournalAnimated } from "@/components/home/JournalAnimated";
import { getPage, getPosts } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/** One large post against two stacked, 7/5. Never three identical cards in a row. */
export function JournalPreview() {
  const journal = section(getPage("home"), "4-the-fabric-journal");
  const [lead, ...rest] = getPosts().slice(0, 3);

  return (
    /* The testimonials band below carries a mist-coloured wave divider on its
       top edge, which adds its own height of ground under this section. A full
       --spacing-section here on top of that reads as an empty band, so the
       padding matches the section's own top instead. */
    <section
      id="journal"
      className="scroll-mt-[4.5rem] bg-mist py-10 lg:scroll-mt-[5.25rem] lg:py-14"
    >
      <Container>
        <div className="max-w-[40rem]">
          <h2 className="t-h2">{withReg(field(journal, "heading"))}</h2>
          <p className="t-lead mt-4 lg:mt-5">{withReg(field(journal, "intro"))}</p>
        </div>

        <JournalAnimated lead={lead} rest={rest} />
      </Container>
    </section>
  );
}
