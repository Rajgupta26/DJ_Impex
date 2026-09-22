"use client";

import { useId, useState, useSyncExternalStore } from "react";

import { withReg } from "@/components/ui/Reg";

export type SignatureLine = { name: string; products: string[] };

/**
 * The four signature lines: accessible tabs on desktop, an accordion on a phone.
 *
 * One set of markup rather than two hidden copies, switched on a media query, so
 * the products are not duplicated in the DOM for screen readers or for search.
 */
export function SignatureLines({ lines }: { lines: SignatureLine[] }) {
  const isDesktop = useMediaQuery("(min-width: 64rem)");
  const [open, setOpen] = useState(0);
  const id = useId();

  if (isDesktop) {
    return (
      <div className="mt-12 grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
        <div role="tablist" aria-label="Signature lines" className="grid content-start">
          {lines.map((line, index) => (
            <button
              key={line.name}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={index === open}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={index === open ? 0 : -1}
              onClick={() => setOpen(index)}
              onKeyDown={(event) => {
                if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
                event.preventDefault();
                const next =
                  event.key === "ArrowDown"
                    ? (open + 1) % lines.length
                    : (open - 1 + lines.length) % lines.length;
                setOpen(next);
                document.getElementById(`${id}-tab-${next}`)?.focus();
              }}
              className={`border-t border-line py-5 text-left transition-colors duration-[var(--duration-quick)] ${
                index === open ? "text-navy" : "text-slate hover:text-navy"
              }`}
            >
              <span
                className={`t-h3 block border-l-2 pl-5 ${
                  index === open ? "border-accent" : "border-transparent"
                }`}
              >
                {withReg(line.name)}
              </span>
            </button>
          ))}
        </div>

        {lines.map((line, index) => (
          <div
            key={line.name}
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            hidden={index !== open}
            tabIndex={0}
          >
            <ProductList products={line.products} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-10">
      {lines.map((line, index) => (
        <div key={line.name} className="border-t border-line">
          <h3>
            <button
              type="button"
              aria-expanded={index === open}
              aria-controls={`${id}-acc-${index}`}
              onClick={() => setOpen(index === open ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="t-h3">{withReg(line.name)}</span>
              <span
                aria-hidden="true"
                className={`relative block h-3 w-3 shrink-0 transition-transform duration-[var(--duration-base)] ${
                  index === open ? "rotate-45" : ""
                }`}
              >
                <span className="absolute left-0 top-1/2 h-px w-full bg-navy" />
                <span className="absolute left-1/2 top-0 h-full w-px bg-navy" />
              </span>
            </button>
          </h3>
          <div id={`${id}-acc-${index}`} hidden={index !== open} className="pb-7">
            <ProductList products={line.products} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductList({ products }: { products: string[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
      {products.map((product) => (
        <li key={product} className="border-b border-line pb-3 text-slate">
          {withReg(product)}
        </li>
      ))}
    </ul>
  );
}

/** SSR renders the phone layout; desktop takes over on hydration. */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
