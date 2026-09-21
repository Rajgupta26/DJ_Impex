# 02 · Design system: "The Selvedge"

Open `design/style-guide.html` in a browser to see everything below rendered with real assets.
Tokens live in `design/tokens.css` (Tailwind v4 `@theme` block).

## The idea
A bolt of fine cloth carries its maker's name woven into the **selvedge**, the finished edge. That is where a buyer at a Kano counter looks to check whose cloth it is. This website does the same: it is framed like a bolt of Nabeen cloth, with the brand woven into its edges.

Everything else stays quiet, confident and tailored, so the fabric photography does the talking.

## Non-negotiables from the client
- Colours: **Navy #172850** and **White #FFFFFF**.
- Font: **Open Sans** (Normal).
- Portfolio, not e-commerce.

Note: the navy inside the supplied Nabeen logo file is #012350, slightly different from the spec #172850. Use #172850 everywhere (client spec) and use the transparent logo files in `assets/logos`, which carry no background colour.

## Colour

| Token | Hex | Role |
|---|---|---|
| Nabeen Navy | `#172850` | Brand. Main text colour on light backgrounds (not black). Primary buttons. |
| Midnight Loom | `#0D1733` | Footer, image overlays, selvedge band. |
| White | `#FFFFFF` | Main background. |
| Giza Mist | `#EEF1F6` | Alternating section background. A cool off-white, deliberately not cream. |
| Thread Slate | `#5A6680` | Secondary text, captions (5.6:1 on white). |
| Line | `#D5DBE6` | Hairlines, input borders. |
| Zari Gold | `#B8925A` | **Proposed** accent, named after zari thread. Thread-thin only: selvedge threads, focus ring, active carousel indicator, underline on text links. Never a fill, never body text. Confirm with Binoli; if rejected, swap for white at 60% and nothing else changes. |

Ratio guide per screen: roughly 60% white/mist, 35% navy, under 1% gold.

## Typography
One family: **Open Sans, variable font**, with both axes: weight (300-800) and **width (75-100)**. Load it with `next/font/google` and `axes: ['wdth']`.

The signature typographic move: **headlines use Open Sans at its condensed width (75%) and light weight (300)**. This gives a tall, tailored silhouette, like a well-cut agbada, while staying inside the brand font. Body text stays at 100% width for comfortable reading.

| Role | Size (fluid) | Weight | Width | Line height | Tracking |
|---|---|---|---|---|---|
| Display (hero only) | 48 → 112px | 300 | 75% | 0.95 | -0.02em |
| H1 | 40 → 76px | 300 | 75% | 1.02 | -0.015em |
| H2 | 32 → 56px | 300 | 80% | 1.08 | -0.01em |
| H3 | 22 → 30px | 600 | 87.5% | 1.25 | 0 |
| Lead | 18 → 22px | 400 | 100% | 1.55 | 0 |
| Body | 17px | 400 | 100% | 1.65 | 0 |
| Small | 14px | 400/600 | 100% | 1.5 | 0 |
| Selvedge | 12px | 600 | 75% | 1 | 0.32em, uppercase |

Rules:
- Body copy max line length **65 characters** (`max-width: 40rem`).
- **Sentence case everywhere.** The selvedge band is the only uppercase text on the site.
- No tracked-out uppercase "eyebrow" labels above headings.
- Do not colour or italicise a single word inside a headline for emphasis.
- The **®** mark is always wrapped: `<sup class="reg">®</sup>` in headings and body. Inside buttons, wrap the whole label in a `<span>` so flex gap does not split it.
- Numbers (1995, 1000+) use `.t-number`: light, condensed, tabular.

## The signature: the selvedge band
- A 36px navy band (`.selvedge`) with brand text woven into it: `Nabeen® / Luxury fabrics by DJI / Est. 1995 / Star Export House`, separated by small gold diamonds (not middle dots), framed top and bottom by dashed gold "threads".
- It appears **exactly twice**: along the bottom edge of the hero, and along the top edge of the footer. Like the two edges of a bolt of cloth. Do not use it anywhere else.
- The hero band drifts slowly (60s loop). The footer band is static. Both are static under `prefers-reduced-motion`. Both are `aria-hidden`.

## Secondary motif: the pinked swatch
- Gallery tiles have zig-zag top and bottom edges (`.swatch-pinked`), like cards in a swatch book cut with pinking shears.
- **Gallery only.** Nowhere else.

