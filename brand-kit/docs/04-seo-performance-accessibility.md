# 04 · SEO, performance, accessibility, analytics

## SEO
- Next.js Metadata API for every route: unique title (`{Page} | Nabeen® Luxury Fabrics by DJI`), description, canonical, Open Graph + Twitter card, `og:locale` `en_NG` with alternate `en_IN`.
- Generate a branded Open Graph image per page with `next/og` (navy background, Nabeen logo, page title in condensed light Open Sans).
- `app/sitemap.ts` and `app/robots.ts`. Production domain: `https://www.djimpex.in`.
- JSON-LD:
  - Site-wide: `Organization` (name D J Impex & Co., brand Nabeen, foundingDate 1995, logo, sameAs Instagram + Facebook, contactPoint with phone).
  - `/contact`: `LocalBusiness` with address (only once the address is confirmed).
  - Journal articles: `Article` (headline, image, datePublished, author = Nabeen editorial team, publisher = Organization).
  - `BreadcrumbList` on journal articles.
- One H1 per page. Descriptive alt text for every fabric image (colour + weave, e.g. "Aqua jacquard shirting fabric").
- Journal target keywords are in each MDX file's frontmatter. Use them in title, H1, first paragraph and alt text naturally; no keyword stuffing.
- Internal links: every journal post links to `/nabeen#swiss-lace` (or the relevant fabric) and to Contact.

## Performance (budget for a mid-range Android on 4G in Nigeria)
- LCP < 2.5s, CLS < 0.05, INP < 200ms. Lighthouse mobile Performance ≥ 90.
- Server Components by default. Client components only for: header scroll state, mobile menu, carousels, popup, forms, floating buttons.
- `next/image` everywhere with explicit sizes; AVIF/WebP; hero image `priority`; everything else lazy.
- Only the first hero slide loads eagerly; other slides load after first paint.
- Fonts via `next/font` (self-hosted, `display: swap`, only the latin subset, only the axes used).
- Google Map on /contact is click-to-load (static image or styled block first).
- No heavy animation libraries beyond one small one (Motion) used only for the hero reveal and popup; prefer CSS.
- JS budget: < 120 KB gzipped on the home page.

## Accessibility (WCAG 2.2 AA)
- Colour contrast checked for every text/background pair in the design system (navy on white 13:1, slate on white 5.6:1, white on navy 13:1). Gold is never used for text.
- Visible focus on every interactive element (gold focus ring).
- Skip link to main content.
- Carousels: pause/play control, keyboard arrows, slide labels "Slide 2 of 4".
- Popup and mobile menu: proper dialog semantics and focus management.
- Forms: labels, `aria-describedby` for errors, errors announced with `aria-live`.
- `prefers-reduced-motion` respected everywhere.
- Tap targets ≥ 44px.

## Analytics (privacy-friendly)
- Vercel Analytics (or GA4 if the client prefers; ask).
- Custom events: `whatsapp_click` (with `location`: hero / floating / popup / fabric card / enquiry band), `directions_click`, `call_click`, `email_click`, `enquiry_submit`, `popup_open`, `popup_dismiss`.
- These events are the site's main success metric. Make them reliable.
