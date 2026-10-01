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

  // Dual-buffer continuous crossfade player
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeBuffer, setActiveBuffer] = useState<1 | 2>(1);
  const isCrossfading = useRef(false);

  useEffect(() => {
    if (!isVideo) return;

    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    // Start playing video 1
    v1.play().catch(() => {});

    const handleTimeUpdate1 = () => {
      if (!v1.duration) return;
      const timeLeft = v1.duration - v1.currentTime;
      // When 0.8s remain before the clip ends, start fading into video 2
      if (timeLeft <= 0.8 && !isCrossfading.current && activeBuffer === 1) {
        isCrossfading.current = true;
        v2.currentTime = 0;
        v2.play().catch(() => {});
        setActiveBuffer(2);
        setTimeout(() => {
          isCrossfading.current = false;
        }, 800);
      }
    };

    const handleTimeUpdate2 = () => {
      if (!v2.duration) return;
      const timeLeft = v2.duration - v2.currentTime;
      // When 0.8s remain before clip 2 ends, start fading into video 1
      if (timeLeft <= 0.8 && !isCrossfading.current && activeBuffer === 2) {
        isCrossfading.current = true;
        v1.currentTime = 0;
        v1.play().catch(() => {});
        setActiveBuffer(1);
        setTimeout(() => {
          isCrossfading.current = false;
        }, 800);
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
      className="relative overflow-hidden bg-[#fafbfc] pt-16 sm:pt-[4.5rem] lg:pt-[5.25rem]"
    >
      <style>{`
        @keyframes floating-fabric {
          0% {
            transform: scale(1.04) translate(0%, 0%);
          }
          50% {
            transform: scale(1.08) translate(-1%, -1.2%);
          }
          100% {
            transform: scale(1.04) translate(0.8%, -0.5%);
          }
        }
      `}</style>

      <div className="relative flex min-h-[30rem] w-full items-center justify-center overflow-hidden py-20 sm:min-h-[calc(100svh-4.5rem)] lg:min-h-[calc(100svh-5.25rem)]">
        {/* Background Floating Fabric Video (Dual-buffered continuous loop) */}
        {isVideo ? (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Ambient smooth floating scale effect on the video viewport */}
            <div className="relative h-full w-full animate-[floating-fabric_18s_ease-in-out_infinite_alternate] scale-105">
              {/* Primary Video Stream */}
              <video
                ref={video1Ref}
                aria-hidden="true"
                muted
                playsInline
                preload="auto"
                poster={poster}
                className={`absolute inset-0 h-full w-full object-cover brightness-[1.02] contrast-[1.03] transition-opacity duration-700 ease-in-out ${
                  activeBuffer === 1 ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>

              {/* Seamless Buffer Video Stream (Crossfades seamlessly to remove loop jumps) */}
              <video
                ref={video2Ref}
                aria-hidden="true"
                muted
                playsInline
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover brightness-[1.02] contrast-[1.03] transition-opacity duration-700 ease-in-out ${
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
              className="object-cover"
            />
          </div>
        )}

        {/* Soft Luxury Light Diffusion Overlay (ensures maximum text clarity & readability) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.45)_55%,rgba(255,255,255,0.15)_100%)]"
        />

        {/* Soft edge blend overlays to seamlessly fade into adjacent sections */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-white via-white/40 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-white via-white/60 to-transparent"
        />

        {/* Foreground Content with High Contrast Typography */}
        <div className="container-site relative z-20 mx-auto px-4 text-center">
          {/* Refined Brand Kicker */}
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/75 px-4 py-1.5 shadow-[0_2px_12px_rgba(13,23,51,0.04)] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#172850]" />
            <span className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#172850] uppercase sm:text-xs">
              DJ Impex &amp; Co. · House of Cloth
            </span>
          </div>

          {/* Main Hero Title */}
          <h1
            id="about-banner-title"
            className="mx-auto max-w-4xl font-sans text-[clamp(2.25rem,1.4rem+3.8vw,4.25rem)] font-normal tracking-tight text-[#0d1733] leading-[1.12] [text-shadow:0_1px_16px_rgba(255,255,255,0.9)]"
          >
            {title}
          </h1>

          {/* Strapline / Subtitle */}
          {strapline ? (
            <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-[#334155] sm:text-lg md:text-xl lg:text-[1.35rem] [text-shadow:0_1px_12px_rgba(255,255,255,0.8)]">
              {strapline}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
