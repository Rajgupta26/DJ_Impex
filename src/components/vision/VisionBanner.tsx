/**
 * The fabric remains in motion, while the page copy is real text rather than
 * enlarged lettering baked into the footage.
 */
export function VisionBanner({ title, strapline }: { title: string; strapline?: string }) {
  return (
    <section aria-labelledby="about-banner-title" className="bg-white pt-16 sm:pt-[4.5rem] lg:pt-[5.25rem]">
      <div className="relative flex min-h-[24rem] w-full items-center overflow-hidden py-16 sm:min-h-[calc(100svh-4.5rem)] lg:min-h-[calc(100svh-5.25rem)]">
        <video
          aria-hidden="true"
          className="absolute inset-0 h-full w-full origin-bottom scale-[2.2] object-cover [filter:grayscale(1)_contrast(0.45)_brightness(1.12)]"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/brand-imagery/luxury-white-silk-banner.jpg"
        >
          <source src="/video/luxury-in-every-thread.mp4" type="video/mp4" />
        </video>
        <div aria-hidden="true" className="absolute inset-0 bg-white/48" />

        <div className="container-site text-navy relative text-center">
          <h1
            id="about-banner-title"
            className="mx-auto max-w-5xl text-[clamp(2rem,1.25rem+3vw,3.75rem)] leading-[1.15] font-semibold tracking-tight"
          >
            {title}
          </h1>
          {strapline ? (
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed font-medium sm:text-xl lg:text-2xl">
              {strapline}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
