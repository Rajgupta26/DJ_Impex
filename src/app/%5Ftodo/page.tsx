import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Container } from "@/components/ui/Container";
import { getPosts, getSite } from "@/lib/content";
import { showTodo } from "@/lib/env";
import type { Status } from "@/lib/site";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type Row = { label: string; status: Status; note?: string };

/**
 * One checklist the team can send to the client: every fact still marked tbc or
 * hold, and every image the site is waiting for.
 *
 * Development and staging only. In production this route does not exist.
 */
export default function TodoPage() {
  if (!showTodo) notFound();

  const site = getSite();
  const rows: Row[] = [];

  const add = (label: string, status: Status, note?: string) => {
    if (status !== "confirmed") rows.push({ label, status, note });
  };

  add("Phone (secondary)", site.contact.phoneSecondary.status, site.contact.phoneSecondary.note);
  add("WhatsApp number", site.contact.whatsapp.status, site.contact.whatsapp.note);
  add("Email (secondary)", site.contact.emailPrimary.status, site.contact.emailPrimary.note);
  add("Email (gmail)", site.contact.emailSecondary.status, site.contact.emailSecondary.note);
  add("Address", site.contact.address.status, site.contact.address.note);
  add("Google rating", site.ratings.googleRating.status, site.ratings.googleRating.note);
  add("Happy customers figure", site.ratings.happyCustomers.status, site.ratings.happyCustomers.note);
  add("Fabric types", site.fabricTypes.status, site.fabricTypes._note);
  add("Signature lines", site.signatureLines.status, site.signatureLines._note);
  add(
    "Percentage donated to child education",
    site.socialCause.percentage.status,
    site.socialCause.percentage.note,
  );

  for (const social of site.social) {
    add(`Social: ${social.name}`, social.status, social.note);
  }
  for (const [index, item] of site.testimonials.items.entries()) {
    add(`Testimonial ${index + 1}`, item.status, item.quote);
  }
  for (const post of getPosts()) {
    add(`Journal date: ${post.title}`, post.dateStatus ?? "confirmed", post.publishedAt);
    add(
      `Journal title: ${post.title}`,
      post.titleStatus ?? "confirmed",
      post.suggestedTitle ? `Suggested: ${post.suggestedTitle}` : undefined,
    );
  }

  const pendingImages = [
    "Hero carousel photographs (3-4, landscape, high resolution)",
    "High-resolution originals of the 10 brochure fabric photographs",
    "Two more fabric photographs, to complete the 12-tile gallery",
    "Ali Nuhu campaign photographs, and an approved quote",
    "Real photographs of the Wear2Care education work (never stock photos of children)",
    "Real factory and process photographs",
    "SVG versions of the Nabeen and DJI logos",
  ];

  const held = rows.filter((row) => row.status === "hold");
  const tbc = rows.filter((row) => row.status === "tbc");

  return (
    <div className="bg-white pb-24 pt-[calc(4.5rem+4rem)]">
      <Container>
        <h1 className="t-h1">Outstanding items</h1>
        <p className="t-lead measure mt-5">
          Everything the site is still waiting on. This page exists only where
          NEXT_PUBLIC_SHOW_TODO is set, and is never published.
        </p>

        <Group title={`Awaiting confirmation (${tbc.length})`} rows={tbc} />
        <Group title={`On hold, never rendered (${held.length})`} rows={held} />

        <h2 className="t-h2 mt-16">Images pending ({pendingImages.length})</h2>
        <ul className="mt-6 grid gap-3">
          {pendingImages.map((image) => (
            <li key={image} className="border-t border-line pt-3 text-slate">
              {image}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

function Group({ title, rows }: { title: string; rows: Row[] }) {
  if (rows.length === 0) return null;
  return (
    <>
      <h2 className="t-h2 mt-16">{title}</h2>
      <ul className="mt-6 grid gap-4">
        {rows.map((row) => (
          <li key={`${row.label}-${row.note ?? ""}`} className="border-t border-line pt-4">
            <p className="font-semibold">{row.label}</p>
            {row.note ? <p className="t-small mt-1 max-w-[60rem] text-slate">{row.note}</p> : null}
          </li>
        ))}
      </ul>
    </>
  );
}
