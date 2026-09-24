import type { ReactNode } from "react";

/**
 * A deliberately small Markdown renderer, shared by the admin editor's preview
 * and the published page. One renderer means the preview is not an
 * approximation of the post: it is the same code, so what a writer sees is what
 * the website shows.
 *
 * It builds React elements rather than an HTML string, so nothing a writer
 * types can inject markup -- React escapes text children. That is also why
 * posts written in the panel do not go through MDXRemote like the MDX files in
 * brand-kit do: MDX compiles its input, so a stray `<` or `{` in a hand-typed
 * post would throw during render and take the page down with it.
 *
 * Supported: #/##/### headings, paragraphs, - and 1. lists, > quotes,
 * **bold**, *italic*, `code` and [links](url). Anything else renders as text.
 */

export type MarkdownTheme = {
  wrapper: string;
  h1: string;
  h2: string;
  h3: string;
  p: string;
  ul: string;
  ol: string;
  li: string;
  quote: string;
  code: string;
  link: string;
  empty: string;
};

/** Dense, small: the editor's side-by-side preview. */
export const adminTheme: MarkdownTheme = {
  wrapper: "space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300",
  h1: "text-lg font-semibold",
  h2: "text-base font-semibold",
  h3: "text-sm font-semibold",
  p: "",
  ul: "list-disc space-y-1 pl-5",
  ol: "list-decimal space-y-1 pl-5",
  li: "",
  quote: "border-l-2 border-slate-300 pl-4 italic dark:border-slate-600",
  code: "rounded bg-slate-100 px-1 py-0.5 text-[0.9em] dark:bg-slate-800",
  link: "text-navy underline dark:text-slate-200",
  empty: "text-sm text-slate-400 dark:text-slate-500",
};

/** The house style, matched to PostBody so a panel post sits beside an MDX one. */
export const journalTheme: MarkdownTheme = {
  wrapper: "measure",
  h1: "t-h2 mt-16 mb-5 max-w-[20ch] text-[clamp(1.75rem,1.3rem+1.5vw,2.75rem)] first:mt-0",
  h2: "t-h2 mt-16 mb-5 max-w-[20ch] text-[clamp(1.75rem,1.3rem+1.5vw,2.75rem)] first:mt-0",
  h3: "t-h3 mt-12 mb-3",
  p: "text-slate mb-6",
  ul: "text-slate mb-6 grid gap-2",
  ol: "text-slate mb-6 grid gap-2",
  li: "border-line border-l pl-4",
  quote:
    "border-accent text-navy my-12 border-l pl-8 text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-[1.35] font-light",
  code: "bg-mist rounded px-1 py-0.5 text-[0.9em]",
  link: "text-link",
  empty: "text-slate",
};

function inline(text: string, keyPrefix: string, theme: MarkdownTheme): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let index = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;

    if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className={theme.code}>
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("[")) {
      const [, label, href] = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token) ?? [];
      // Only http(s), mailto and site-relative links become anchors. A
      // javascript: URL in a draft would otherwise become a live link.
      const safe = href && /^(https?:\/\/|mailto:|\/)/i.test(href);
      nodes.push(
        safe ? (
          <a key={key} href={href} className={theme.link}>
            {label}
          </a>
        ) : (
          <span key={key}>{label ?? token}</span>
        ),
      );
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }
    last = start + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({
  source,
  theme,
  emptyMessage = "Nothing here yet.",
}: {
  source: string;
  theme: MarkdownTheme;
  emptyMessage?: string;
}) {
  const blocks = source.split(/\n{2,}/).filter((block) => block.trim());

  if (blocks.length === 0) return <p className={theme.empty}>{emptyMessage}</p>;

  return (
    <div className={theme.wrapper}>
      {blocks.map((block, blockIndex) => {
        const key = `block-${blockIndex}`;
        const lines = block.split("\n");

        const heading = /^(#{1,3})\s+(.*)$/.exec(lines[0]);
        if (heading && lines.length === 1) {
          const level = heading[1].length;
          const content = inline(heading[2], key, theme);
          if (level === 1)
            return (
              <h2 key={key} className={theme.h1}>
                {content}
              </h2>
            );
          if (level === 2)
            return (
              <h2 key={key} className={theme.h2}>
                {content}
              </h2>
            );
          return (
            <h3 key={key} className={theme.h3}>
              {content}
            </h3>
          );
        }

        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={key} className={theme.ul}>
              {lines.map((line, i) => (
                <li key={`${key}-${i}`} className={theme.li}>
                  {inline(line.replace(/^[-*]\s+/, ""), `${key}-${i}`, theme)}
                </li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
          return (
            <ol key={key} className={theme.ol}>
              {lines.map((line, i) => (
                <li key={`${key}-${i}`} className={theme.li}>
                  {inline(line.replace(/^\d+[.)]\s+/, ""), `${key}-${i}`, theme)}
                </li>
              ))}
            </ol>
          );
        }

        if (lines.every((line) => line.startsWith(">"))) {
          return (
            <blockquote key={key} className={theme.quote}>
              {inline(lines.map((line) => line.replace(/^>\s?/, "")).join(" "), key, theme)}
            </blockquote>
          );
        }

        return (
          <p key={key} className={theme.p}>
            {inline(lines.join(" "), key, theme)}
          </p>
        );
      })}
    </div>
  );
}
