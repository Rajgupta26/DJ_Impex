import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { withReg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { getPage } from "@/lib/content";
import { getGalleryTiles } from "@/lib/gallery";
import { whatsappLink } from "@/lib/contact";
import { field, section } from "@/lib/markdown";

const CELLS = 12;

/**
 * World of Nabeen: a swatch book laid out flat.
 *
 * Tiles carry pinked top and bottom edges, like cards cut with pinking shears.
 * This is the only place that motif appears. Ten fabrics are in the kit, so the
 * remaining cells become one wide tile that opens WhatsApp; when the client sends
 * the last two, the grid fills itself and the tile narrows.
 *
 * The top padding is short because the testimonials band above ends in a
 * mist-coloured wave divider, which already lays its own height of ground over
 * this section's colour. It carried `page-end` while it was the last thing on
 * the page; the contact section took that job back on 2026-09-23.
 */
export async function NabeenGallery() {
  const images = await getGalleryTiles();
  const gallery = section(getPage("home"), "6-gallery-world-of-nabeen");
  const span = Math.max(1, CELLS - images.length);

  return (
    <section className="bg-mist pt-10 pb-16 lg:pt-14 lg:pb-20">
      <Container>
        <div className="max-w-[46rem]">
          <h2 className="t-h2">{withReg(field(gallery, "heading"))}</h2>
          <p className="t-lead mt-5">{withReg(field(gallery, "intro"))}</p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {images.map((image, index) => (
            <li
              key={image.src}
              className="swatch-pinked group relative aspect-square overflow-hidden bg-white"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading={index < 4 ? undefined : "lazy"}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-[var(--duration-base)] ease-[var(--ease-weave)] group-hover:scale-[1.04]"
              />
              <span className="t-small text-navy absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-3 py-1 text-xs font-semibold opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-opacity duration-[var(--duration-base)] group-hover:opacity-100">
                {image.name}
              </span>
            </li>
          ))}

          <li className="swatch-pinked relative" style={{ gridColumn: `span ${Math.min(span, 2)}` }}>
            <TrackedLink
              href={whatsappLink("Hello Nabeen team, please send me the full swatch range.")}
              event="whatsapp_click"
              location="gallery"
              className="on-dark bg-navy hover:bg-navy-soft flex h-full min-h-[10rem] flex-col justify-center gap-2 p-7 text-white transition-colors duration-[var(--duration-quick)] lg:p-9"
            >
              <span className="t-h3">See the full range</span>
              <span className="t-small text-white/70">Ask our team for swatches on WhatsApp</span>
            </TrackedLink>
          </li>
        </ul>
      </Container>
    </section>
  );
}
