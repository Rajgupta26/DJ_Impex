import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ReactNode } from "react";

import { withReg } from "@/components/ui/Reg";

/**
 * MDX styled to the design system rather than to a typography plugin's defaults:
 * condensed light H2s, a 65-character measure, navy text, and pull quotes behind
 * a thread-thin gold rule.
 */
const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="t-h2 mb-5 mt-16 max-w-[20ch] text-[clamp(1.75rem,1.3rem+1.5vw,2.75rem)] first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="t-h3 mb-3 mt-12">{children}</h3>,
  p: ({ children }) => <p className="mb-6 text-slate">{children}</p>,
  ul: ({ children }) => <ul className="mb-6 grid gap-2 text-slate">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 grid gap-2 text-slate">{children}</ol>,
  li: ({ children }) => (
    <li className="border-l border-line pl-4">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-12 border-l border-zari pl-8 text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-light leading-[1.35] [font-stretch:87.5%] text-navy">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => <strong className="font-semibold text-navy">{children}</strong>,
  a: ({ href, children }) => {
    const target = String(href ?? "");
    if (target.startsWith("/")) {
      return (
        <Link href={target} className="text-link">
          {children}
        </Link>
      );
    }
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" className="text-link">
        {children}
      </a>
    );
  },
  hr: () => <hr className="my-12 border-0 border-t border-line" />,
};

export function PostBody({ source }: { source: string }) {
  return (
    <div className="measure">
      <MDXRemote source={source} components={components} />
    </div>
  );
}

/** Typeset a heading string coming from frontmatter rather than MDX. */
export function PostHeading({ children }: { children: string }): ReactNode {
  return withReg(children);
}
