import type { Metadata } from "next";

import { EnquiryBand } from "@/components/layout/EnquiryBand";
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

export default function JournalPage() {
  const [lead, ...rest] = getPosts();

  return (
    <>
      <PageHero
        title="The Fabric Journal"
        strapline="Guides to choosing, judging and wearing fine fabric."
        pattern="check"
      />

      <section className="bg-white py-[var(--spacing-section)]">
        <Container>
          {/* The newest post runs large, 7/5. The rest sit in a two-column list. */}
          <PostCard post={lead} size="large" className="lg:max-w-[58%]" />

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

      <EnquiryBand />
    </>
  );
}
