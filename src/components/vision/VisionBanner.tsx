import Image from "next/image";

/**
 * The opening of /vision: the agency's own banner, supplied 2026-09-23 as
 * finished artwork to replace the drawn loom panel that stood here.
 *
 * The words are baked into the artwork, so the image sits inside the H1 and its
 * alt carries them. That keeps the page's heading real for a search engine and a
 * screen reader even though nothing on screen is live text.
 *
 * The header is fixed and overlays the page, and it starts solid white here
 * because this page carries no `data-hero`. The top padding is the header's own
 * height, so the artwork begins below it rather than under it -- on a phone the
 * banner is only about 175px tall and the tagline would otherwise sit behind the
 * navigation.
 *
 * Width and height are the file's own, with `h-auto w-full`, so the whole banner
 * is shown at its aspect at every width and nothing is ever cropped.
 */
export function VisionBanner() {
  return (
    <section className="bg-white pt-[4.5rem] lg:pt-[5.25rem]">
      <h1>
        <Image
          src="/images/vision/luxury-in-every-thread.png"
          alt="Luxury in every thread. House of textiles: Giza Cotton, Wool, Atiku, Aesobi, Wax Print, Shirting, Swiss Lace, Suiting, Jacquard and Voile."
          width={1128}
          height={495}
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
      </h1>
    </section>
  );
}
