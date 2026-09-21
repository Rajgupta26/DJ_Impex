import Image from "next/image";
import Link from "next/link";

import { TbcTag } from "@/components/ui/TbcTag";
import { withReg } from "@/components/ui/Reg";
import type { Post } from "@/lib/content";

/**
 * Image with square corners, category and reading time in small slate, title in
 * H3. No card background, no border, no shadow: the image is the card.
 */
export function PostCard({
  post,
  size = "small",
  className = "",
}: {
  post: Post;
  size?: "large" | "small";
  className?: string;
}) {
  const large = size === "large";

  return (
    <article className={`group ${className}`.trim()}>
      <Link href={`/journal/${post.slug}`} className="block">
        <div
          className={`relative overflow-hidden bg-mist ${large ? "aspect-[4/3]" : "aspect-[3/2]"}`}
        >
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes={large ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 34vw"}
            className="object-cover transition-transform duration-[var(--duration-base)] ease-[var(--ease-weave)] group-hover:scale-[1.03]"
          />
        </div>

        <p className="t-small mt-5 flex flex-wrap items-center gap-x-3 text-slate">
          <span>{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
        </p>

        <h3
          className={`mt-3 font-semibold leading-[1.22] [font-stretch:87.5%] ${
            large
              ? "text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-light [font-stretch:80%]"
              : "t-h3"
          }`}
        >
          {withReg(post.title)}
          <TbcTag
            status={post.titleStatus ?? "confirmed"}
            note={post.suggestedTitle ? `Suggested: ${post.suggestedTitle}` : undefined}
          />
        </h3>

        <p className={`measure mt-4 text-slate ${large ? "" : "t-small"}`}>{withReg(post.excerpt)}</p>
      </Link>
    </article>
  );
}
