Responsive verification — 30 September 2026

The existing Nabeen / DJ Impex design now adapts to phones and tablets. Brand colors, typography family, copy, sections, photography, video, collections, and contact features are retained. Desktop hero geometry and navigation were visually compared at 1440px. Full navigation appears from 1280px; narrower screens use the existing menu.

The implementation uses shared mobile typography, gutters, section spacing, and responsive utilities. Global horizontal overflow clipping was removed. Reveal offsets now use responsive CSS variables, so the server-rendered start positions fit phones before hydration. Intentional image masks, carousel viewports, and collection tab scrollers remain local to their components.

| PAGE | ISSUE FOUND | MOBILE SIZE | CHANGE MADE | RESULT |
| --- | --- | --- | --- | --- |
| Home / | Oversized headings and gaps, four tall statistics stacked vertically, hero content constrained by viewport height | 320–480px; 600–912px tablets | Shared compact type and spacing; flexible hero; stacked actions; two-column statistics; smaller logo animation | Content fits; all statistics remain visible after their first reveal, including reduced motion |
| Home collection | Hover-only interaction and oversized fabric presentation | 320–480px; tablets | Readable touch tabs, 44px targets, keyboard arrow/Home/End navigation, legible image captions | All seven fabric options respond correctly |
| Home gallery, testimonials, contact | Hover-only fabric labels, narrow contact text, small quote controls, excessive spacing | 320–480px | Visible phone labels, wrapped contact details, larger quote controls, compact form/card spacing | Five quote controls work; gallery and contact content fit |
| About /about | Large welcome spacing and horizontal reveal overflow | 320–480px; tablets | Responsive heading wrapping, reduced spacing, bounded reveal offsets, compact pillar grid | No horizontal overflow; all five pillar headings and descriptions reveal |
| Nabeen /nabeen | Large introduction and value blocks; tall portrait film before explanatory text; clipped product names | 320–480px; tablets | Smaller introduction/values, text before film on compact screens, bounded portrait film, wrapped product names | Four collections work; portrait media retains its proportions |
| Wear2Care /nabeen-x-ali-nuhu | Paragraph reveals extended beyond narrow screens; donation slot fallback used a missing filename | 320–480px; tablets | Responsive reveal offsets and corrected default donation image path | Text fits; no broken rendered images |
| Journal /journal | Featured image/card proportions were heavy on phones | 320–480px | Shallower phone image aspect ratio and shrinkable card text | Cards fit and retain existing desktop composition |
| Journal /journal/best-mens-lace-fabrics-in-nigeria-2026 | Large article gaps and reveal offsets | 320–480px; tablets | Compact article spacing, responsive reveal offsets, smaller related-article gaps | Article and related cards fit |
| Journal /journal/how-to-identify-high-quality-lace-fabric | Article paragraphs extended horizontally before reveal | 320–480px; tablets | Bounded initial reveal positions and shrinkable prose columns | No horizontal overflow |
| Journal /journal/swiss-lace-complete-guide-for-african-fashion | Article spacing and heading scale too large for phones | 320–480px; tablets | Shared responsive article typography and spacing | Content fits |
| All public pages: header, menu, footer, language selector | Crowded navigation, overflowing dropdown placement, long contact text, limited menu height | 320–480px; tablets and 1024px | Scrollable viewport-height menu, navigation-first focus, responsive language dropdown, wrapped footer details, footer space for floating action | Menu/Escape/focus and language search work; popup bounds checked |
| Welcome and WhatsApp dialogs | Short-screen clipping; WhatsApp country selector could widen the form | 320×568, 390×667, 430×932, 844×390, 1024×600 | Viewport height limits, internal scrolling, fixed one-column form grid, bounded country selector, larger touch targets, welcome waits for other overlays | Controls fit; dialog scroll remains usable |
| Admin /admin/images | Small controls and potentially long image metadata | 320–480px; tablets | Larger shared buttons, wrapping metadata, responsive shared dialog | Image manager fits |
| Admin /admin/blogs | Long slugs and cover controls could overflow; editor could exceed short screens | 320–480px; 844×390 landscape | Wrapped slugs, stacked phone cover row, wrapping actions, scrollable dialog body with fixed header | New and existing editors fit; no records saved |
| Admin /admin/enquiries | Small controls and narrow management layout | 320–480px; tablets | Shared 44px controls, readable inputs, responsive navigation and dialog system | List fits; unread entries were not opened |
| Admin /admin/page-images | Long management page and modal constraints | 320–480px; tablets | Shared responsive inputs, navigation, buttons, and modal | Page fits; slot data was not edited |
| Admin /admin/nabeen-collection | Truncated product labels and search accessibility | 320–480px; tablets | Wrapped labels, labeled search, shared controls/dialog | Names remain readable |
| Admin /admin/wear2care | Small controls and phone navigation constraints | 320–480px; tablets | Shared responsive admin shell, touch controls, and dialogs | Page fits; no content saved |

