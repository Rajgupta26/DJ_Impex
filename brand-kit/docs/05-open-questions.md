# 05 · Open questions for the client (send via Binoli)

Build with the current defaults (in brackets). Nothing here blocks the skeleton.

## Facts that conflict between sources
1. **Product structure.** About Nabeen PDF has 4 lines (Classic, Royale, Luxuré, #White). The 2023 brochure has 9 pairs (Luxe & Delicacy, Trident & Majesty, Giza & Hausa…). Instagram lists fabric types. Which is current, and where does Zürique sit? [Default: browse by fabric type + 4 lines as tabs]
2. **Address.** B-90, 2nd Building, Gopal Gully (Facebook, prototype) or 355, Mangaldas Mkt, 7th New Lane (brochure)? [Default: B-90]
3. **WhatsApp number.** +91 98196 93626 or +91 98193 41904? [Default: 98196 93626]
4. **Google rating.** 4.8 (brochure) or 4.9 (About Nabeen PDF)? Link to the live listing? [Default: hidden]
5. **"2.37 million happy customers\*".** What does the asterisk mean? [Default: hidden]
6. **Percentage donated** to child education. Can we state a number? [Default: "a percentage"]

## Missing content
7. Hero carousel images (3-4, landscape, high resolution).
8. Original high-resolution files of the 10 brochure fabric photos, plus 2 more fabrics for the 12-tile gallery.
9. Ali Nuhu campaign photos and approved quote (the prototype's quote is unverified).
10. Real photos of the Wear2Care / education work.
11. Real factory / process photos (brochure ones are small and partly stock).
12. Testimonial names/roles/cities for the 4 brochure quotes, plus 1-2 more.
13. The reference images mentioned in the Home Page Format (company brief, journal section, contact popup).
14. Pinterest account link, or approval to drop it.
15. Publication dates and author name for the journal posts.

## Decisions
16. Zari gold accent: approve, or keep strictly navy and white?
17. Which email should receive enquiries? Show djimpex479@gmail.com publicly or only ceo@djimpex.in?
18. Response-time promise on the form ("within one working day")?
19. Should the client be able to publish journal posts themselves (then we add a CMS), or will we publish for them?
20. Analytics: Vercel Analytics or Google Analytics?
21. Domain: point djimpex.in at the new site at launch? Who has the DNS login?
22. Blog title: rename "Complete Guide for African Fashion" to "Swiss Lace Fabric: A Complete Guide for African Fashion" (matches its content, better for search)?

## Prototype claims to remove unless confirmed
"Since 1998" and "27 years" (wrong: founded 1995), "14 export markets", "1.2M metres shipped a year", "100% piece-inspected", Zürique specs (100% cotton, 52", 310 gsm, numbered 5-yard panels, seasonal release), the "never a middleman" story, the Craft step details (Nile delta, rapier looms, Nhava Sheva), the named testimonials, emails trade@ and nabeen@djimpex.in, the Accra/Makola route.

## Found during the build (Phase 0-1)

23. **Footer fabric tags.** `content/home.md` lists seven tags (Giza Cotton, Swiss Lace, Atiku, Voile, Jacquard, Suiting, Wool) but `site.json.fabricTypes` has six slugs, with Voile and Jacquard combined into one. The footer uses the six slugs so every tag deep-links to a real anchor on /nabeen. Confirm whether Voile and Jacquard should be split into two fabrics. [Default: six, combined]
24. **WhatsApp number status.** `contact.phonePrimary` is `confirmed` but `contact.whatsapp` (the same number) is `tbc`. The floating WhatsApp button is a client requirement, so it is rendered; the TBC tag appears only where the number is shown as text. Confirm the number is on WhatsApp. [Default: render it]
25. **Group-level tbc.** `fabricTypes` and `signatureLines` are marked `tbc` at the group level, yet the Nabeen page is built entirely from them. One TBC tag is shown per section rather than one per item, so the page stays readable. [Default: one tag per section]
26. **Gallery tile count.** `home.md` asks for a two-slot "Request the full swatch range" tile; the style guide labels the same tile "See the full range". The build uses the style guide's label. Confirm the wording. [Default: "See the full range"]
27. **Response-time promise.** The form's success message says "shortly", not "within one working day", until the client confirms a response time (question 18).
28. **Trust mark typography.** The style guide sets a short lead word large ("Star" over "Export House, Govt. of India"). "Make in India" has no natural lead word, so it is set whole. Confirm this reads correctly.
29. **Journal dates.** All three posts carry `publishedAt: 2026-09-21` with `dateStatus: tbc`, so all three sort identically. Real publication dates are needed (question 15) before the listing order means anything.

## Found during the build (premium UI pass)

30. **Brand navy vs logo navy.** The client's logo file is #012350; the brand docs specify #172850. Confirmed with the team: the site uses **#172850** everywhere, per the written spec. The square logo therefore stays very slightly deeper than the site's navy.
31. **Gold as text.** 02 and 04 both say gold is never used for text, but `style-guide.html` sets the footer column labels in Zari Gold. Measured: gold on Midnight Loom is 6.15:1 and on navy 5.01:1 (both pass AA), while gold on white is 2.88:1 (fails). The build follows the style guide: small gold labels on dark grounds only, never on light ones. Confirm.
32. **Values on the Nabeen page.** `nabeen.md` says to render the values "as three words set large" but the source line holds six (Honesty, Integrity, Human dignity / Trust, Quality, Excellence). The build sets Trust, Quality and Excellence large and reads the first three as a sentence, since middle dots are not allowed. Confirm which triad should be large.
33. **Pending photography is drawn, not stock.** Where the client has not sent an image (hero slide 3, the Ali Nuhu portrait, the Wear2Care panel) the site draws the weave in SVG in brand navy rather than using stock photography. Replace each with a real photograph as it arrives; `/_todo` lists them.
34. **Prototype copy stays out.** The reference site at djimpex.vercel.app was reviewed for art direction only. Its facts (1998, 27 years, 14 export markets, 1.2M metres, 100% piece-inspected, the Zürique specs, the named testimonials, the Ali Nuhu quote) remain unused, per CLAUDE.md rule 4.

## Hero and imagery (build note)

35. **Hero sources are upscaled.** `fabric-blush-stripe-macro.jpg` is 1189x1679, a portrait. `/public/images/hero/*.jpg` are 16:9 crops resampled to 2000x1125 and sharpened at build time (see the note in `src/app/page.tsx`). They hold up to about 1600px wide. Real landscape hero photography at 2400px or more is still needed (question 7) before launch.
36. **Gallery scans are not used large.** ASSETS.md marks the 480px brochure fabric photographs as tile-sized. Inner-page heroes therefore draw the weave instead of upscaling one across a full-bleed band. Swap to photography when the high-resolution originals arrive (question 8).
37. **Hero legibility depends on the photograph.** The veil is deliberately light so the cloth reads, with the scrim weighted into the bottom-left corner where the words sit. A hero image that is bright in that corner will need its crop adjusting. Re-check when the client's own hero images land.
38. **DJI mark placed.** `dji-logo-transparent.png` now appears on the About page beside Recognition, and in the footer small print, per ASSETS.md. On the Midnight Loom footer the mark's dark triangles read as a quiet watermark; confirm the client is happy with that, or supply a white version.

## Story scroll and film

39. **The film file.** The client's Marconi reel (facebook.com/reel/1400076468857662) is on the Nabeen page as a full-bleed film band, but Facebook only serves it behind a login and a copy pulled off the platform would be re-encoded and watermarked. **Ask Binoli for the source MP4 and a poster still**, and drop them in `brand-kit/assets/video/` then `public/video/`. Filenames are set in `site.json` under `brandFilm`. Until they land the band renders drawn cloth.
40. **The film's caption is the client's own Facebook copy**, recorded in `site.json.brandFilm` with `status: tbc`. Confirm it may be used on the site as written, and confirm the section heading "Not all whites are made equal" (proposed, drawn from their caption).
41. **Story chapter labels are proposed.** `about.md` now carries "The beginning / The craft / Today" under `## Story chapters`, purely as labels; the client's story copy is unchanged and only grouped beneath them. Ask whether they would rather write their own chapter titles.
42. **No counters yet.** The Siyaram reference ends its story section with eight animated statistics. We have only two usable numbers (1995 and 1000+ designs) because the Google rating and the "2.37 million happy customers" figure are on hold (questions 4 and 5). The trust marks cover these for now; a counter row needs those answers first.

## Marconi reel frames

43. **The hero now opens on Marconi.** Four 1440x1440 frames from the client's reel were recovered from a saved copy of the Facebook page and are in `brand-kit/assets/incoming/reel-frames/`. One is cropped to `public/images/hero/marconi-white.jpg` and opens the home hero. They are frames from a compressed reel, not photographs: **ask for the original stills**, which will be sharper.
44. **The Swiss Cotton mark is cropped out.** Three of the four frames carry a "SWISS cotton" certification logo laid over the cloth. That is a third-party certification claim and it is not in the brand kit, so the hero crop deliberately sits below it. Confirm whether Nabeen holds Swiss Cotton certification and whether the client wants the mark shown; if so it belongs in `site.json` as a fact with a source, not as a detail inside a photograph.
45. **The hero is already wired for the film.** Once the MP4 lands in `public/video/`, the first hero slide becomes the video automatically, with `marconi-white.jpg` as its poster. No code change needed. It is muted, loops, carries `preload="none"`, starts only while its slide is showing, and obeys the hero's existing pause button.

## The film, once supplied

46. **Received.** The Marconi MP4 arrived: 720x1280 (9:16), 21.5s, H.264 + AAC, 4.5 MB. Questions 39 and 45 are closed. It plays on the home hero and on the Nabeen page.
47. **It is vertical, so the hero is now a split.** A 9:16 film cannot be cropped into a landscape hero without losing three quarters of the frame, cutting the burned-in wordmark off the top, and upscaling what survives. From 1024px up the film stands as a panel on the right with the words on navy to the left; below that it fills the hero, where 9:16 fits a phone exactly. This departs from the full-bleed hero in the style guide wireframe, which was drawn for a photograph. **Worth showing Binoli.**
48. **Ask for a smaller encode.** 4.5 MB at 1661 kbps is heavy for a buyer in Kano on mobile data. A 720p encode at roughly 900 kbps would about halve it with no visible loss at the size we display. The site already declines to load it under Data Saver or on 2G/3G, but a lighter file helps everyone else.
49. **A landscape cut, if one exists**, would let the hero run full-bleed as originally drawn.
50. **The film carries a burned-in NABEEN wordmark** top-right, which sits near the site header's own logo on the hero. Confirm the client is happy with both showing, or ask for a clean version.

## Client-directed changes

51. **The hero is one slide.** At the client's request only the first hero slide renders. The copy for slides 2, 3 and 4 is untouched in `content/home.md`; restoring them is a one-line change in `src/app/page.tsx` (drop the `.slice(0, 1)`).
52. **The film fills the hero.** Asked for full screen rather than a panel, so a 9:16 film is shown through a landscape frame and its middle band is what you see. It crops the burned-in wordmark clear of the header, which reads better, but it also upscales 720px across a wide screen, so the film is softer on a large monitor than it was in the panel. A landscape cut (question 49) would remove the trade-off entirely.
53. **"Home" added to the navigation.** It is now the first item in `site.json.navigation`, so it appears in the header and the footer. The client's stated menu order did not include it; the logo already linked home.
54. **The story chapters pin.** Rebuilt to match the reference: each chapter holds still for about 700px of scrolling, then releases as the next arrives and pins in the same place. Done with `position: sticky` rather than a scroll library, so it adds nothing to the page weight. Pinning applies from 1024px up only; below that there is not enough height to hold a chapter still and still show it, so chapters stack and scroll. Under `prefers-reduced-motion` they stack at every width.

55. **`overflow-x: hidden` on `body` was breaking every sticky element on the site.** It makes the body a scroll container, and a sticky descendant then has no scrollport to stick within. It is now `overflow-x: clip`, which contains overflow without creating a scroll container. Worth remembering before anyone adds it back.

56. **The dissolve was the missing half of the story scroll.** Measured on the reference site: a chapter pins and its opacity runs 1 to 0 across the hold, so the next chapter rises into its place instead of sliding over a still-solid one. Pinning on its own reads as a stalled page. Ours now follows the same curve.
57. **Composition now matches the reference, which means a documented deviation.** Each chapter is a centred column — kicker, title, paragraph, then the cloth drawn large beneath — like Siyaram's. `02-design-system.md` says "Left-aligned, editorial... Centre alignment only inside the popup and small empty states", so this section is a deliberate exception, made on the client's instruction to match the reference exactly. **Worth showing Binoli**, since it is the one centred block on the site.

## Story illustrations

58. **The two pencil drawings offered for the story chapters are Siyaram's own**, lifted from their website: the spinning frame is their "The Beginning" plate and the rolled bolt is their "The Rise" plate. They are a direct competitor's copyrighted artwork and are not on the site. If the client wants illustration of that quality, commission it, or brief an illustrator against these three subjects.
59. **The chapters now carry original line drawings** in `src/components/about/StoryIllustration.tsx`: a spinning frame for the founding, a rolled bolt for the craft, and folded lengths for the cloth as it ships. Drawn as SVG, about 2KB, sharp at any size, and Nabeen's own. The bolt's falling cloth is finished with the pinked edge from the gallery motif.
60. **Each pinned chapter is now sized to the screen** rather than given a minimum height, so the drawing can never run off the bottom while the chapter is held. The words take the height they need and the drawing takes the rest, which is why the plate is larger on the short first chapter than on the longer second one.

