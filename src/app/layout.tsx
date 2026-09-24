import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import { pageTitle, SITE_URL } from "@/lib/seo";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: pageTitle("House of luxury men's fabrics"),
    template: "%s | Nabeen® Luxury Fabrics by DJI",
  },
  description:
    "Nabeen®, the luxury fabric brand of D J Impex & Co. Woven in India since 1995 and exported to Africa and the Middle East. Over 1000 designs.",
  applicationName: "Nabeen®",
  openGraph: {
    siteName: "Nabeen® Luxury Fabrics by DJI",
    locale: "en_NG",
    alternateLocale: ["en_IN"],
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#172850",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The font variable must live on <html>: tokens.css resolves --font-sans at :root,
    // so --font-open-sans has to be defined there or the whole value is invalid.
    <html lang="en" className={openSans.variable}>
      <body className="font-sans">
        {/* The marketing chrome lives in (site)/layout.tsx, not here, so that
            /admin can render without a header, footer or preloader. */}
        {children}

        <Analytics />
      </body>
    </html>
  );
}