Pages tested: the 14 main routes listed above, including all three published journal articles. Redirects /contact → /#contact, /vision → /about, and /admin → /admin/images were checked. Public/admin unknown routes and the unavailable /_todo route returned their expected 404 pages.

Widths tested across every major page:

- Mobile: 320, 360, 375, 390, 393, 412, 414, 430, 480px.
- Tablet: 600, 768, 820, 912, 1024px.
- Desktop: 1024, 1280, 1366, 1440, 1536, 1920px.
- The union is 19 widths × 14 routes = 266 checks per full matrix.
- Additional heights and landscape: 320×568, 390×667, 390×844, 430×932, 844×390, and 1024×600.
- Edge/Chromium was used for actual renders, touch emulation, normal motion, reduced motion, screenshots, console/runtime inspection, image checks, and overflow measurement. Overflow measurements were also taken with body/root masking disabled.

Verification results:

- Production build passed in an isolated copy, preserving the user's existing development server.
- TypeScript checking passed.
- The complete production width matrix found no accidental horizontal overflow, broken loaded images, or visible phone/tablet inputs below 16px.
- No application runtime exceptions were recorded.
- Collection tabs, signature collection switching, testimonial selection, menu focus/Escape, language search/Escape, contact deep links, and short-screen public/admin dialogs were exercised.
- The reduced-motion statistics correction passed a focused production regression at all 19 widths after the complete width matrix. Both normal and reduced motion keep the cards visible after scrolling away. Real touch navigation restored page scrolling, WhatsApp option buttons measured 44px high, and error pages fit at 320, 768, and 1440px.
- Existing application data, environment settings, dependencies, and backend endpoints were not changed by this responsive work.

Remaining limitations:

- ESLint still reports the pre-existing 12 errors and 17 warnings, principally in LanguageSelector's translation state/cookie handling and unused declarations. The initial and post-change totals matched.
- Local Vercel Analytics requests return 404 because the isolated server is not hosted on Vercel. Test interception intentionally blocked POST requests, including Google Maps/Translate logging; navigation also canceled pending prefetch/video requests. These were separated from application runtime failures.
- Physical iOS/Android devices, Safari/Firefox, live translation service results, email/WhatsApp delivery, admin writes, and a deployed production URL were not verified. Browser testing did not send messages or save client data.

Files changed for this responsive pass (existing unrelated work was preserved):

