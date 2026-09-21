# Video

Drop the client's original video files here, then copy them into `public/video/`.

## Waiting on

| File | What it is | Status |
|---|---|---|
| `nabeen-marconi.mp4` | The Marconi reel from the Nabeen Facebook page (https://www.facebook.com/reel/1400076468857662) | **Needed from Binoli** |
| `nabeen-marconi.jpg` | A still from the reel, used as the poster frame | **Needed** |

Facebook serves the reel only behind a login, and a re-encoded copy off the
platform would be watermarked and visibly worse. Ask Binoli for the source file.

## What to send

- **MP4 (H.264, AAC)**, 1080p or better, under about 8 MB if possible.
- Landscape 16:9 suits the section best. A vertical reel works, but it is cropped.
- A **poster still** as JPG at the same aspect ratio.

## How it is used

The film is muted, loops, and starts only when it scrolls into view, with a
visible pause control. `preload="none"`, so a visitor in Kano on mobile data
downloads nothing until they reach it. Nothing plays under
`prefers-reduced-motion`.

Filenames are set in `brand-kit/content/site.json` under `brandFilm`.
