import { Fragment, type ReactNode } from "react";

/**
 * The ® mark must never render at full size. Tokens give it `.reg`;
 * this is the only way it should reach the DOM.
 */
export function Reg() {
  return <sup className="reg">®</sup>;
}

/**
 * Typographic tidy-up for content-file copy.
 *
 * The briefs are written in plain text with straight quotes. Setting them with
 * real apostrophes and quotation marks is most of the difference between copy
 * that looks typeset and copy that looks pasted.
 */
export function typeset(text: string): string {
  return text
    .replace(/(\w)'(\w)/g, "$1’$2") // men's
    .replace(/'(\d\ds\b)/g, "’$1") // '90s
    .replace(/(^|[\s([])"/g, "$1“") // opening double
    .replace(/"/g, "”") // closing double
    .replace(/(^|[\s([])'/g, "$1‘") // opening single
    .replace(/'/g, "’") // closing single
    .replace(/(\s)-(\s)/g, "$1–$2") // spaced hyphen to en dash
    .replace(/\.\.\./g, "…");
}

/**
 * Render a content string: typeset it, and wrap every ® correctly.
 * Content files write "Nabeen®" as plain text; this turns it into markup.
 */
export function withReg(text: string): ReactNode {
  const typed = typeset(text);
  if (!typed.includes("®")) return typed;

  const parts = typed.split("®");
  return parts.map((part, index) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 ? <Reg /> : null}
    </Fragment>
  ));
}
