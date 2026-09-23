# CLAUDE.md: Nabeen® / D J Impex & Co. website

Standing rules for every session in this repo. The full spec is in `brand-kit/`.

## What this is
A premium, mobile-first **portfolio** website for Nabeen®, the luxury fabric brand of D J Impex & Co. (DJI), Mumbai. Est. 1995. Star Export House. Exports to Africa (mainly Nigeria) and the Middle East.
**Never add e-commerce:** no cart, prices, checkout, accounts or payments. Every call to action leads to WhatsApp, a phone call, email, directions or the enquiry form.

## Read before working
- `brand-kit/docs/01-project-brief.md`: goals and audience
- `brand-kit/docs/02-design-system.md`: the visual rules (follow exactly)
- `brand-kit/docs/03-pages-and-features.md`: routes, sections, features
- `brand-kit/docs/04-seo-performance-accessibility.md`: quality bar
- `brand-kit/content/site.json`: every fact, with its status
- `brand-kit/content/*.md` and `brand-kit/content/journal/*.mdx`: page copy
- `brand-kit/design/tokens.css` and `brand-kit/design/style-guide.html`: tokens and the visual reference

## Content rules
1. **Only use facts from `brand-kit/content`.** Never invent numbers, dates, names, specs, quotes or claims. If something is missing, use a clearly marked placeholder.
2. Respect statuses in `site.json`: `confirmed` → use. `tbc` → use, and show the dev-only TBC tag. `hold` → never render.
3. Founded **1995**. The old prototype's "1998 / 27 years" is wrong.
4. Do not reuse copy or claims from the old prototype (djimpex.vercel.app); see the list in `docs/05-open-questions.md`.
5. Copy marked "proposed" in content files may be used, but keep it easy to find and change.
6. No emoji in the UI. Sentence case. British/Indian English spelling (colour, organise).
7. Never use stock photos of children for the education cause.

## Design rules (short version; details in 02-design-system.md)
- Colours: Navy #172850, White, Midnight Loom #0D1733, Giza Mist #EEF1F6, Thread Slate #5A6680, Selvedge Blue #5F95DD (thread-thin accent only).
- **The palette is blue only.** Zari Gold #B8925A was the accent until 2026-09-22, when the agency
  replaced it so the site matches the client's logo. It was only ever marked PROPOSED in tokens.css.
  Selvedge Blue sits at the logo's own hue and is measured against every ground it lands on.
  Do not reintroduce gold, or any other hue, without the client saying so.
- Font: Open Sans variable only. Headlines at `font-stretch: 75%`, weight 300. Body at 100% width.
- **The selvedge band has been removed** (2026-09-23, agency instruction). It ran at the hero's
  bottom edge and the footer's top edge and was the house signature; the site now has neither.
  `Selvedge.tsx` and the `.selvedge` rules in tokens.css are kept but referenced nowhere. Do not
  re-add the band without asking, and do not treat its absence as a bug. Pinked edges only in the gallery.
- Left-aligned, editorial, generous whitespace. No uppercase eyebrows, no fade-up on every section, no rows of identical shadowed cards, no arrows appended to button text.
- Wrap ® as `<sup class="reg">®</sup>`.

## Engineering rules
- Next.js App Router + TypeScript (strict) + Tailwind CSS v4. Server Components by default.
- Content is read from `brand-kit/content` at build time (typed loaders in `lib/content.ts`). Do not duplicate facts into components.
- All contact links are built by helpers in `lib/contact.ts` (WhatsApp, tel, mailto, directions). Never hard-code a number or address in a component.
- Every image through `next/image` with meaningful alt text.
- Before finishing any task: `npm run lint`, `npm run typecheck`, `npm run build` must pass.
- Commit after each completed phase with a clear message.
- When unsure about a fact or a design decision, add it to `brand-kit/docs/05-open-questions.md` and keep going with the documented default. Do not stop the build for it.
