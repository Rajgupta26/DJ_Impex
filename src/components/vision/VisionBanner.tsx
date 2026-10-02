"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function VisionBanner({
  title,
  strapline,
  videoSrc = "/video/about-dji-original-a53e1fc3.mp4",
  poster = "/video/about-dji-original-a53e1fc3.jpg",
  showOverlay = true,
  preserveFrame = false,
}: {
  title: string;
  strapline?: string;
  videoSrc?: string;
  poster?: string;
  showOverlay?: boolean;
  preserveFrame?: boolean;
}) {
  const isVideo = !videoSrc.match(/\.(jpg|jpeg|png|webp|avif)$/i);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => undefined);
    return () => video.pause();
  }, [isVideo, videoSrc]);

  return (
    <section
      aria-labelledby="about-banner-title"
      className="relative overflow-hidden bg-white pt-16 sm:pt-[4.5rem] lg:pt-[5.25rem]"
    >
      <div
        className={
          preserveFrame
            ? "relative aspect-video w-full overflow-hidden sm:aspect-auto sm:h-[calc(100svh_-_4.5rem)] lg:h-[calc(100svh_-_5.25rem)]"
            : "relative flex min-h-[24rem] w-full items-center justify-center overflow-hidden py-16 sm:min-h-[calc(100svh-4.5rem)] lg:min-h-[calc(100svh-5.25rem)]"
        }
      >
        {isVideo ? (
          <video
            key={videoSrc}
            ref={videoRef}
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={poster}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src={videoSrc}
              alt=""
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        )}

        <div
          className={
            showOverlay
              ? "container-site relative z-20 mx-auto px-4 text-center"
              : "sr-only"
          }
        >
          <h1
            id="about-banner-title"
            className="mx-auto max-w-5xl font-sans text-[clamp(2.15rem,1.35rem+3.25vw,4.05rem)] font-bold leading-[1.14] tracking-tight text-navy"
          >
            {title}
          </h1>
          {strapline ? (
            <p className="mx-auto mt-4 max-w-3xl font-sans text-lg font-normal leading-relaxed text-slate sm:text-xl lg:text-[1.35rem]">
              {strapline}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
