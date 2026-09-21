"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { withReg } from "@/components/ui/Reg";
import type { NavItem } from "@/lib/site";

export type HeaderContact = {
  whatsapp: string;
  tel: string;
  telDisplay: string;
  email: string;
  emailDisplay: string;
};

/**
 * Transparent with the white logo over a page hero; white with the navy logo and
 * a hairline bottom border once the hero has scrolled past.
 *
 * "Past the hero" is measured from the hero itself (every hero carries data-hero),
 * not from a guessed scroll offset, so it is right on the tall home hero and on
 * the shorter inner ones alike. Pages without a hero start solid.
 *
 * The state lives in a data attribute rather than React state: it is a paint
 * concern, it changes on every scroll past the fold, and writing it in a layout
 * effect means the transparent header is correct on the very first frame.
 */
export function Header({ navigation, contact }: { navigation: NavItem[]; contact: HeaderContact }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  // The menu belongs to the page it was opened on, so a navigation closes it
  // without an effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const menuOpen = openedAt === pathname;

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const setSolid = (solid: boolean) => {
      header.dataset.solid = String(solid);
    };

    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      setSolid(true);
      return;
    }

    setSolid(false);
    const observer = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <header
        ref={headerRef}
        data-solid="true"
        className="site-header on-dark fixed inset-x-0 top-0 z-40 border-b border-transparent text-white transition-colors duration-[var(--duration-base)] data-[solid=true]:border-line data-[solid=true]:bg-white data-[solid=true]:text-navy"
      >
        <div className="container-site flex h-[4.5rem] items-center justify-between gap-6 lg:h-[5.25rem]">
          <Link href="/" aria-label="Nabeen, luxury fabrics by DJI: home" className="relative block">
            <Image
              src="/images/logos/nabeen-logo-white.png"
              alt="Nabeen, luxury fabrics by DJI"
              width={1088}
              height={345}
              priority
              className="site-header__logo site-header__logo--white h-8 w-auto lg:h-10"
            />
            <Image
              src="/images/logos/nabeen-logo-navy.png"
              alt=""
              aria-hidden="true"
              width={1088}
              height={345}
              priority
              className="site-header__logo site-header__logo--navy absolute left-0 top-0 h-8 w-auto lg:h-10"
            />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[0.9375rem] font-medium transition-opacity duration-[var(--duration-quick)] ${
                    active ? "border-b border-zari pb-0.5" : "opacity-85 hover:opacity-100"
                  }`}
                >
                  {withReg(item.label)}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpenedAt(pathname)}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="visually-hidden">Open menu</span>
            <span aria-hidden="true" className="grid w-6 gap-[5px]">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setOpenedAt(null)}
        navigation={navigation}
        contact={contact}
      />
    </>
  );
}
