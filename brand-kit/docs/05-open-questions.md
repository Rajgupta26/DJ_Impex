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

## Wear2Care photographs

61. **Received, and in use.** Two photographs from the client's own Wear2Care x Ali Nuhu donation, supplied 2026-09-22 and stored in `brand-kit/assets/wear2care/`. They replace the placeholders on the home cause section and on the Nabeen x Ali Nuhu page, and one now carries that page's hero. Question 10 is closed: these are real campaign photographs, not stock, and no children appear in either frame.
62. **They are 1024x767, which is small for a full-bleed hero.** They hold up at the sizes used, but ask for the originals at full camera resolution if there are any.
63. **The recipients are named from the banner in the photographs**, not from any document the client sent: "Nassarawa Children's Home" and "Creative Helping Needy Foundation", recorded in `site.json` under `wear2care` with `status: tbc`. Confirm the spelling, and confirm they may be named on the site.
64. **Still pending for this page: a portrait of Ali Nuhu himself**, and an approved quote. The donation photographs do not obviously show him, and I will not guess which person in a group photograph he is.

## Gallery originals

65. **Four high-resolution fabric photographs received** (2026-09-22), at 1024px against the 315-480px brochure scans they replace: white jacquard, camel check jacquard, champagne check and sky circle jacquard. They keep the same filenames, so every reference picked them up at once. Question 8 is now partly closed.
66. **These four carry the large uses.** All three journal covers and the archive frame on the home page draw on them, and those were the blurriest images on the site: a 315px scan was being stretched across a 21:9 article cover.
67. **Six brochure fabrics are still low resolution**: aqua jacquard, taupe dobby, charcoal herringbone, mint dobby, blush stripe, slate rib. They are only used as gallery tiles at about 300px, so they hold up there, but they cannot be used large. Worth asking for the rest of the set.


## Story illustrations

68. **The three reference drawings the client sent are Siyaram's own artwork.** They were supplied on 2026-09-22 with the instruction to put them in the story section; two of them had already been sent once. They are not licensed to Nabeen, and publishing them on a commercial site is a real exposure for the client, so they are not in the repository and are not used. The drawings on `/about` are originals, drawn in the same register: fine navy line on white, three-quarter view, `src/components/about/StoryIllustration.tsx`. If the client wants exactly those pictures, the answer is to commission a artist, or to licence them.
69. **Chapter three now ends on a tailored jacket rather than a folded stack**, taking the subject of the third reference drawing: it closes the story on what the cloth becomes rather than on how it ships. Confirm this is the intended ending.
70. **The middle chapter's drawing is smaller than the other two** (339px tall against 528 and 639 at 1440x900), because it carries two paragraphs of the client's copy and the drawing takes whatever the words leave. Rebalancing the four story paragraphs across the three chapters would even it out, but it is the client's copy and the split is already proposed rather than confirmed. See `brand-kit/content/about.md`, "Story chapters".

## The home page's closing block

71. **The social cause block has been taken off the home page** and replaced by the enquiry (agency instruction, 2026-09-22). This is a deliberate departure from the client's own section order in `Home_Page_Format.pdf`, where section 7 is the social cause and there is no enquiry block at all. The client should be told, because the order was given as fixed.
72. **Wear2Care itself is untouched.** `/nabeen-x-ali-nuhu` still carries both donation photographs, still holds its menu entry, and the hero slide copy for it is still in `home.md`. Nothing about the campaign has been removed from the site; it has lost its place on the home page.
73. **The enquiry copy is contact.md's, word for word**, so there is one voice for enquiries rather than two. It means the home page and `/contact` open with the same sentence. If the client would rather they differed, the home version is in `home.md` under "Enquiry" and can be changed on its own.

## The About page rebuild

