import type { Metadata } from "next";

import { PostCard } from "@/components/journal/PostCard";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getJournalPosts } from "@/lib/journal";
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
/**
 * Rendered per request rather than served from the CDN's cache.
 *
 * These pages show content the admin panel writes, and `revalidate` plus
 * `revalidatePath` did not make that reliable on Vercel: measured against
 * production, consecutive requests after one edit alternated between the old
 * and the new copy, because the page is cached at several edge nodes that
 * regenerate independently. A panel that reports success while the website
 * shows yesterday's text is the whole complaint, so correctness wins here.
 *
 * The cost is a server render and one store read per request. If that shows up
 * in the page timings, cache the store read on a short tag rather than putting
 * the HTML back in the edge cache.
 */
export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const [lead, ...rest] = await getJournalPosts();

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
            <ul className="border-line mt-20 grid gap-14 border-t pt-14 md:grid-cols-2 md:gap-x-16">
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