- [src/app/(site)/journal/[slug]/page.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/app/(site)/journal/[slug]/page.tsx)
- [src/app/(site)/nabeen/page.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/app/(site)/nabeen/page.tsx)
- [src/app/globals.css](C:/Users/aksha/Desktop/DJ_Impex/src/app/globals.css)
- [src/components/about/FabricHoverShowcase.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/about/FabricHoverShowcase.tsx)
- [src/components/about/WelcomeAnimated.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/about/WelcomeAnimated.tsx)
- [src/components/about/WelcomeSection.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/about/WelcomeSection.tsx)
- [src/components/admin/AdminShell.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/admin/AdminShell.tsx)
- [src/components/admin/BlogManager.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/admin/BlogManager.tsx)
- [src/components/admin/ImageManager.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/admin/ImageManager.tsx)
- [src/components/admin/NabeenCollectionManager.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/admin/NabeenCollectionManager.tsx)
- [src/components/admin/ui.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/admin/ui.tsx)
- [src/components/contact/ContactChannels.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/contact/ContactChannels.tsx)
- [src/components/contact/ContactPopup.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/contact/ContactPopup.tsx)
- [src/components/contact/EnquiryForm.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/contact/EnquiryForm.tsx)
- [src/components/contact/FloatingActions.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/contact/FloatingActions.tsx)
- [src/components/contact/WhatsAppModal.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/contact/WhatsAppModal.tsx)
- [src/components/home/BriefAnimated.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/home/BriefAnimated.tsx)
- [src/components/home/BriefSection.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/home/BriefSection.tsx)
- [src/components/home/ContactSection.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/home/ContactSection.tsx)
- [src/components/home/HeroCarousel.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/home/HeroCarousel.tsx)
- [src/components/home/NabeenGallery.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/home/NabeenGallery.tsx)
- [src/components/home/StatBoxes.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/home/StatBoxes.tsx)
- [src/components/home/TestimonialsCarousel.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/home/TestimonialsCarousel.tsx)
- [src/components/journal/JournalArticleAnimated.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/journal/JournalArticleAnimated.tsx)
- [src/components/journal/JournalFeatureGrid.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/journal/JournalFeatureGrid.tsx)
- [src/components/layout/Footer.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/layout/Footer.tsx)
- [src/components/layout/Header.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/layout/Header.tsx)
- [src/components/layout/MobileMenu.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/layout/MobileMenu.tsx)
- [src/components/layout/OverlayContext.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/layout/OverlayContext.tsx)
- [src/components/layout/Preloader.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/layout/Preloader.tsx)
- [src/components/nabeen/AliNuhuGivesBack.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/nabeen/AliNuhuGivesBack.tsx)
- [src/components/nabeen/NabeenIntro.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/nabeen/NabeenIntro.tsx)
- [src/components/ui/BrandFilm.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/ui/BrandFilm.tsx)
- [src/components/ui/ExploreNabeenCTA.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/ui/ExploreNabeenCTA.tsx)
- [src/components/ui/LanguageSelector.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/ui/LanguageSelector.tsx)
- [src/components/ui/PageHero.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/ui/PageHero.tsx)
- [src/components/ui/SignatureLines.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/ui/SignatureLines.tsx)
- [src/components/vision/VisionBanner.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/vision/VisionBanner.tsx)
- [src/components/vision/VisionPillars.tsx](C:/Users/aksha/Desktop/DJ_Impex/src/components/vision/VisionPillars.tsx)
- [src/lib/slots.ts](C:/Users/aksha/Desktop/DJ_Impex/src/lib/slots.ts)
- [src/lib/useFocusTrap.ts](C:/Users/aksha/Desktop/DJ_Impex/src/lib/useFocusTrap.ts)
- [src/lib/useMediaQuery.ts](C:/Users/aksha/Desktop/DJ_Impex/src/lib/useMediaQuery.ts)

Browser evidence: [production width matrix](C:/Users/aksha/AppData/Local/Temp/dj-responsive-after/production-verified-matrix.json), [final focused check](C:/Users/aksha/AppData/Local/Temp/dj-responsive-after/final-focused-check.json), [completed phone preview](C:/Users/aksha/AppData/Local/Temp/dj-responsive-after/home-completed-390-full.png), and [statistics preview](C:/Users/aksha/AppData/Local/Temp/dj-responsive-after/statistics-completed-390.png). Further tablet/desktop and short-screen dialog captures are saved alongside them.
