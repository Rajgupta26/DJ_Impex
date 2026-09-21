"use client";

import { useState } from "react";

import { WeaveArt } from "@/components/ui/WeaveArt";

/**
 * Click-to-load map.
 *
 * A Google Maps iframe pulls in a large amount of third-party JavaScript. On a
 * mid-range Android on mobile data in Kano that is a real cost, and most visitors
 * want WhatsApp rather than a map, so nothing loads until someone asks for it.
 */
export function MapEmbed({ src, label }: { src: string; label: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={src}
        title={label}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="group relative h-full w-full overflow-hidden text-left"
    >
      <WeaveArt pattern="check" scale={0.9} />
      <span className="on-dark relative flex h-full flex-col items-start justify-end gap-2 p-7 text-white">
        <span className="t-h3">Show the map</span>
        <span className="t-small text-white/70">
          Loads Google Maps. {label}
        </span>
      </span>
    </button>
  );
}
