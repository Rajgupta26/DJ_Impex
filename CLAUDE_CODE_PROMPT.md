# Claude Code prompt: Nabeen® / D J Impex & Co. website

Paste everything between the two lines into Claude Code, from the `nabeen-website/` folder.

---

You are the lead front-end engineer and design lead building the new website for **Nabeen®**, the luxury fabric brand of **D J Impex & Co. (DJI)**, a Mumbai textile exporter founded in 1995 with Government of India "Star Export House" status. Nabeen sells mainly to fabric traders, retailers and tailors in Nigeria (Kano, Lagos, Abuja) and the Middle East.

This is a **premium portfolio website, not an online shop**. There must be no cart, no prices, no checkout and no accounts. Its job is to make Nabeen look unmistakably premium and trustworthy, show the fabric range, tell the brand's child-education story, and turn visitors into WhatsApp chats, calls and enquiries.

The site must look and feel **premium**: quiet, confident, tailored, with generous space and beautiful fabric photography. Think of a fine tailoring house, not a template.

## 1. Read the brand kit first

Everything you need is in this repo. Before writing any code, read these files in full:

1. `CLAUDE.md` (standing rules; follow them for the whole project)
2. `brand-kit/docs/01-project-brief.md`
3. `brand-kit/docs/02-design-system.md` (the visual system, "The Selvedge". Follow it exactly.)
4. `brand-kit/docs/03-pages-and-features.md`
5. `brand-kit/docs/04-seo-performance-accessibility.md`
6. `brand-kit/docs/05-open-questions.md`
7. `brand-kit/content/site.json` and every file in `brand-kit/content/`
8. `brand-kit/design/tokens.css` and `brand-kit/design/style-guide.html` (the visual reference: match its look)
9. `brand-kit/assets/ASSETS.md`

Then reply with a short build plan: the folder structure you will create, the libraries you will install and why, and anything in the kit you think is contradictory. Then start building immediately; do not wait for approval of the plan.

## 2. Non-negotiable rules

- **Facts:** use only facts from `brand-kit/content`. Never invent statistics, dates, names, product specs, testimonials or quotes. Respect each fact's `status` in `site.json` (`confirmed` = use; `tbc` = use with a dev-only TBC tag; `hold` = never render). The company was founded in **1995**, not 1998.
- **Brand:** Navy `#172850` and White are the brand colours; Open Sans is the brand font. Use the extended palette and type scale from the design system and nothing else.
- **Design discipline:** sentence case everywhere (the selvedge band is the only uppercase text); no uppercase eyebrow labels; no fade-and-slide-up animation on every section; no grids of identical rounded cards with drop shadows; no arrows appended to button labels; no emoji; gold only as a thread-thin accent. Wrap every ® as `<sup class="reg">®</sup>`.
- **Accessibility:** WCAG 2.2 AA. Keyboard navigable, visible focus, reduced motion respected, proper dialog semantics.
- **Performance:** built for mid-range Android phones on mobile data in Nigeria. Lighthouse mobile targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.

## 3. Tech stack

- Latest stable **Next.js** (App Router), **TypeScript** in strict mode, **React Server Components** by default.
- **Tailwind CSS v4**, with `brand-kit/design/tokens.css` imported into `app/globals.css` right after `@import "tailwindcss";` so the `@theme` tokens become utilities.
- **Open Sans** via `next/font/google` as a variable font with the width axis: `Open_Sans({ subsets: ['latin'], axes: ['wdth'], variable: '--font-open-sans', display: 'swap' })`.
- **Embla Carousel** for the hero and testimonial carousels.
- **MDX** for the journal: read `brand-kit/content/journal/*.mdx` with `gray-matter` + `next-mdx-remote/rsc` (or `@next/mdx` if simpler), with `reading-time` for read times.
- **Zod** for content schemas and form validation.
- **Resend** for sending enquiry emails from a Server Action (env vars `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`). If they are missing, log the payload in development and show the WhatsApp fallback.
- **Motion** (`motion/react`) only for the hero reveal and the popup/menu transitions. Prefer CSS for everything else.
- `lucide-react` for UI icons. Use an inline SVG for the WhatsApp glyph.
- `@vercel/analytics` for page views and custom events.
- Deploy target: Vercel.

