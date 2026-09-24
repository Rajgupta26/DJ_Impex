import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EnquiryBand } from "@/components/layout/EnquiryBand";
import { PostBody } from "@/components/journal/PostBody";
import { Markdown, journalTheme } from "@/components/markdown/Markdown";
import { PostCard } from "@/components/journal/PostCard";
import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TbcTag } from "@/components/ui/TbcTag";
import { TextLink } from "@/components/ui/TextLink";
import { getPosts } from "@/lib/content";
import { getJournalPost, getJournalPosts, type JournalPost } from "@/lib/journal";
import { buildMetadata, jsonLdScript, SITE_URL } from "@/lib/seo";
import { getSite } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

/**
 * Only the MDX posts are prerendered. A post written in the panel is rendered
 * on first request and then cached, because its slug is not known at build
 * time and a deploy is not required to publish one.
 */
export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path: `/journal/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.dateStatus === "tbc" ? undefined : post.publishedAt,
    keywords: post.seo.keywords,
  });
}

export default async function JournalPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) notFound();

  const more = (await getJournalPosts()).filter((item) => item.slug !== post.slug);

  return (
    <>
      <article>
        <header className="bg-white pt-[calc(4.5rem+var(--spacing-section)/2)] pb-14 lg:pt-[calc(5.25rem+var(--spacing-section)/2)]">
          <Container>
            <p className="t-small text-slate flex flex-wrap items-center gap-x-3">
              <Link href="/journal" className="text-link">
                The Fabric Journal
              </Link>
              <span aria-hidden="true">·</span>
              <span>{post.category}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
              <PublishedOn post={post} />
            </p>

            <h1 className="t-h1 mt-6 max-w-[18ch]">
              {withReg(post.title)}
              <TbcTag
                status={post.titleStatus ?? "confirmed"}
                note={post.suggestedTitle ? `Suggested: ${post.suggestedTitle}` : undefined}
              />
            </h1>
            <p className="t-lead measure mt-6">{withReg(post.excerpt)}</p>
          </Container>
        </header>

        <div className="bg-mist relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
          <Image src={post.coverImage} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>

        <div className="bg-white py-[clamp(3.5rem,2.5rem+4vw,6rem)]">
          <Container>
            {/* MDX is compiled, so it is only trusted for the agency's own
                files. A post typed in the admin panel goes through the safe
                renderer instead -- the same one its editor previews with. */}
            {post.source === "panel" ? (
              <div className="measure">
                <Markdown source={post.body} theme={journalTheme} emptyMessage="" />
              </div>
            ) : (
              <PostBody source={post.body} />
            )}

            {/* Every post leads back to the cloth it is about, and to the team. */}
            <div className="measure border-line mt-14 border-t pt-8">
              <p className="text-slate">
                Nabeen weaves the fabrics in this guide. <TextLink href="/about">Read our story</TextLink>, or{" "}
                <TextLink href="/#contact">talk to our team</TextLink> about your market.
              </p>
            </div>
          </Container>
        </div>
      </article>

      {more.length > 0 ? (
        <section className="bg-mist py-[var(--spacing-section)]">
          <Container>
            <h2 className="t-h2">More from the journal</h2>
            <ul className="mt-12 grid gap-14 md:grid-cols-2 md:gap-x-16">
              {more.map((item) => (
                <li key={item.slug}>
                  <PostCard post={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <EnquiryBand />

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(articleJsonLd(post))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(post))} />
    </>
  );
}

/** Dates are only shown once the client has confirmed them. */
function PublishedOn({ post }: { post: JournalPost }) {
  if (post.dateStatus === "hold") return null;
  const date = new Date(post.publishedAt);
  const label = date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <span aria-hidden="true">·</span>
      <time dateTime={post.publishedAt}>{label}</time>
      <TbcTag status={post.dateStatus ?? "confirmed"} note="Publication date not yet confirmed" />
    </>
  );
}

function articleJsonLd(post: JournalPost) {
  const site = getSite();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo.description,
    image: [`${SITE_URL}${post.coverImage}`],
    ...(post.dateStatus === "tbc" ? {} : { datePublished: post.publishedAt }),
    author: { "@type": "Organization", name: "Nabeen editorial team" },
    publisher: {
      "@type": "Organization",
      name: site.brand.company.value,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logos/nabeen-logo-navy.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/journal/${post.slug}`,
  };
}

function breadcrumbJsonLd(post: JournalPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "The Fabric Journal", item: `${SITE_URL}/journal` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/journal/${post.slug}`,
      },
    ],
  };
}
