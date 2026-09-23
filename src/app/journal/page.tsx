import type { Metadata } from "next";

import { PostCard } from "@/components/journal/PostCard";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getPosts } from "@/lib/content";
import { buildMetadata, pageTitle } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: pageTitle("The Fabric Journal"),
  description:
    "Guides to choosing, judging and wearing fine fabric: Swiss lace, men's lace in Nigeria, and how to tell a premium weave from an ordinary one.",
  path: "/journal",
});

/**
 * The Fabric Journal index.
 *
 * It was deleted on 2026-09-22 when the journal moved to a section on the home
 * page, and restored on 2026-09-23 when the agency took that section back for
 * the collection. The journal is only here now, and the nav points at /journal
 * rather than /#journal.
 *
 * The newest post runs across the page; the rest sit in a grid under a rule.
 * The earlier version of this page repeated the lead post's opening paragraph as
 * a hard-coded string, truncated mid-word with an ellipsis. `PostCard` already
 * takes the excerpt from the post's own front matter, so that is gone.
 */
export default function JournalPage() {
  const [lead, ...rest] = getPosts();

  return (
    <>
      <PageHero
        title="The Fabric Journal"
        strapline="Guides to choosing, judging and wearing fine fabric."
        pattern="check"
      />

      <section className="page-end bg-white pt-[var(--spacing-section)]">
        <Container>
          <PostCard post={lead} size="large" layout="horizontal" />

          {rest.length > 0 ? (
            <ul className="mt-20 grid gap-14 border-t border-line pt-14 md:grid-cols-2 md:gap-x-16">
              {rest.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </section>
    </>
  );
}