Because the repo root already contains `CLAUDE.md` and `brand-kit/`, `create-next-app` may refuse to run in `.`. Scaffold into a temporary folder (e.g. `_scaffold`), move its contents into the root, and delete the temporary folder. Use the `src/` directory layout, the `@/*` import alias and ESLint. Add `typecheck` (`tsc --noEmit`) and `format` (Prettier) scripts.

## 4. Architecture

```
src/
  app/
    layout.tsx                 # fonts, metadata base, Organization JSON-LD, header, footer, floating actions, popup, analytics
    page.tsx                   # home
    about/page.tsx
    vision/page.tsx
    nabeen/page.tsx
    nabeen-x-ali-nuhu/page.tsx
    journal/page.tsx
    journal/[slug]/page.tsx    # generateStaticParams from MDX files
    contact/page.tsx
    _todo/page.tsx             # dev-only checklist of tbc/hold facts and pending images; notFound() in production
    not-found.tsx
    sitemap.ts
    robots.ts
    opengraph-image.tsx        # branded OG image; also per-route where useful
    icon.png, apple-icon.png   # generated from the Nabeen logo
  components/
    layout/      Header, MobileMenu, Footer, Selvedge, SkipLink, EnquiryBand
    home/        HeroCarousel, BriefSection, JournalPreview, TestimonialsCarousel, NabeenGallery, CauseSection
    ui/          Button, TextLink, Container, Section, PageHero, TrustMarks, Reg (®), TbcTag, ImagePlaceholder, Tabs/Accordion
    contact/     EnquiryForm, ContactPopup, FloatingActions, ContactChannels, MapEmbed (click-to-load)
    journal/     PostCard, PostBody (MDX components styled to the design system)
  lib/
    content.ts   # typed loaders for site.json, page markdown and MDX posts (Zod-validated at build time)
    contact.ts   # whatsappLink(prefill?), telLink(), mailtoLink(), directionsLink(): the ONLY place contact URLs are built
    analytics.ts # track(event, props)
    seo.ts       # metadata + JSON-LD helpers
  styles/ (if needed)
public/images/   # copied from brand-kit/assets (logos, gallery, manufacturing, brand-imagery)
```

Content must be read from `brand-kit/content` at build time. Never copy facts into components. If a content file changes, the site changes.

## 5. Build phases

Work through these phases in order. After each phase: run `npm run lint`, `npm run typecheck` and `npm run build`, fix every error, then commit with a clear message. **After Phase 1, stop and give me a summary** of what you built, how to view it, and any decisions you made. I will reply "continue" for the next phases.

### Phase 0: Setup
- Scaffold the project as described. Install the stack.
- Copy `brand-kit/assets/{logos,gallery,manufacturing,brand-imagery}` into `public/images/`.
- Wire up `tokens.css`, Open Sans with the `wdth` axis, and base styles. Confirm condensed headlines actually render condensed (check that `font-stretch: 75%` changes the glyph width).
- Build `lib/content.ts` with Zod schemas for `site.json` and the MDX frontmatter, and `lib/contact.ts`.
- Add `.env.example` with every env var and `NEXT_PUBLIC_SHOW_TODO=true`.

### Phase 1: The shell (shared across every page)
- **Header:** transparent with the white logo over page heroes, turning white with the navy logo and a hairline border after scrolling past the hero. Menu items and order from `site.json`. On mobile: logo + menu button opening a full-screen Midnight Loom menu with large condensed links, contact shortcuts and focus trapping.
- **Selvedge band** component exactly as specified (hero-bottom variant drifts slowly; footer variant is static; both `aria-hidden`; static under reduced motion).
- **Footer** on Midnight Loom with the selvedge along its top edge: logo, short line, menu, contact block, social links (respect statuses: Pinterest is on hold), fabric tags linking to `/nabeen#{slug}`, and small print.
- **Floating actions:** WhatsApp + Directions, on every page, per the spec.
- **Contact popup:** 5 seconds after load, once per session, never on `/contact`, bottom sheet on mobile, fully accessible.
- **Enquiry form** component (full and short variants) with Zod validation, honeypot, Server Action, Resend, and all four states.
- **UI primitives:** Button (primary / outline / on-dark), TextLink, Container, Section (white / mist / navy), PageHero, TrustMarks, Reg, TbcTag, ImagePlaceholder, EnquiryBand.
- A temporary home page that shows the shell working.

