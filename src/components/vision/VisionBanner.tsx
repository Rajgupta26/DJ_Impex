import Image from "next/image";

/** The About heading stays sharp at every size instead of scaling with footage. */
export function VisionBanner({ title, strapline }: { title: string; strapline?: string }) {
  return (
    <section aria-labelledby="about-banner-title" className="bg-white pt-16 sm:pt-[4.5rem] lg:pt-[5.25rem]">
      <div className="relative flex min-h-[24rem] w-full items-center overflow-hidden py-16 sm:min-h-[calc(100svh-4.5rem)] lg:min-h-[calc(100svh-5.25rem)]">
        <Image
          src="/images/brand-imagery/luxury-white-silk-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={88}
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-white/60" />

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
