import { ImageResponse } from "next/og";

import { getSite } from "@/lib/content";

export const alt = "Nabeen®: luxury fabrics by D J Impex & Co.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The branded card: navy ground, the wordmark, the page title in light condensed
 * type, and a thread-thin gold rule standing in for the selvedge.
 */
export default async function OpenGraphImage() {
  const site = getSite();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d1733 0%, #172850 60%, #24386a 100%)",
          color: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, fontWeight: 600 }}>
          NABEEN<span style={{ fontSize: 14, marginLeft: 4 }}>®</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 300, lineHeight: 1.05 }}>
            House of luxury men&rsquo;s fabrics
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 26, color: "rgba(255,255,255,0.75)" }}>
            {site.brand.logoTagline.value} · Est. {site.brand.founded.value}
          </div>
        </div>

        <div style={{ display: "flex", height: 2, background: "#b8925a", width: 200 }} />
      </div>
    ),
    size,
  );
}
