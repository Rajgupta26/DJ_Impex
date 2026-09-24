import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JournalArticleAnimated } from "@/components/journal/JournalArticleAnimated";
import { PostCard } from "@/components/journal/PostCard";
import { Container } from "@/components/ui/Container";
import { getPost, getPosts, type Post } from "@/lib/content";
import { buildMetadata, jsonLdScript, SITE_URL } from "@/lib/seo";
import { getSite } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
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
  const post = getPost(slug);
  if (!post) notFound();

  const more = getPosts().filter((item) => item.slug !== post.slug);

  return (
    <>
      <JournalArticleAnimated post={post} />

      {more.length > 0 ? (
        <section className="page-end bg-mist py-[var(--spacing-section)]">
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(articleJsonLd(post))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(post))}
      />
    </>
  );
}


function articleJsonLd(post: Post) {
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

function breadcrumbJsonLd(post: Post) {
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
