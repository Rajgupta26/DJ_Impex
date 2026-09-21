# 03 · Pages, components and features

Copy for every page is in `/content`. Facts and their confirmation status are in `/content/site.json`.

## Routes

| Route | Page | Content file |
|---|---|---|
| `/` | Home | `content/home.md` |
| `/about` | About D J Impex & Co. | `content/about.md` |
| `/vision` | Our Vision | `content/vision.md` |
| `/nabeen` | Nabeen® | `content/nabeen.md` |
| `/nabeen-x-ali-nuhu` | Nabeen x Ali Nuhu | `content/nabeen-x-ali-nuhu.md` |
| `/journal` | The Fabric Journal (listing) | `content/journal/*.mdx` |
| `/journal/[slug]` | Journal article | `content/journal/*.mdx` |
| `/contact` | Contact Us | `content/contact.md` |
| `not-found` | 404 | "This page has moved or never existed." + links to Home and Contact |

Menu order (client spec): About DJI · Our Vision · Nabeen® · Nabeen x Ali Nuhu · The Fabric Journal · Contact Us.

## Home page, in the client's order
1. Hero carousel (3-4 slides)
2. Short brief about the company + trust marks
3. The Fabric Journal (3 latest)
4. Testimonials carousel
5. World of Nabeen® gallery (12 tiles)
6. Social cause (Wear2Care)
7. Footer

## Inner page template
- Page hero: shorter than home (55vh desktop / 45vh mobile), fabric image with navy veil, H1 bottom-left. No selvedge (the selvedge is only on the home hero and the footer).
- Breadcrumb-free; the header is enough.
- Each inner page ends with the same **Enquiry band**: navy background, H2 "Talk to the Nabeen team", one line, buttons "Enquire on WhatsApp" and "Contact us".

## Page notes
- **About:** story (asymmetric text + image), recognition (Star Export House), manufacturing process as a 7-step horizontal scroller on mobile / row on desktop. Numbered steps are correct here because it is a real sequence.
- **Vision:** Nino Cerruti quote set very large as the page opener; 5 pillars as a two-column list with H3 + paragraph. The pillars are NOT numbered (not a sequence).
- **Nabeen:** intro, values set as three large words, "1000+ designs" as the single big number, Browse by fabric (6 items, each with anchor id and a WhatsApp enquiry action prefilled with the fabric name), Signature lines as 4 tabs (accordion on mobile), brand promise quote, closing line.
- **Nabeen x Ali Nuhu:** editorial long-read layout. Large portrait of Ali Nuhu (pending), campaign story, mission section on navy, CTA. No emoji.
- **Journal listing:** first post large (7/5 split), others in a two-column list. Filter by category not needed yet (only 3 posts).
- **Journal article:** 65ch prose column, cover image, title, category, reading time, date; "More from the journal" at the end; enquiry band. Typography plugin styles must follow the design system (navy text, condensed H2s).
- **Contact:** two columns: channels (WhatsApp, phone, email, address, map) + enquiry form.

## Site-wide features

### 1. Contact popup (client requirement)
- Opens **5 seconds** after the first page load.
- Shows **once per session** (sessionStorage key `nabeen-popup-seen`). Does not show on `/contact`. Does not show if the user has already submitted the form.
- Accessible dialog: focus moves into it, focus is trapped, Esc and backdrop close it, focus returns to the previous element, `aria-modal="true"`, labelled by its heading.
- Content: heading "Talk to the Nabeen team", one line, fields Name / WhatsApp number / Market, "Send enquiry", and a secondary link "Or chat with us on WhatsApp now".
- On mobile: bottom sheet instead of centred modal.
- The client has a reference image for this popup that we have not received. Keep the component easy to restyle.

### 2. Floating WhatsApp + Directions buttons (client requirement)
- On **every page**, fixed bottom-right, stacked (WhatsApp above Directions), respecting `env(safe-area-inset-bottom)`.
- WhatsApp → `https://wa.me/{whatsapp.e164}?text={encoded prefill}`; on fabric-specific pages the prefill mentions the fabric.
- Directions → `https://www.google.com/maps/dir/?api=1&destination={encoded mapsQuery}`.
- Both open in a new tab, have `aria-label`s, 56px targets, and hide while the mobile menu or popup is open.
- Fire an analytics event on click (see 04).

### 3. Enquiry form
- Used on `/contact` (full) and in the popup (short).
- Validation with Zod on client and server. Honeypot field + simple rate limit for spam.
- Server Action sends an email to the client's address via **Resend** (`RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` env vars). If the env vars are missing, log the payload in development and show the WhatsApp fallback.
- States: idle, submitting (button shows "Sending…"), success ("Enquiry sent…"), error (says what failed, offers WhatsApp).

### 4. Carousels
- Use Embla Carousel. Keyboard accessible, swipe on touch, pause control on the hero (WCAG 2.2.2), autoplay stops on hover/focus and under reduced motion.

### 5. TODO / TBC system
- `NEXT_PUBLIC_SHOW_TODO=true` in development and staging previews: any fact with `status: "tbc"` shows a small dashed red "TBC" tag; image placeholders show what is pending.
- `status: "hold"` facts never render, in any environment.
- A `/_todo` route (dev only, `notFound()` in production) lists every tbc/hold item from site.json and every pending image, so the team can send one checklist to the client.
