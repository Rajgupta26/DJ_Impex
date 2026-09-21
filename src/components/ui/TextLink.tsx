import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Navy, 600 weight, thread-thin gold underline. Never an arrow after the label. */
export function TextLink({
  href,
  external,
  onDark = false,
  className = "",
  children,
  ...rest
}: {
  href: string;
  external?: boolean;
  onDark?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  const classes = `text-link ${onDark ? "text-link-on-dark" : ""} ${className}`.trim();

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
