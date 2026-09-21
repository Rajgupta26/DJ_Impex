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

