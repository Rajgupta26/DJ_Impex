import Image from "next/image";
import Link from "next/link";

import { withReg } from "@/components/ui/Reg";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { getSite } from "@/lib/content";
import { mailtoLink, telLink } from "@/lib/contact";
import { visible } from "@/lib/site";

export function Footer() {
  const site = getSite();
  const { contact } = site;
  const socials = visible(site.social);
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-navy-deep text-white">
      <div className="container-site grid items-start gap-12 pb-16 pt-16 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1.3fr_1fr] lg:gap-12 lg:pb-20 lg:pt-20">
        <div className="flex flex-col">
          <Image
            src="/images/logos/nabeen-logo-white.png"
            alt="Nabeen, luxury fabrics by DJI"
            width={1088}
            height={345}
            className="h-10 w-auto self-start"
          />
          <p className="mt-6 max-w-[22rem] leading-relaxed text-white/60">
            {withReg(
              `${site.brand.brand.value} is the fabric brand of ${site.brand.company.value}, Mumbai. Woven in India since ${site.brand.founded.value} for ${site.brand.markets.value}.`,
            )}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="t-small mb-5 font-semibold text-zari">Explore</h2>
          <ul className="grid gap-3 text-white/75">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {withReg(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="t-small mb-5 font-semibold text-zari">Talk to us</h2>
          <ul className="grid gap-3 text-white/75">
            <li>
              <TrackedLink
                href={telLink()}
                event="call_click"
                location="footer"
                external={false}
                className="transition-colors hover:text-white"
              >
                {contact.phonePrimary.display}
              </TrackedLink>
            </li>
            <li>
              <TrackedLink
                href={mailtoLink("Fabric enquiry")}
                event="email_click"
                location="footer"
                external={false}
                className="transition-colors hover:text-white"
              >
                {contact.emailPrimary.value}
              </TrackedLink>
            </li>
            <li className="mt-1">
              <address className="not-italic leading-relaxed text-white/60">
                {contact.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
          </ul>
        </div>

        {socials.length > 0 ? (
          <div>
            <h2 className="t-small mb-5 font-semibold text-zari">Follow</h2>
            <ul className="grid gap-3 text-white/75">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    {social.name}
                    {social.handle ? <span className="text-white/45"> {social.handle}</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="container-site border-t border-white/12 py-8">
        <h2 className="visually-hidden">Fabrics</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {site.fabricTypes.items.map((fabric) => (
            <li key={fabric.slug}>
              <Link
                href={`/nabeen#${fabric.slug}`}
                className="t-small text-white/60 transition-colors hover:text-white"
              >
                {fabric.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-site flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/12 py-7">
        {/* The parent-company mark, per ASSETS.md. */}
        <Image
          src="/images/logos/dji-logo-transparent.png"
          alt="D J Impex & Co."
          width={736}
          height={735}
          className="h-10 w-10 shrink-0"
        />
        <p className="t-small text-white/50">
          © {year} {site.brand.company.value.replace(/\.$/, "")}. All rights reserved.
        </p>
        <p className="t-small text-white/50">{site.brand.starExportHouse.value}</p>
      </div>
    </footer>
  );
}
