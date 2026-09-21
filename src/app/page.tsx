import { BriefSection } from "@/components/home/BriefSection";
import { CauseSection } from "@/components/home/CauseSection";
import { HeroCarousel, type HeroSlideView } from "@/components/home/HeroCarousel";
import { JournalPreview } from "@/components/home/JournalPreview";
import { NabeenGallery } from "@/components/home/NabeenGallery";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { Selvedge } from "@/components/layout/Selvedge";
import { getHeroSlides, getPage, getSite } from "@/lib/content";
import { whatsappLink } from "@/lib/contact";
import { field, section } from "@/lib/markdown";
import { visible } from "@/lib/site";

/**
 * The home page, in the client's order (content/home.md):
 * hero -> brief + trust marks -> journal -> testimonials -> gallery -> cause.
 * Do not reorder.
 */

/**
 * Hero photography is still pending. Until it arrives, the best of the brand
 * imagery carries the first slides and the campaign slide uses drawn cloth,
 * because there is no honest photograph for it yet.
 */
const HERO_MEDIA: HeroSlideView["media"][] = [
  {
    kind: "image",
    src: "/images/brand-imagery/fabric-blush-stripe-macro.jpg",
    alt: "Blush striped Nabeen shirting fabric folded in raking light",
    position: "60% 40%",
  },
  {
    kind: "image",
    src: "/images/brand-imagery/weaving-loom.jpg",
    alt: "Warp threads running through a loom",
    position: "50% 45%",
    muted: true,
  },
  { kind: "weave", pattern: "lace", pending: "Wear2Care campaign photograph" },
  {
    kind: "image",
    src: "/images/brand-imagery/spinning-frames-bw.jpg",
    alt: "Spinning frames drawing cotton into yarn",
    position: "50% 50%",
    muted: true,
  },
];

export default function HomePage() {
  const site = getSite();
  const home = getPage("home");
  const testimonials = visible(site.testimonials.items);

  const slides: HeroSlideView[] = getHeroSlides().map((slide, index) => ({
    ...slide,
    media: HERO_MEDIA[index] ?? HERO_MEDIA[0],
  }));

  return (
    <>
      <HeroCarousel slides={slides} whatsappHref={whatsappLink()} />
      <Selvedge variant="hero" />

      <BriefSection />
      <JournalPreview />

      <TestimonialsCarousel
        heading={field(section(home, "5-testimonials"), "heading")}
        items={testimonials}
      />

      <NabeenGallery />
      <CauseSection />
    </>
  );
}
