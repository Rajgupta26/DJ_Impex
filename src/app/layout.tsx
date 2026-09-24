import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

import { ContactPopup } from "@/components/contact/ContactPopup";
import { Preloader } from "@/components/layout/Preloader";
import { FloatingActions } from "@/components/contact/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { OverlayProvider } from "@/components/layout/OverlayContext";
import { SkipLink } from "@/components/layout/SkipLink";
import { getSite } from "@/lib/content";
import { directionsLink, mailtoLink, telLink, whatsappLink } from "@/lib/contact";
import { jsonLdScript, organizationJsonLd, pageTitle, SITE_URL } from "@/lib/seo";

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
  const site = getSite();
  const whatsapp = whatsappLink();

  return (
    // The font variable must live on <html>: tokens.css resolves --font-sans at :root,
    // so --font-open-sans has to be defined there or the whole value is invalid.
    <html lang="en" className={openSans.variable}>
      <body className="font-sans">
        <SkipLink />

        <OverlayProvider>
          <Header
            navigation={site.navigation}
            contact={{
              whatsapp,
              tel: telLink(),
              telDisplay: site.contact.phonePrimary.display,
              email: mailtoLink("Fabric enquiry"),
              emailDisplay: site.contact.emailPrimary.value,
            }}
          />

          <main id="main">{children}</main>

          <Footer />

          <FloatingActions whatsappHref={whatsapp} directionsHref={directionsLink()} />
          <Preloader />

          <ContactPopup
            whatsappHref={whatsapp}
            line={site.popup.line}
            cta={site.popup.cta}
            delaySeconds={site.popup.delaySeconds}
          />
        </OverlayProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd())}
        />
        <Analytics />
      </body>
    </html>
  );
}