## Layout
- 12-column grid, max width 1312px, fluid gutters (20 → 48px).
- **Left-aligned, editorial.** Headings and text align left. Centre alignment only inside the popup and small empty states.
- Asymmetric splits (7/5, 5/7) for text + image sections. Avoid rows of identical cards.
- Generous vertical rhythm: 80px (mobile) → 160px (desktop) between sections.
- Alternate white and Giza Mist backgrounds to separate sections; avoid borders and card shadows.
- Photography has **square corners** (cut cloth). Buttons and inputs: 2px radius. Floating buttons: round.

Wireframe, home (desktop):
```
┌──────────────────────────────────────────────────────────┐
│ NABEEN®                 About  Vision  Nabeen®  … Contact│  ← transparent header over hero
│                                                          │
│   [full-bleed fabric photograph, navy veil from left]    │
│                                                          │
│   House of luxury                                        │
│   men's fabrics                         ▬ ▬ ▬ ▬ (slides) │
│   Woven in India since 1995…                             │
│   [Enquire on WhatsApp] [Explore Nabeen®]                │
├══════ NABEEN® ◆ LUXURY FABRICS BY DJI ◆ EST. 1995 ◆ …════┤  ← selvedge
│                                                          │
│  About (7 cols)                       │ 1995             │
│  Since 1995, D J Impex & Co…          │ 1000+ designs    │
│  [Read our story]                     │ Star Export House│
│                                                          │
│  The Fabric Journal   (1 large post + 2 stacked)         │
│  Testimonials         (one large quote at a time)        │
│  World of Nabeen®     (4 × 3 pinked swatch grid)         │
│  Wear2Care            (image left 6 / text right 6, navy)│
├══════ selvedge ══════════════════════════════════════════┤
│ footer (Midnight Loom)                                   │
└──────────────────────────────────────────────────────────┘                    (◉ WhatsApp)
                                                                                (◎ Directions)
```

## Motion
- **One orchestrated moment:** on first load, the hero headline rises line by line (900ms, ease-weave), then the selvedge starts drifting. That is the only choreographed entrance on the site.
- **Do not** add fade-and-slide-up reveals to every section. Content is simply there.
- Carousels crossfade (hero, 6.5s per slide, with a visible pause control) or slide (testimonials, user-driven plus slow autoplay that pauses on hover/focus).
- Motion that responds to the user is welcome: menu opening, popup appearing, accordion expanding, form states.
- Everything respects `prefers-reduced-motion`.

## Components (visual rules)
- **Header:** transparent with white logo over the hero; on scroll past the hero, becomes white with navy logo and a hairline bottom border. Mobile: logo + menu button; full-screen navy menu with large condensed links.
- **Buttons:** primary (navy fill), outline (navy border), on-dark (white fill). Text links: navy, 600 weight, gold 1px underline. No arrows appended to labels.
- **Trust marks:** set as a vertical list of big light numbers with small labels, with a single hairline on the left. Not badge icons.
- **Testimonial:** one large light quote at a time, gold left rule, name and role small below. Indicators are thin lines, not dots.
- **Journal cards:** image with square corners, category and reading time in small slate text, title in H3. No card background or shadow.
- **Popup:** white panel, navy 3px top rule, soft float shadow, dimmed navy backdrop (Midnight Loom at 60%).
- **Floating actions:** 56px circles, bottom-right, 16px from edges (plus safe-area inset). WhatsApp: navy with white glyph. Directions: white with navy pin. Tooltip label on hover (desktop).
- **Forms:** 46px inputs, 1px Line border, 2px radius, navy focus ring via gold `--focus-ring`. Labels above fields, never placeholders-as-labels.
- **Placeholders for missing images:** a Giza Mist block with a thin navy frame and centred small text "Image pending: {what}". Only visible when `NEXT_PUBLIC_SHOW_TODO=true`; otherwise render a plain navy gradient block so the client preview still looks intentional.

## Imagery direction
- Close, raking-light macro shots of fabric texture. Folded bolts. Hands handling cloth. Finished garments (agbada, senator, kaftan) worn in real settings in Nigeria.
- Cool, natural light. Avoid warm filters that fight the navy.
- **Never** use stock photos of children for the education cause. Real campaign photos only.
- The manufacturing images in the kit are small and partly stock: use only as small step thumbnails.

## Self-check before calling any page done
1. Is there any uppercase text outside the selvedge? Remove it.
2. Does any section use a fade-up entrance? Remove it.
3. Is gold used as a fill or for text? Replace it.
4. Are there rows of identical rounded cards with shadows? Rework the layout.
5. Is the ® mark rendering full-size anywhere? Wrap it.
6. Remove one decorative element from the page. Does it look better? Keep it removed.
