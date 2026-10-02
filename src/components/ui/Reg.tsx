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
 * Render a content string: typeset it, wrap every ® correctly, and ensure
 * the company name "DJ Impex & Co." is kept on one line (non-breaking).
 */
export function withReg(text: string): ReactNode {
  const typed = typeset(text);
  const pattern = /(Nabeen®|DJ\s*Impex\s*&\s*Co\.|D\s*J\s*Impex\s*&\s*Co\.|DJ\s*Impex|D\s*J\s*Impex)/;

  if (!pattern.test(typed) && !typed.includes("®")) return typed;

  return typed.split(pattern).map((part, partIndex) => {
    if (part === "Nabeen®") {
      return (
        <span key={partIndex} className="notranslate" translate="no">
          Nabeen<Reg />
        </span>
      );
    }
    if (/^(DJ\s*Impex\s*&\s*Co\.|D\s*J\s*Impex\s*&\s*Co\.)$/i.test(part)) {
      return (
        <span key={partIndex} className="whitespace-nowrap notranslate" translate="no">
          D J Impex &amp; Co.
        </span>
      );
    }
    if (/^(DJ\s*Impex|D\s*J\s*Impex)$/i.test(part)) {
      return (
        <span key={partIndex} className="whitespace-nowrap notranslate" translate="no">
          D J Impex
        </span>
      );
    }

    if (part.includes("®")) {
      const pieces = part.split("®");
      return pieces.map((piece, pieceIndex) => (
        <Fragment key={`${partIndex}-${pieceIndex}`}>
          {piece}
          {pieceIndex < pieces.length - 1 ? <Reg /> : null}
        </Fragment>
      ));
    }

    return part;
  });
}
