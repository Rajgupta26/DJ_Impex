import Image from "next/image";

/**
 * The fabric remains in motion, while the page copy is real text rather than
 * enlarged lettering baked into the footage.
 */
export function VisionBanner({
  title,
  strapline,
  videoSrc = "/video/luxury-in-every-thread.mp4",
  poster = "/images/brand-imagery/luxury-white-silk-banner.jpg",
}: {
  title: string;
  strapline?: string;
  videoSrc?: string;
  poster?: string;
}) {
  const isVideo = !videoSrc.match(/\.(jpg|jpeg|png|webp|avif)$/i);

  return (
    <section aria-labelledby="about-banner-title" className="bg-white pt-16 sm:pt-[4.5rem] lg:pt-[5.25rem]">
      <div className="relative flex min-h-[24rem] w-full items-center overflow-hidden py-16 sm:min-h-[calc(100svh-4.5rem)] lg:min-h-[calc(100svh-5.25rem)]">
        {isVideo ? (
          <video
            aria-hidden="true"
            className="absolute inset-0 h-full w-full origin-bottom scale-[2.2] object-cover [filter:grayscale(1)_contrast(0.62)_brightness(1.08)]"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={poster}
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0">
            <Image
              src={videoSrc}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-white/30" />

        <div className="container-site text-navy relative text-center">
          <h1
            id="about-banner-title"
            className="mx-auto max-w-5xl text-[clamp(2rem,1.25rem+3vw,3.75rem)] font-normal leading-[1.15] tracking-tight"
          >
            {title}
          </h1>
          {strapline ? (
            <p className="mx-auto mt-5 max-w-3xl text-lg font-normal leading-relaxed sm:text-xl lg:text-2xl">
              {strapline}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
