import { Fragment, type ReactNode } from "react";

/**
 * The ® mark must never render at full size. Tokens give it `.reg`;
 * this is the only way it should reach the DOM.
 */
export function Reg() {
  return <sup className="reg">®</sup>;
}

/**
 * Wrap every ® inside a string of content-driven copy.
 * Content files write "Nabeen®" as plain text; this turns it into correct markup.
 */
export function withReg(text: string): ReactNode {
  if (!text.includes("®")) return text;
  const parts = text.split("®");
  return parts.map((part, index) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 ? <Reg /> : null}
    </Fragment>
  ));
}