74. **The story scroll has been removed** (agency instruction, 2026-09-22). The three chapters now alternate down the page, drawing and words trading sides, with a thread of gold marking each. Nothing pins, dissolves or waits for the scroll. The `.story` CSS and `StoryScroll.tsx` are deleted; the three original illustrations are unchanged and still carry the chapters. Note that the pinned scroll was itself a client request earlier in the build, so this reverses it.
75. **The welcome copy is the prototype's**, from `djimpex.vercel.app` ("About us"), added on the agency's instruction. This sits against CLAUDE.md rule 4. It is defensible here because the passage carries no dates, no figures and none of the claims listed above: it is pure brand writing, and it is the client's own. But it means the new site and the old prototype now open with the same 200 words. Confirm the client is happy with that, or ask them to rewrite it for the new site.
76. **It names two cloths the site does not sell.** The passage lists "Suiting, Cotton Shirting, Swiss Men Lace, Atiku, Voile, Brocade and Giza". `site.json.fabricTypes` has six: Giza Cotton, Swiss Lace, Atiku, Voile & Jacquard, Suiting, Wool. Cotton Shirting and Brocade appear nowhere else on the site, and Wool is missing from the list. The names are set large on /about, so a reader will notice. Confirm the range, then either correct the copy or add the fabrics.
77. **The sign-off had two emoji.** "Crafted with ❤️ from India. 🇮🇳" is set as "Crafted with love, from India.", per CLAUDE.md's no-emoji rule. If the client wants the flag and the heart, that rule is the thing to change, not this line on its own.

## /about rebuilt, then cut back

78. **The page is five sections and a closing band**: hero, the client's welcome, the story in three chapters, Recognition, how the fabric is made, enquiry. It was briefly eight. What came out was mine, not the client's: an overture that opened the page a third time after the hero and the welcome had both already opened it, and a band carrying one line of brochure copy over a photograph, which was a breather rather than information. The proposed copy those two needed ("The house", "Our promise") has been taken out of `about.md` with them, so the content file describes what is actually built.
79. **The four marks now live in Recognition** rather than in a section of their own. Star Export House is one of the four, so splitting them across two sections stated the same credential twice.
80. **The six values are on /nabeen, not /about.** Honesty, Integrity, Human Dignity, Trust, Quality and Excellence would sit naturally on an About page, and /about is arguably where a buyer looks for them. They are not repeated here because repeating them weakens both pages. Decide which page owns them.

## The story section is gone

81. **The client's "Our story" copy is no longer rendered anywhere.** The threaded story section on /about was deleted on the agency's instruction (2026-09-22), and it was the only place the four paragraphs from `About_D_J_Impex_and_Co.pdf` appeared. The copy is still in `about.md` under "Our story", along with the three proposed chapter labels, but nothing reads it. The site now tells the house's history only through the client's prototype welcome copy and the Star Export House paragraph. Decide whether the story belongs somewhere else on the site or is genuinely not wanted.
82. **`StoryIllustration.tsx` is unreferenced on this branch but must not be deleted.** The three drawings went with the section. `origin/main` (dc50881) has a StoryScroll that imports the file, so removing it would break the pending merge. There is a note to that effect at the top of the file.

83. **The prototype welcome copy is no longer rendered either.** The Welcome section went on 2026-09-22, and with it the seven-cloth list and the client's 200-word brand passage. That copy is still in `about.md` under "Welcome", unused, alongside the unused "Our story" from question 81. Two blocks of the client's own writing are now in the repository and on no page. Question 75 (the passage naming Cotton Shirting and Brocade, which are not in `fabricTypes`) is moot while it stays unrendered.
84. **/about is the only page with no closing enquiry band.** `EnquiryBand` renders on /nabeen, /vision, /nabeen-x-ali-nuhu and both journal routes; it was removed from /about on instruction. The page's only remaining route to contact is the floating WhatsApp and Directions buttons, which are site-wide. For a page a buyer reaches from the main menu, that is worth a second look before launch.

85. **The making sequence is gone too, and /about is now a hero and one section.** The seven brochure steps and the seven photographs in `public/images/manufacturing/` are no longer referenced anywhere in `src`. The images are still in the repository. `about.md` still holds the step copy under "How our fabric is made". Together with questions 81 and 83, that is three separate blocks of client copy in the content files and on no page, and the manufacturing photographs are now unused assets. If none of it is coming back, the content and the images should be removed deliberately rather than left to rot; if any of it is, it needs a home.

