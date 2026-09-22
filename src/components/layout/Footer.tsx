import Image from "next/image";
import Link from "next/link";

import { Selvedge } from "@/components/layout/Selvedge";
import { withReg } from "@/components/ui/Reg";
import { TbcTag } from "@/components/ui/TbcTag";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { getSite } from "@/lib/content";
import { directionsLink, mailtoLink, telLink } from "@/lib/contact";
import { visible } from "@/lib/site";

export function Footer() {
  const site = getSite();
  const { contact } = site;
  const socials = visible(site.social);
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-navy-deep text-white">
      <Selvedge variant="footer" />

      <div className="container-site grid gap-12 pb-14 pt-16 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.2fr] lg:gap-16 lg:pt-20">
        <div>
          <Image
            src="/images/logos/nabeen-logo-white.png"
            alt="Nabeen, luxury fabrics by DJI"
            width={1088}
            height={345}
            className="h-11 w-auto"
          />
          <p className="mt-6 max-w-[24rem] text-white/60">
            {withReg(`${site.brand.brand.value} is the fabric brand of ${site.brand.company.value}, Mumbai. Woven in India since ${site.brand.founded.value} for ${site.brand.markets.value}.`)}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="t-small mb-4 font-semibold text-accent">Explore</h2>
          <ul className="grid gap-2.5 text-white/75">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {withReg(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <h2 className="t-small mb-4 font-semibold text-accent">Talk to us</h2>
            <ul className="grid gap-2.5 text-white/75">
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
                <TbcTag status={contact.phonePrimary.status} note={contact.phonePrimary.note} />
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
                <address className="not-italic text-white/60">
                  {contact.address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <TrackedLink
                  href={directionsLink()}
                  event="directions_click"
                  location="footer"
                  className="mt-2 inline-block text-white/75 transition-colors hover:text-white"
                >
                  Get directions
                </TrackedLink>
                <TbcTag status={contact.address.status} note={contact.address.note} />
              </li>
            </ul>
          </div>

          {socials.length > 0 ? (
            <div>
              <h2 className="t-small mb-4 font-semibold text-accent">Follow</h2>
              <ul className="grid gap-2.5 text-white/75">
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
          <li>
            <TbcTag status={site.fabricTypes.status} note={site.fabricTypes._note} />
          </li>
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
