import { ContactPopup } from "@/components/contact/ContactPopup";
import { FloatingActions } from "@/components/contact/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { OverlayProvider } from "@/components/layout/OverlayContext";
import { Preloader } from "@/components/layout/Preloader";
import { SkipLink } from "@/components/layout/SkipLink";
import { getSite } from "@/lib/content";
import { directionsLink, mailtoLink, telLink, whatsappLink } from "@/lib/contact";
import { jsonLdScript, organizationJsonLd } from "@/lib/seo";

/**
 * Everything that wraps a marketing page: header, footer, preloader, pop-up.
 *
 * This used to live in the root layout, which meant every route got it. The
 * admin panel must not: a preloader film and a floating WhatsApp button have no
 * place over a data table. The root layout is now just <html>/<body>, the site
 * routes sit in the (site) group and wear this, and /admin wears its own shell.
 *
 * not-found.tsx has to stay at the app root to catch unmatched URLs, so it
 * renders this directly rather than inheriting it.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const site = getSite();
  const whatsapp = whatsappLink();

  return (
    <>
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

      {/* Organisation markup describes the business, so it ships with the
          marketing pages rather than from the root layout, which /admin shares. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd())} />
    </>
  );
}
