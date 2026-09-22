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
  layout = "vertical",
  leadText,
  className = "",
}: {
  post: Post;
  size?: "large" | "small";
  layout?: "vertical" | "horizontal";
  leadText?: string;
  className?: string;
}) {
  const large = size === "large";
  const horizontal = layout === "horizontal";

  return (
    <article className={`group ${className}`.trim()}>
      <Link
        href={`/journal/${post.slug}`}
        className={
          horizontal
            ? "grid gap-8 md:grid-cols-12 md:gap-10 lg:gap-16 md:items-start"
            : "block"
        }
      >
        <div
          className={`relative overflow-hidden bg-mist ${
            horizontal
              ? "aspect-[4/3] w-full md:col-span-7"
              : large
              ? "aspect-[4/3]"
              : "aspect-[3/2]"
          }`}
        >
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes={
              horizontal
                ? "(max-width: 768px) 100vw, 58vw"
                : large
                ? "(max-width: 1024px) 100vw, 58vw"
                : "(max-width: 1024px) 100vw, 34vw"
            }
            className="object-cover transition-transform duration-[var(--duration-base)] ease-[var(--ease-weave)] group-hover:scale-[1.03]"
          />
        </div>

        <div className={horizontal ? "md:col-span-5 flex flex-col justify-start" : ""}>
          <p
            className={`t-small flex flex-wrap items-center gap-x-3 text-slate ${
              horizontal ? "" : "mt-5"
            }`}
          >
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

          {leadText ? (
            <p
              className="measure mt-4 text-slate leading-relaxed font-normal"
              style={{ fontFamily: 'var(--font-poppins), "Poppins", "Montserrat", sans-serif' }}
            >
              {leadText}
            </p>
          ) : null}

          <p className={`measure ${leadText ? "mt-3" : "mt-4"} text-slate ${large ? "" : "t-small"}`}>
            {withReg(post.excerpt)}
          </p>
        </div>
      </Link>
    </article>
  );
}
