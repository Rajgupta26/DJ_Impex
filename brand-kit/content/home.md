---
page: Home
route: /
source: Home_Page_Format.pdf (structure), About DJI PDF + brochure (copy)
---

# Home page: section order (client spec, do not reorder)

1. Header: logo + 6-item menu (see site.json navigation)
2. Hero carousel: 3-4 slides
3. Short brief about the company
4. The Fabric Journal (latest 3 posts)
5. Client testimonials carousel (5-6 needed; 4 available)
6. Gallery: "World of Nabeen®" (3 x 4 grid = 12 images; 10 available)
7. Social cause
8. Footer: tags, socials (Instagram, Facebook, Pinterest)

Site-wide: contact pop-up after 5 seconds; floating WhatsApp + Directions buttons on every page.
The client referenced "images shared" for the brief section, the journal section and the pop-up. Those reference images have NOT been received yet. Build to the design system; adjust when they arrive.

## 2. Hero carousel

Slide copy is PROPOSED (client has not supplied hero copy). Keep it short. Images: pending from client; use assets/brand-imagery + gallery as placeholders.

- Slide 1
  - Headline: House of luxury men's fabrics
  - Sub: Nabeen® by D J Impex & Co. Woven in India since 1995 for Africa and the Middle East.
- Slide 2
  - Headline: Over 1000 designs. One standard.
  - Sub: From Giza to Jacquard, a world of choice backed by uncompromising quality.
- Slide 3
  - Headline: Wear2Care x Ali Nuhu
  - Sub: A share of every Nabeen fabric supports child education in Nigeria.
  - Link: /nabeen-x-ali-nuhu
- Slide 4 (optional)
  - Headline: A Star Export House
  - Sub: Recognised by the Government of India for consistent export excellence.

Primary CTA on hero: "Enquire on WhatsApp"  |  Secondary: "Explore Nabeen®" (/nabeen)

## 3. Short brief (client copy, lightly trimmed)

Since 1995, D J Impex & Co. (DJI) has built lasting partnerships with clients, growing together with them. We offer premium fabrics with exceptional comfort and quality at affordable prices, and our expertise covers the full journey of textiles, from sourcing and manufacturing to supplying and trading.

Today we export under our brand Nabeen® to discerning markets across Africa and the Middle East. For our consistent export excellence, the Government of India has awarded D J Impex & Co. the status of Star Export House.

Link: "Read our story" → /about

## 4. Our exclusive collection
The same hover showcase that runs on /about, placed here on 2026-09-23.
Copy: about.md → "Collection lead", "Collection names", "Collection tail". It is
one sentence and it is NOT duplicated into this file, so the two pages cannot
drift apart. The showcase sets the lead as body text, so the section carries a
hidden heading for the outline rather than printing the same line twice.
Fabric photographs and descriptions are inside FabricHoverShowcase itself.

(The Fabric Journal moved off the home page on 2026-09-23 and lives at /journal.
Its own heading and strapline are on that page. Was: "The Fabric Journal" /
"Guides to choosing, judging and wearing fine fabric.")

## 5. Testimonials
Heading (client, brochure p.8): People love us, as much as we love serving them.
Data: site.json → testimonials. Rating and "2.37 million happy customers" are on HOLD. Do not show.

## 6. Gallery: World of Nabeen®
Heading: World of Nabeen®
Intro (proposed): A glimpse of the weaves, colours and finishes in the Nabeen range.
Images: assets/gallery/01-10. Two more needed for the 3 x 4 grid. Until then use a 2-slot "Request the full swatch range" tile that links to WhatsApp, so the grid still reads as 12.

## 7. Social cause (client copy)
Nabeen® contributes a percentage (%) of its profits to support child education in Nigeria. Every dollar you spend at Nabeen goes towards shaping a brighter future for Nigeria.
Link: "About Wear2Care" → /nabeen-x-ali-nuhu
Image: pending (real campaign photo only; never stock photos of children).

## Enquiry
PROPOSED, and an agency decision rather than a client one: this block replaces the social
cause block at the foot of the home page (2026-09-22, see docs/05-open-questions.md 71-73).
The social cause lives on at /nabeen-x-ali-nuhu, which the menu and the hero still link to.
The copy below is taken from contact.md on purpose, so enquiries have one voice across the
site. Change it here.

**Eyebrow:** Enquiries
**Heading:** Talk to the Nabeen team
**Intro:** Tell us which fabrics you trade in, your market and the quantities you need. We will reply on WhatsApp or email.
**Form heading:** Send an enquiry

## 8. Footer
- Nabeen logo (white) + "Luxury Fabrics by DJI"
- Menu links
- Contact: phone, email, address (site.json)
- Socials: Instagram, Facebook (Pinterest on hold)
- Tags (fabric keywords, link to /nabeen#fabric-slug): Giza Cotton, Swiss Lace, Atiku, Voile, Jacquard, Suiting, Wool
- Small print: © {year} D J Impex & Co. All rights reserved. Star Export House, Government of India.
