"use client";

import type { ComponentProps, ReactNode } from "react";

import { track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * An outbound contact link that reports itself. These events are the site's main
 * success metric, so every WhatsApp, call, email and directions link goes through here.
 */
export function TrackedLink({
  href,
  event,
  location,
  external = true,
  className = "",
  children,
  ...rest
}: {
  href: string;
  event: AnalyticsEvent;
  location: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(event, { location })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