## The welcome copy, revised

86. **A revised welcome passage was supplied on 2026-09-22** and replaces the one taken from the prototype. It is back on /about, between the hero and Recognition. Five changes from the earlier version, all carried through: "Nabeen by DJI" is now "Nabeen by D J Impex & Co."; "Swiss Men Lace" is now "Swiss Voile, Lace"; "contemporary appeal" is now "a contemporary appeal"; "tapestry of comfort, quality, and culture" is now "...and class"; and the clause below.
87. **One clause in the supplied text is not a sentence.** It reads "meticulously curated textiles that [the] peak of unwavering commitment to excellence", with the square brackets. "[the] peak" is set as "speak", which is what the same sentence said in the version supplied earlier. The whole line is one editable field in `about.md` under "Welcome". Confirm the intended wording.
88. **The fabric list now names eight, and Voile appears twice.** As supplied: Suiting, Cotton Shirting, Swiss Voile, Lace, Atiku, Voile, Brocade, Giza. It is rendered exactly that way, each name set large down a ruled column, so a reader will see "Swiss Voile" and "Voile" as separate entries four lines apart. Against `site.json.fabricTypes` (Giza Cotton, Swiss Lace, Atiku, Voile & Jacquard, Suiting, Wool): Cotton Shirting and Brocade are not in the range, Wool is missing from the list, and "Swiss Voile, Lace" does not match "Swiss Lace". This supersedes question 75. Settle the range before launch.

## /nabeen deleted

89. **The /nabeen page is gone** (agency instruction, 2026-09-22), along with its entry in `site.json.navigation`. The menu is six items. The sitemap is generated from that navigation, so it dropped out on its own; `/nabeen` now returns 404.
90. **Five inbound links had to go with it**, because a link to a deleted page is a 404 and not a decision anyone should discover in production:
    - the hero's secondary button, whose fallback label was "Explore Nabeen®". The home hero now carries one call to action, the WhatsApp button. It regains a second one as soon as a hero slide names a destination.
    - the seven fabric tags in the footer, which deep-linked to anchors on /nabeen. The names are kept as plain text because they say what the house sells. Give them a destination and they should be links again.
    - the "See our Swiss lace" cross-link at the foot of every journal post. The sentence now reads "Nabeen weaves the fabrics in this guide. Talk to our team about your market."
