"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

  // Dual-buffer continuous crossfade player to completely eliminate the loop end pause
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeBuffer, setActiveBuffer] = useState<1 | 2>(1);
  const isCrossfading = useRef(false);

  useEffect(() => {
    if (!isVideo) return;

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    // Start playing primary video
    v1.play().catch(() => { });

    const handleTimeUpdate1 = () => {
      if (!v1.duration) return;
      const timeLeft = v1.duration - v1.currentTime;
      // Start crossfading into buffer 2 seamlessly 0.9s before video 1 ends
      if (timeLeft <= 0.9 && !isCrossfading.current && activeBuffer === 1) {
        isCrossfading.current = true;
        v2.currentTime = 0;
        v2.play().catch(() => { });
        setActiveBuffer(2);
        setTimeout(() => {
          isCrossfading.current = false;
        }, 900);
      }
    };

    const handleTimeUpdate2 = () => {
      if (!v2.duration) return;
      const timeLeft = v2.duration - v2.currentTime;
      // Start crossfading into buffer 1 seamlessly 0.9s before video 2 ends
      if (timeLeft <= 0.9 && !isCrossfading.current && activeBuffer === 2) {
        isCrossfading.current = true;
        v1.currentTime = 0;
        v1.play().catch(() => { });
        setActiveBuffer(1);
        setTimeout(() => {
          isCrossfading.current = false;
        }, 900);
      }
    };

    v1.addEventListener("timeupdate", handleTimeUpdate1);
    v2.addEventListener("timeupdate", handleTimeUpdate2);

    return () => {
      v1.removeEventListener("timeupdate", handleTimeUpdate1);
      v2.removeEventListener("timeupdate", handleTimeUpdate2);
    };
  }, [isVideo, activeBuffer, videoSrc]);

  return (
    <section
      aria-labelledby="about-banner-title"
      className="relative overflow-hidden bg-white pt-16 sm:pt-[4.5rem] lg:pt-[5.25rem]"
    >
      <div className="relative flex min-h-[24rem] w-full items-center justify-center overflow-hidden py-16 sm:min-h-[calc(100svh-4.5rem)] lg:min-h-[calc(100svh-5.25rem)]">
        {/* Background Video (Dual-buffered continuous seamless loop - 100% crystal clear full screen) */}
        {isVideo ? (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="relative h-full w-full">
              {/* Primary Video Stream */}
              <video
                ref={video1Ref}
                aria-hidden="true"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={poster}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                  activeBuffer === 1 ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>

              {/* Seamless Buffer Video Stream */}
              <video
                ref={video2Ref}
                aria-hidden="true"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                  activeBuffer === 2 ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
          </div>
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

        {/* Foreground Content with Crisp Solid Typography */}
        <div className="container-site relative z-20 mx-auto px-4 text-center">
          {/* Main Hero Title */}
          <h1
            id="about-banner-title"
            className="mx-auto max-w-5xl font-sans text-[clamp(2.15rem,1.35rem+3.25vw,4.05rem)] font-bold leading-[1.14] tracking-tight text-navy"
          >
            {title}
          </h1>

          {/* Strapline / Subtitle */}
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
