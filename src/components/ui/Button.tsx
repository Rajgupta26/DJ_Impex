import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "on-dark" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  "on-dark": "btn-on-dark",
  ghost: "btn-ghost",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

/**
 * Labels say exactly what happens. No arrows appended, no emoji.
 * The whole label is wrapped in a span so the flex gap never splits a ® from its word.
 */
function labelled(children: ReactNode) {
  return <span>{children}</span>;
}

export function ButtonLink({
  href,
  external,
  variant = "primary",
  className = "",
  children,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<
    ComponentProps<"a">,
    "href" | "className" | "children"
  >) {
  const classes = `btn ${VARIANTS[variant]} ${className}`.trim();

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {labelled(children)}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {labelled(children)}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={`btn ${VARIANTS[variant]} ${className}`.trim()} {...rest}>
      {labelled(children)}
    </button>
  );
}
