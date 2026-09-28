import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { TbcTag } from "@/components/ui/TbcTag";
import { withReg } from "@/components/ui/Reg";
import type { Post } from "@/lib/content";

type FeatureCardProps = {
  post: Post;
  featured?: boolean;
};

function ReadingLabel({ post }: { post: Post }) {
  return (
    <p className="t-small inline-flex items-center gap-x-3 rounded-full bg-white/95 px-4 py-2 font-medium text-navy shadow-sm backdrop-blur-sm">
      <span>{post.category}</span>
      <span aria-hidden="true">·</span>
      <span>{post.readingMinutes} min read</span>
    </p>
  );
}

function FeatureCard({ post, featured = false }: FeatureCardProps) {
  return (
    <article
      className={`group overflow-hidden rounded-xl bg-white shadow-[0_8px_28px_rgb(23_40_80_/_0.08)] ${
        featured ? "lg:h-full" : ""
      }`}
    >
      <Link
        href={`/journal/${post.slug}`}
        className={`block focus-visible:relative ${featured ? "lg:flex lg:h-full lg:flex-col" : ""}`}
      >
        <div
          className={`relative overflow-hidden bg-mist ${
            featured ? "aspect-[6/5] lg:aspect-auto lg:flex-1" : "aspect-[16/9]"
          }`}
        >
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 1024px) 100vw, 42vw"}
            className="object-cover transition-transform duration-[var(--duration-base)] ease-[var(--ease-weave)] group-hover:scale-[1.03]"
          />
          <div className="absolute bottom-5 left-5">
            <ReadingLabel post={post} />
          </div>
        </div>

        <div className={featured ? "p-6 sm:p-8 lg:p-10" : "p-5 sm:p-6"}>
          <div className="flex items-end justify-between gap-5">
            <div>
              <h3 className={featured ? "t-h2 font-semibold" : "t-h3"}>
                {withReg(post.title)}
                <TbcTag
                  status={post.titleStatus ?? "confirmed"}
                  note={post.suggestedTitle ? `Suggested: ${post.suggestedTitle}` : undefined}
                />
              </h3>
              <p className={`mt-3 text-slate ${featured ? "t-lead" : "t-small"}`}>
                {withReg(post.excerpt)}
              </p>
            </div>
            {!featured ? <ArrowRight aria-hidden="true" className="mb-1 size-6 shrink-0" /> : null}
          </div>

          {featured ? (
            <span className="btn btn-primary mt-7">
              Read article <ArrowRight aria-hidden="true" className="size-4" />
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

/** The journal's three-post editorial layout: one feature alongside two equal supporting cards. */
export function JournalFeatureGrid({ lead, supporting }: { lead: Post; supporting: Post[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-stretch lg:gap-7">
      <FeatureCard post={lead} featured />
      <div className="grid gap-6 lg:gap-7">
        {supporting.map((post) => (
          <FeatureCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