**Stop here and summarise.**

### Phase 2: Home page
Build every section in the client's exact order from `brand-kit/content/home.md`:
hero carousel → brief + trust marks → The Fabric Journal (3 posts) → testimonials carousel → World of Nabeen® gallery (4 × 3 pinked swatch grid; the two missing tiles become one wide "See the full range" tile that opens WhatsApp) → Wear2Care cause section → footer.
The hero gets the site's one orchestrated motion moment: the headline rises line by line on first load, then the selvedge begins to drift. Hero carousel: crossfade, 6.5s per slide, visible pause button, only the first image loaded eagerly.

### Phase 3: Inner pages
About, Our Vision, Nabeen®, Nabeen x Ali Nuhu, Contact, using the content files and the layout notes in `03-pages-and-features.md`. Each inner page uses the shorter PageHero and ends with the EnquiryBand (except Contact). On Nabeen®, each fabric type has an anchor id and an "Enquire about {fabric}" action that opens WhatsApp with the fabric named in the prefilled message. The Signature lines use accessible tabs on desktop and an accordion on mobile.

### Phase 4: The Fabric Journal
Listing page and article template. MDX components styled to the design system (condensed light H2s, 65ch measure, pull quotes with the gold rule). Reading time, category, date (show dates only when `dateStatus` is not `tbc`, or tag them). "More from the journal" and internal links to the relevant fabric on `/nabeen`.

### Phase 5: SEO, analytics, quality
Metadata and Open Graph for every route, per-page OG images, sitemap, robots, JSON-LD (Organization site-wide, Article + BreadcrumbList on posts; LocalBusiness only once the address is confirmed). Analytics events: `whatsapp_click` (with location), `directions_click`, `call_click`, `email_click`, `enquiry_submit`, `popup_open`, `popup_dismiss`. The `/_todo` page. Then run Lighthouse (mobile) on the home page, Nabeen and a journal post, fix everything below target, and report the scores.

### Phase 6: Premium polish pass
Go through every page at 390px, 768px, 1280px and 1600px wide and critique it as a demanding luxury-brand art director would:
- Is the spacing generous and consistent? Are line lengths comfortable?
- Does anything look templated or generic? Rework it.
- Run the self-check list at the end of `02-design-system.md` on every page.
- Remove one decorative element from each page if the page is better without it.
- Check every image crop at every breakpoint.
If you can take screenshots (e.g. via Playwright), use them to review your own work.

## 6. Definition of done
- All routes built, content loaded from `brand-kit/content`, no invented facts, no `hold` items visible.
- Popup, floating buttons, carousels, form and mobile menu work with keyboard and touch.
- `npm run lint`, `npm run typecheck` and `npm run build` pass with zero errors and zero warnings you have not explained.
- Lighthouse mobile targets met and reported.
- A `README.md` that explains how to run the project, where to edit content (`brand-kit/content`), the env vars, how the TBC/hold system works, and how to deploy to Vercel.
- `brand-kit/docs/05-open-questions.md` updated with anything new you discovered.

Begin by reading the brand kit.

---

## Follow-up prompts (use after the summaries)

- `continue with phase 2`
- `continue with phase 3` (and so on)
- When the client sends new images: `New images are in brand-kit/assets/incoming. Rename them descriptively, move them to the right folders, update ASSETS.md, and replace the placeholders they fill. Tell me which placeholders are still pending.`
- When the client answers questions: `The client answered these questions: [paste]. Update site.json statuses and content files, remove the answered items from 05-open-questions.md, and check every page still builds.`
- For a review: `Do a premium design review of [page] at 390px and 1440px against 02-design-system.md. List the ten weakest details, fix them, and show me before/after.`
