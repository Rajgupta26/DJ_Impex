"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { withReg } from "@/components/ui/Reg";

export function VisionBanner({
  title,
  strapline,
  videoSrc = "/video/about-video.mp4",
  poster = "/video/luxury-in-every-thread.jpg",
  showOverlay = false,
  preserveFrame = true,
  mobileBackground,
}: {
  title: string;
  strapline?: string;
  videoSrc?: string;
  poster?: string;
  showOverlay?: boolean;
  preserveFrame?: boolean;
  mobileBackground?: string;
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
      data-hero
      aria-labelledby="about-banner-title"
      className={`site-hero on-dark relative h-[82svh] min-h-[32rem] w-full max-w-full overflow-hidden bg-navy-deep text-white sm:h-[100dvh] sm:min-h-[36rem] ${preserveFrame ? "about-banner--preserve-frame" : ""} ${mobileBackground ? "about-banner--mobile-content" : ""}`}
    >
      {/* Video / Background Layer extending to top edge */}
      <div className="about-banner__media absolute inset-0 h-full w-full overflow-hidden">
        {mobileBackground ? (
          <div className="absolute inset-0 hidden max-sm:block">
            <Image src={mobileBackground} alt="" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-white/55" />
          </div>
        ) : null}
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
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-center ${mobileBackground ? "max-sm:hidden" : ""}`}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={videoSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
            className={`object-cover object-center ${mobileBackground ? "max-sm:hidden" : ""}`}
          />
        )}
      </div>

      <div className={showOverlay ? "container-site relative z-20 mx-auto px-4 text-center" : mobileBackground ? "about-banner__copy sr-only" : "sr-only"}>
        <h1 id="about-banner-title">{withReg(title)}</h1>
        {strapline ? <p>{withReg(strapline)}</p> : null}
      </div>
    </section>
  );
}
