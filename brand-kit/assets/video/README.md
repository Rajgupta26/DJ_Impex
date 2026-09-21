# Video

Source video files. Copy anything here into `public/video/` as well; the site
serves from `public/video/`, and filenames are set in `brand-kit/content/site.json`
under `brandFilm`.

## In hand

| File | What it is |
|---|---|
| `nabeen-marconi.mp4` | The Marconi reel. 720x1280 (9:16), 21.5s, H.264 + AAC, 4.5 MB. |
| `nabeen-marconi.jpg` | Poster frame, taken from the film's own first frame. |

## Where it plays

- **Home hero**, as the opening slide. On a phone it fills the hero; from 1024px up
  it stands as a tall panel on the right while the words sit on navy to the left.
- **Nabeen page**, as a standing panel beside the caption.

It is never cropped to 16:9. Doing that would throw away three quarters of a 9:16
frame and cut the wordmark off the top.

## How it behaves

Muted, looping, `preload="none"`, and it starts only while its slide or section is
actually on screen. The home hero holds on it for 13 seconds rather than the usual
6.5, so it is not reduced to a fragment. Nothing plays under
`prefers-reduced-motion`, and on a connection reporting Data Saver or 2G/3G the
poster frame is shown and the video is never requested at all.

## Still worth asking for

- **A smaller encode.** 4.5 MB is a lot on Nigerian mobile data. A 720p encode at
  around 900 kbps would roughly halve it with no visible loss at this size.
- **A landscape cut**, if one exists. It would let the hero run full-bleed.

## Sending more

- **MP4 (H.264, AAC)**, 1080p or better.
- A **poster still** as JPG at the same aspect ratio.