91. **The site no longer has a page describing the fabrics.** The range, the signature lines and the brand film panel were all on /nabeen. `site.json` still holds `fabricTypes` (used by the footer names and the enquiry form's chips) and `signatureLines`, which is now rendered nowhere. Along with "Our story", the making sequence and their photographs, that is a fourth block of client material in the repository and on no page.
92. **Two components are orphaned and have been kept, not deleted**: `SignatureLines.tsx` and `BrandFilm.tsx`, both used only by /nabeen. They are left in place because the page may come back; if it is not coming back they should be removed deliberately. `StoryIllustration.tsx` remains orphaned for the separate reason in question 82.
93. **The sitemap listed the homepage twice**, because the generator seeded its list with "/" and the navigation also carries a Home entry pointing at "/". Found while checking the sitemap after this deletion, and fixed by deduplicating.

## The palette is blue only

94. **Zari Gold is gone; Selvedge Blue `#5F95DD` is the accent** (agency instruction, 2026-09-22: the site should be blue only, to match the client's logo). This closes rather than breaks a question: the gold was marked PROPOSED in `tokens.css` and 02-design-system.md said "confirm with Binoli; if rejected, swap for white at 60%". It was rejected, and swapped for a blue rather than white.
95. **The blue was chosen by measurement, not by eye.** It sits at the logo's own hue, 214deg, and clears every ground it lands on: 4.69:1 on navy and 5.75:1 on Midnight Loom, which both carry small text in the accent (the footer column labels, the section eyebrows), and 3.07:1 on white, where the focus ring needs 3:1 as a non-text indicator. **The gold measured 2.88:1 on white and did not meet that**, so the focus ring was marginally non-compliant until now.
96. **The token is renamed, not repainted.** `--color-zari` is gone and `--color-accent` replaces it, so nothing is left called after a gold thread while holding a blue. Utilities changed with it: `bg-zari` to `bg-accent`, and so on across 12 files. `tokens.css`, `style-guide.html`, `02-design-system.md` and `CLAUDE.md` all say the same thing.
97. **One warm thing is left on the site, and it is a photograph.** The camel check jacquard in the home page's brief section is the only warm surface remaining now the palette is blue. The sky circle jacquard is a cool pale blue and would suit the new palette, but it is also a journal cover shown in the next section down, so using it here repeats a photograph within a screen. Either accept the repeat, or ask Binoli for one more cool-toned fabric shot.

## Home page bugs, 2026-09-23

98. **The hero film had no way to play it.** Autoplay is suppressed for anyone with "reduce motion" switched on in their operating system, and a browser can refuse it anyway -- and the rejected promise was being swallowed. Either way the viewer got a paused film and no control. There is now a play/pause button at the top right of the hero, and the button reflects the element's real state rather than what the code assumed. It also closes a WCAG 2.2.2 gap: moving content needs a way to stop it, and there was none.
99. **Content was being read at partial opacity.** The home page's scroll reveals began at opacity 0 and only started once a quarter of the block had scrolled in, with a negative bottom margin delaying them further. Measured at 1280x860, the "A house of cloth" heading sat inside the viewport at 0.39 and then 0.71 opacity -- on a white ground that reads as an empty white band under the hero, which is what it was reported as. The reveals now fire just before an element enters, so anything on screen is at full strength.
100. **The stat boxes were four colours the palette does not have**: ochre `#b88728`, crimson `#9e3a3a` and forest green `#286b4a` alongside navy. CLAUDE.md says the site is blue only. They are a tonal blue ladder now, each measured against white because the colour is used for the large lead text as well as the rule above it: 5.63, 11.36, 14.43 and 17.68 to 1. `--color-navy-mid` was added for the lightest step, since Selvedge Blue is 3.07:1 and is a rule and indicator colour, never text on a light ground.
101. **NOT FIXED, needs a decision: the stat box subtitles are invented.** "Over 30 years in trade", "Active shirting & suiting catalogue", "Mill-direct, container load" and "Indigenous Craft" appear nowhere in `brand-kit/content`. CLAUDE.md rule 1 is that facts come from the content files and claims are never invented; "container load" and "mill-direct" in particular are trade claims a buyer may hold the client to. The confirmed wording for these four marks is in `site.json.trustMarks`: "Since 1995", "Star Export House, Govt. of India", "1000+ designs", "Make in India". Replacing the subtitles with the client's own words is a small change; deciding to is not mine.
102. **NOT FIXED, smaller: two house rules broken in the same component.** The 1995 subtitle uses a middle-dot separator, which `about.md` says not to use in the UI, and "Make in India" is forced to uppercase, against the sentence-case rule.

## The footer, 2026-09-23

103. **The selvedge band is gone from the site entirely.** It was removed from the footer's top edge on instruction; the hero's had already gone. That band was the house signature -- the brand woven into the finished edge of the cloth, which is the whole idea behind it -- and 02-design-system.md still describes it as such. `Selvedge.tsx` and its rules in `tokens.css` and `style-guide.html` are kept and are now referenced nowhere. If it is not coming back, the component, the CSS and the style-guide section should be removed together and the design doc corrected; CLAUDE.md has been corrected already.
104. **Follow now sits beside Talk to us** as a fourth footer column rather than stacked beneath it. The footer grid is `1.8fr 1fr 1.3fr 0.9fr` at large widths, two columns at medium, and a single stack on a phone. Checked at 375 and 1180: no horizontal overflow, and all four headings sit on one row at 1180.

105. **The home page has no enquiry form.** The contact section at its foot was cut on instruction (2026-09-23). Nothing links to `#contact`, so no anchor broke, and the page still offers four ways through: the hero's WhatsApp button, the gallery's "See the full range" tile, the floating WhatsApp and Directions buttons, and the footer's phone, email and directions. The form itself lives on /contact. `ContactSection.tsx` is now referenced nowhere and is kept rather than deleted, like `Selvedge.tsx` and `StoryScroll.tsx` before it -- there are now several such files and they should be cleared out in one pass once the shape of the site settles.

106. **The bottom of every page paid for its spacing twice.** A closing section carried a full `--spacing-section` (149px at 1440) and the footer opened with its own `pt-20` (80px) directly beneath it, so 229px of empty ground stood between the last thing on the page and the footer. On the home page that band is mist, sitting under the gallery's pinked bottom edge, and it was reported as a white gap. A new `.page-end` class in `tokens.css` trims the closing section's bottom padding to `clamp(3.5rem, 2.5rem + 2vw, 4.5rem)` -- 56px on a phone, 69px at 1440 -- and is applied to the four pages that end on a light ground: home (gallery), /about (recognition), /contact and the 404. /vision and the journal posts end on the dark enquiry band, which meets the navy-deep footer with no visible seam, so they are left alone. The top padding of those sections is untouched; only the join with the footer changed.

107. **The testimonials band's wave dividers were being paid for twice as well.** The band carries a mist-coloured S-curve on its top and bottom edges (32px on a phone, 56px at 1440), which lays that much of the neighbouring section's own colour over the navy. The journal above it and the gallery below it were each still paying a full `--spacing-section` on that edge, so 229px stood between the journal cards and the first line of a testimonial, and the same again between the last testimonial and "World of Nabeen". Both are now 136px: the journal is `py-10 lg:py-14`, which matches the padding it already had on its other edge, and the gallery's top is the same. The wave supplies the rest of the breathing room. Nothing inside the navy band moved -- its content still clears the curve by 24px at every width.

## /vision rebuilt, 2026-09-23

108. **The vision page was three slabs of large type and nothing else.** A hero carrying the H1, a second navy panel carrying the Cerruti line at 4rem, and the client's closing line at 2.5rem on mist -- 961px of near-identical dark ground before the reader reached anything. The agency asked for all three to go. The opening is one panel now, over a drawn loom: warp threads hung down the whole panel and the herringbone closing up across it, so the words sit on the quiet side and the cloth carries the rest. The five pillars hang on a warp thread below it, each marked with a different drawn weave. The marks are decoration and say nothing about the pillars; the brief forbids numbering them, and the thread does the work a number would have done.
109. **NOT FIXED, needs a decision: the client's closing line is no longer rendered.** "With these pillars, we envisage a future where Nabeen® stands as a beacon of textile excellence, admired across Africa." is confirmed client copy and is still in `content/vision.md`, but the section that carried it was cut as part of 108. It was already flagged for a wording check ("admired by the African Flaire", tidied for grammar). If the client wants it on the page it needs a home that is not another slab of large type -- the foot of the pillars would take it in body size.
110. **The Cerruti quote was demoted rather than removed.** It ran at up to 4rem as the page's second headline and now sits in the opening at 17px with a hairline rule, as an epigraph. It is confirmed client copy, so removing it entirely was not a call to make while cutting the panel it sat in. Say if it should go.
111. **The vision H1 is `t-h1`, not `t-display`.** The opening is a hero and the token allows display type in one, but /about and /contact both set their H1 at `t-h1`, and only the home hero is larger. Holding the three inner pages at one volume seemed worth more than making this one shout. Easy to raise if the client wants /vision to lead.

112. **The five pillars weave themselves in.** On the agency's instruction (2026-09-23) each pillar now assembles in turn: the swatch opens as a wipe, the heading arrives, the paragraph comes in from the right, and the thread draws down to the next swatch. 0.5s between pillars, the whole run over in 2.8s measured.

     The trigger waits for a quarter of the list rather than firing early, which is the opposite of the setting the home page uses. The reason is measured: at 1280x820 the list starts 913px down, only 93px below the fold, so an early trigger fired on page load and the entire cascade played while the reader was still looking at the opening panel. A quarter of the list means the first pillar is on screen when its swatch opens.

     The guard against question 99 is therefore not an early trigger but a short run. Each pillar's own text is at full strength 0.7s after its turn begins, and the last paragraph has landed 2.7s after the first swatch opens. If a reader scrolls faster than that they may briefly reach a pillar that has not arrived yet; that is the trade for the cascade being visible at all, and it is bounded.

     `VisionPillars` is a client component now, so the pillar copy carries `opacity: 0` in the server-rendered HTML until the JavaScript runs -- the same trade `BriefAnimated` already makes on the home page. If that is ever judged too risky for SEO, both should change together.

113. **The pillar marks are cut from the real cloth now.** They were drawn weaves on a navy chip and read as five dark squares at 44px, which the agency called boring (2026-09-23). They are 56-64px crops of the house's own gallery photographs instead, the same files the home page swatch grid uses, with a hairline border so the white jacquard holds its shape against a white ground. Five of the ten were chosen for tone, stepping dark, pale, mid, light down the page; the camel, blush, champagne and taupe pieces were left out because they would bring a second hue onto a page that is meant to be blue. The cloth beside a pillar is ornament and says nothing about what that pillar means, and the rail stays aria-hidden, so the images carry an empty alt.

114. **The pillars section no longer pays a full section's padding at either end**, for the third time on this site and the same reason each time. The opening panel is full bleed and ends on a hard edge, and the enquiry band below opens with 104px of its own; a full `--spacing-section` on top of either left a band of empty white. Top is now 48/64px and the foot 64/80px. The agency asked for the top one; the foot was trimmed to match rather than leaving the same fault at the other end of the same section, and is easy to put back.

115. **A length of cloth now stands to the right of the pillars.** Measured at 1512, 304px of the container sat empty beside the text, because the reading measure is capped at 36rem while the container runs to 82. Widening the text would have bought that space at the cost of a measure nobody reads comfortably, so the cloth takes it, and it puts a real photograph on a page that had none. It appears from 1152 up; below that the row already reaches the container edge (23px of slack at 1100) and taking a column out would squeeze the measure under 50 characters. 1152 is not a Tailwind breakpoint and `lg` (1024) is too early, so it is written as an arbitrary variant.

     Sky circle jacquard was chosen because it is one of only four gallery files at 1024px; the rest are 315-480px, which ASSETS.md marks as tile-sized, and any of those would have had to be blown up more than twice its size to stand a metre tall. It is the one image on this page with real alt text -- a large product photograph on a fabric house's site is content, not ornament, unlike the 64px chips beside each pillar.

     Measured across 1100 / 1152 / 1280 / 1512 / 1920: the reading measure lands between 51 and 70 characters, the cloth between 171 and 270px, and the row ends flush with the container at every width.

116. **The pillar heading column had to widen to 17rem.** `t-h3` is `clamp(1.375rem, 1.2rem + .7vw, 1.875rem)`, so it keeps growing to 30px at 1543 and above, while the column was a fixed 15rem. Past about 1200 the longest heading, "Inspiring Admiration", needed 260px in a 240px column and broke onto two lines -- which is why it looked right in the client's own screenshots at ~1150 and wrong on a larger monitor. 17rem clears the widest heading at the clamp's ceiling with 10px to spare.

## /vision opens on the agency's banner, 2026-09-23

117. **The drawn loom panel is gone and the supplied banner stands in its place.** The artwork carries its own words, so the image sits inside the H1 and its alt carries them: "Luxury in every thread. House of textiles: Giza Cotton, Wool, Atiku, Aesobi, Wax Print, Shirting, Swiss Lace, Suiting, Jacquard and Voile." That keeps the page's heading real for a search engine and a screen reader even though nothing on screen is live text. `VisionOpening.tsx`, `LoomArt.tsx` and the loom's keyframes in globals.css were deleted rather than left orphaned; they are in git at e20a470 if the panel is ever wanted back.

118. **NOT FIXED, needs a decision: the banner's small type is 7px on a phone.** The artwork is 1128x495 and is shown whole at every width, so at 400px it renders at 0.355 and the three lines land at 17px, 7px and 7px. The tagline survives; ": HOUSE OF TEXTILES :" and the fabric list do not. Cropping cannot fix it -- cropping does not enlarge type -- so the only real fix is to set those two lines as live text under the tagline below about 710px, which is where they fall under 12px. That means putting their words in a content file, which runs into 119.

119. **NOT FIXED, needs a decision: the banner lists ten fabrics, `site.json` has six.** The banner says Giza Cotton, Wool, Atiku, Aesobi, Wax Print, Shirting, Swiss Lace, Suiting, Jacquard and Voile. `site.json.fabricTypes` (status `tbc`) says Giza Cotton, Swiss Lace, Atiku, Voile & Jacquard, Suiting, Wool -- and that six-item list is what the footer strip renders. So the same page now shows ten fabrics at the top and the site shows six at the bottom. Aesobi, Wax Print and Shirting are new names that appear nowhere in `brand-kit/content`. Either `site.json` should be updated from the banner and confirmed with the client, or the banner is out of date.

120. **NOT FIXED: the banner is upscaled 1.7x on a large monitor.** The file is 1128px wide and the section is full bleed, so at 1920 the serif tagline is drawn at 1.7 times its pixels and goes soft. A 2400px export of the same artwork would fix it outright and is worth asking the agency for.

121. **The Cerruti epigraph has left the site.** "Only an excellent fabric can originate an excellent fashion." was confirmed client copy and was demoted to an epigraph in question 110; the panel it sat in has now been replaced, so it is gone. Its copy is still in `content/vision.md`. The client's intro line was kept and moved down to head the five pillars.

## Akshay's "ui changes", merged on the agency's instruction, 2026-09-23

122. **The contact page is gone; the form is on the home page again.** Akshay deleted `/contact`, put `ContactSection` back at the foot of the home page and repointed the nav, the 404, the enquiry band and the journal posts at `/#contact`. This reverses question 105, where the agency had asked for that section to be cut, and the agency chose his structure when the two were put side by side. Follow-through: `ContactSection` took the `page-end` class, because it is the last thing before the footer now and was otherwise paying 137px of its own on top of the footer's 80; the gallery gave the class back for the same reason. `/contact` redirects to `/#contact` rather than 404ing, temporarily rather than permanently, because this structure has now changed twice in one day and a 308 is cached by the browser for good.

123. **The popup's guard was pointing at a route that no longer exists.** `ContactPopup` skipped `/contact` so it would not nag someone already looking at the form. With the form on the home page that test could never fire, so the popup would have opened on top of the very form it points at. It now skips `/`. The popup therefore only appears on /about, /vision and the journal posts.

124. **The five pillars carry lucide icons now, not cloth.** Sparkles, Globe, TrendingUp, ShieldCheck and GraduationCap, one per pillar, replacing the fabric swatches from question 113 and the bolt from question 115. The agency chose this when the two were put side by side. Two things worth recording against it: the icons assign a meaning to each pillar that no content file supports -- a graduation cap for "Empowering Minds" reads as a claim about education -- where the cloth was explicitly ornament; and with the bolt gone, the 304px of empty container measured in question 115 is back at widths above about 1150. The `min-[1152px]` grid that held the bolt went with it.

125. **`tsconfig.tsbuildinfo` is untracked and gitignored.** It is a TypeScript build cache, it changes on every build, and it was the only genuine conflict in this merge. It had been offered for gitignoring twice before.

126. **/vision has no closing enquiry band.** It was cut on the agency's instruction (2026-09-23), so the page is now the banner, the five pillars and the footer. The band is still on the journal posts, which are the only other page that carried it, so `EnquiryBand.tsx` is not orphaned. The pillars section took the `page-end` class, since it is the last thing before the footer now and the reason for its old `pb-16 lg:pb-20` -- the band below opening with 104px of its own -- has gone with the band.

     Worth noting against it: /vision is now the only page with no call to action of its own. The footer's phone, email and directions and the floating WhatsApp button are all that remain on it, and /about is in the same position (question 81). Every other page closes on either the band or a form.

127. **Akshay's "animation fix on home page" was merged except for the hero.** His retimed reveals on the brief, the stat boxes and the new `JournalAnimated`, and his smaller pillar icons, are all in. `HeroCarousel.tsx` was kept at our version on the agency's decision, because his change to that one file contained no animation work at all -- only two reversals:

     - It removed the hero film's play/pause button, the state sync, and went back to `catch(() => {})` on the rejected `play()`. That is precisely the combination that produced the "video is paused" bug the agency reported on 2026-09-23 (question 98), and it removes the stop control that WCAG 2.2.2 requires for moving content.
     - It recoloured the hero from `bg-navy-deep` to `bg-black`, with the veils changed from navy to neutral black and a comment saying "without any blue tint". CLAUDE.md has said the palette is blue only since 2026-09-22.

     Git reported no conflict on this file, because nothing here had touched it since. That is worth remembering: a clean merge is not evidence that a merge is correct, and both of these would have gone in silently.

128. **This is the second time in a day that a merge would have undone a reported fix.** The pattern is that work starts from a base that is a few commits old, so a change that was made deliberately looks like a change that was never made. Nothing here is anyone's fault, but the two of you are editing the same handful of files, and the only thing that has caught it both times is reading the diff before merging rather than after.

129. **The home hero's veils are neutral now, not navy.** The three layers over the film were mixed from navy-deep and navy, which put a blue cast over the client's own footage; the agency asked for it off (2026-09-23). They are black at the same positions, with the alphas down about 6 per cent -- black is darker than navy-deep at the same alpha, and the instruction was to take the hue out, not to make the frame darker. The headline sits in the bottom-left corner where all three layers stack and roughly 1.6% of the image comes through, so it is effectively white on black: contrast was never the constraint here and is unchanged.

     This partly supersedes question 127, where the same change in Akshay's commit was flagged as off-palette. The difference: the section's own ground stays `bg-navy-deep`, where his went `bg-black`. A scrim over a photograph is not a brand colour; the ground behind it is. The hero film is the only place this applies.

130. **The page heroes on /about still carry navy veils.** `PageHero` uses the same three-layer treatment in navy over its photograph. The two heroes now treat photography differently: the film is neutral, the page hero is blue. Worth deciding one way or the other, but changing it was not asked for and /about's photograph is the only one it affects.

## The home page trades the journal for the range, 2026-09-23

131. **"Our exclusive collection of" replaces The Fabric Journal on the home page.** The heading is deliberately unfinished, on the agency's word: it runs on into the fabric names below it as one sentence, which is why the names are set at heading weight and nothing punctuates the end of the heading. It is recorded that way in home.md so nobody "fixes" it later by adding a noun. The block lists the six `fabricTypes` from site.json with their one-line descriptions.

132. **The Fabric Journal has its own page again.** It was deleted on 2026-09-22 when the journal became a home-page section; that section is now the collection, so the page is back at /journal and the nav, the post breadcrumbs and the breadcrumb JSON-LD all point there instead of /#journal. The sitemap picks it up automatically, since it filters hash hrefs and /journal is no longer one. The old version of the page repeated the lead post's opening paragraph as a hard-coded string truncated mid-word; `PostCard` takes the excerpt from the post's own front matter, so that is gone.

     `JournalPreview.tsx` and Akshay's `JournalAnimated.tsx` are now referenced nowhere. They are kept rather than deleted, like the others in question 105.

     `Header.tsx` still has its scroll-spy branches for `#journal`. They are harmless -- `getElementById("journal")` returns null now, so the branch never fires -- but they are dead and belong to whoever tidies next.

133. **NOT FIXED, worth knowing: the TBC tag is disabled site-wide.** `TbcTag` returns `null` unconditionally, with the comment "TBC badge is permanently disabled across the site". CLAUDE.md's content rule says `tbc` content should be used *and* carry the dev-only tag, so that rule is currently not implemented anywhere. It matters here because `fabricTypes` is `tbc`: its structure and all six one-line descriptions are proposed microcopy that has never been approved, and nothing on the page says so. The call is left in `FabricCollection` so it lights up again if the tag is ever restored.

134. **The collection block and the banner still disagree.** The home page now names six fabrics from site.json; the /vision banner names ten, three of which (Aesobi, Wax Print, Shirting) appear nowhere in `brand-kit/content`. Question 119 asked which is right; it now shows in two places on the site rather than one.
