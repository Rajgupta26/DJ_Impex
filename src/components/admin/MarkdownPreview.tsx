import type { ReactNode } from "react";

/**
 * A deliberately small Markdown renderer for the blog editor's preview.
 *
 * It builds React elements rather than an HTML string, so nothing a writer
 * types can inject markup: React escapes text children. That is the whole
 * reason it is hand-rolled instead of piping the content through a parser and
 * dangerouslySetInnerHTML.
 *
 * Supported: #/##/### headings, paragraphs, - and 1. lists, > quotes,
 * **bold**, *italic*, `code` and [links](url). Anything else renders as text.
 */

function inline(text: string, keyPrefix: string): ReactNode[] {
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
        <code key={key} className="rounded bg-slate-100 px-1 py-0.5 text-[0.9em] dark:bg-slate-800">
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
          <a key={key} href={href} className="text-navy underline dark:text-slate-200">
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

export function MarkdownPreview({ source }: { source: string }) {
  const blocks = source.split(/\n{2,}/).filter((block) => block.trim());

  if (blocks.length === 0) {
    return (
      <p className="text-sm text-slate-400 dark:text-slate-500">
        Nothing to preview yet. Start typing in the content box.
      </p>
    );
  }

  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      {blocks.map((block, blockIndex) => {
        const key = `block-${blockIndex}`;
        const lines = block.split("\n");

        const heading = /^(#{1,3})\s+(.*)$/.exec(lines[0]);
        if (heading && lines.length === 1) {
          const level = heading[1].length;
          const content = inline(heading[2], key);
          if (level === 1)
            return (
              <h3 key={key} className="text-lg font-semibold">
                {content}
              </h3>
            );
          if (level === 2)
            return (
              <h4 key={key} className="text-base font-semibold">
                {content}
              </h4>
            );
          return (
            <h5 key={key} className="text-sm font-semibold">
              {content}
            </h5>
          );
        }

        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={key} className="list-disc space-y-1 pl-5">
              {lines.map((line, i) => (
                <li key={`${key}-${i}`}>{inline(line.replace(/^[-*]\s+/, ""), `${key}-${i}`)}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
          return (
            <ol key={key} className="list-decimal space-y-1 pl-5">
              {lines.map((line, i) => (
                <li key={`${key}-${i}`}>{inline(line.replace(/^\d+[.)]\s+/, ""), `${key}-${i}`)}</li>
              ))}
            </ol>
          );
        }

        if (lines.every((line) => line.startsWith(">"))) {
          return (
            <blockquote key={key} className="border-l-2 border-slate-300 pl-4 italic dark:border-slate-600">
              {inline(lines.map((line) => line.replace(/^>\s?/, "")).join(" "), key)}
            </blockquote>
          );
        }

        return <p key={key}>{inline(lines.join(" "), key)}</p>;
      })}
    </div>
  );
}
