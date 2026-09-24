import { SiteChrome } from "@/components/layout/SiteChrome";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

// This file has to sit at the app root to catch unmatched URLs, which means it
// is outside the (site) group and does not inherit its layout. It wears the
// chrome itself so a 404 still has a header and a footer.
export default function NotFound() {
  return (
    <SiteChrome>
      <Section className="page-end pt-[calc(var(--spacing-section)+4.5rem)]">
        <h1 className="t-h1 max-w-[14ch]">This page has moved, or never existed</h1>
        <p className="t-lead measure mt-6">
          The fabric is still here. Try the home page, or talk to our team directly.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/">Go to the home page</ButtonLink>
          <ButtonLink href="/#contact" variant="outline">
            Contact us
          </ButtonLink>
        </div>
      </Section>
    </SiteChrome>
  );
}
