# Asset inventory

Copy into the Next.js app as: `brand-kit/assets/<folder>` → `public/images/<folder>`.

## logos/
| File | Use | Notes |
|---|---|---|
| `nabeen-logo-white.png` | Header over hero, footer, dark sections | Transparent PNG, 1088×345. Extracted from the client's logo file. |
| `nabeen-logo-navy.png` | Header on scroll, light sections, OG images | Recoloured to spec navy #172850. |
| `nabeen-logo-original-square.png` | Favicon / app icon / social avatar source | Client original, navy square. |
| `dji-logo-transparent.png` | Parent-company mark on About page and footer small print | Background removed. 736×735. |
| `dji-logo-original.png` | Reference | Client original on white. |

Ask the client for **SVG** versions of both logos. PNGs are fine to start.
Favicon: generate from `nabeen-logo-original-square.png` (use the "N" or full wordmark on navy) via `app/icon.png` + `app/apple-icon.png`.

## gallery/ (10 images, from brochure p.7)
Real Nabeen fabric photographs, square.

**Four are now high resolution** (1024px, supplied 2026-09-22) and are safe for large use:
`03-white-jacquard`, `05-camel-check-jacquard`, `08-champagne-check`, `09-sky-circle-jacquard`.
Those four carry the three journal covers and the archive frame on the home page.

The remaining six are still brochure scans at 315-480px: fine for grid tiles
(~300px on screen), NOT for large use. Still worth requesting: `01-aqua-jacquard`,
`02-taupe-dobby`, `04-charcoal-herringbone`, `06-mint-dobby`, `07-blush-stripe`,
`10-slate-rib`.
01 aqua jacquard · 02 taupe dobby · 03 white jacquard · 04 charcoal herringbone · 05 camel check jacquard · 06 mint dobby · 07 blush stripe · 08 champagne check · 09 sky circle jacquard · 10 slate rib.
Names describe what is visible, not official product names. Replace with product names when the client supplies them.

## manufacturing/ (7 images, from brochure p.6, in the brochure's order)
01 cotton · 02 spinning · 03 warping · 04 yarn · 05 stitching/finishing · 06 quality & packing · 07 finished rolls.
Very small (374-437px) and several appear to be stock photography. Use only as small step thumbnails. Step labels are proposed.

## brand-imagery/
| File | Size | Use |
|---|---|---|
| `fabric-blush-stripe-macro.jpg` | 1189×1679 | Best available hero placeholder (portrait: crop to landscape with object-position). |
| `spinning-frames-bw.jpg` | 1189×1498 | About page / brand promise section. Likely stock. |
| `weaving-loom.jpg` | 1295×1631 | About page. Likely stock. Purple cast: apply a navy duotone or reduce saturation. |

## brochure-pages/
Renders of all 9 brochure pages for reference only. Do not put these on the site.

## Still needed from the client
See `docs/05-open-questions.md` (hero images, originals, Ali Nuhu photos, Wear2Care photos, factory photos, 2 more fabrics, SVG logos).
