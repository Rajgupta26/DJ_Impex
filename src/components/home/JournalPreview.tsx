import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { PostCard } from "@/components/journal/PostCard";
import { getPage, getPosts } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/** One large post against two stacked, 7/5. Never three identical cards in a row. */
export function JournalPreview() {
  const journal = section(getPage("home"), "4-the-fabric-journal");
  const [lead, ...rest] = getPosts().slice(0, 3);

  return (
    <section
      id="journal"
      className="scroll-mt-[4.5rem] bg-mist pb-[var(--spacing-section)] pt-10 lg:scroll-mt-[5.25rem] lg:pt-14"
    >
      <Container>
        <div className="max-w-[40rem]">
          <h2 className="t-h2">{withReg(field(journal, "heading"))}</h2>
          <p className="t-lead mt-4 lg:mt-5">{withReg(field(journal, "intro"))}</p>
        </div>

        <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <PostCard post={lead} size="large" />
          <div className="grid content-start gap-12">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
