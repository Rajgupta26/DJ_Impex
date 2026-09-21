import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TextLink } from "@/components/ui/TextLink";
import { PostCard } from "@/components/journal/PostCard";
import { getPage, getPosts } from "@/lib/content";
import { field, section } from "@/lib/markdown";

/** One large post against two stacked, 7/5. Never three identical cards in a row. */
export function JournalPreview() {
  const journal = section(getPage("home"), "4-the-fabric-journal");
  const [lead, ...rest] = getPosts().slice(0, 3);

  return (
    <section className="bg-mist py-[var(--spacing-section)]">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[40rem]">
            <h2 className="t-h2">{withReg(field(journal, "heading"))}</h2>
            <p className="t-lead mt-5">{withReg(field(journal, "intro"))}</p>
          </div>
          <TextLink href="/journal">Read the journal</TextLink>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
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
