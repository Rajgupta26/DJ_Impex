"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { MobileMenu } from "@/components/layout/MobileMenu";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
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
 */
export function Header({ navigation, contact }: { navigation: NavItem[]; contact: HeaderContact }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  // The menu belongs to the page it was opened on, so a navigation closes it
  // without an effect.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const menuOpen = openedAt === pathname;
  const [currentHash, setCurrentHash] = useState<string>("");
  const [isSolid, setIsSolid] = useState(true);

  useEffect(() => {
    const updateHash = () => {
      if (typeof window !== "undefined") {
        setCurrentHash(window.location.hash);
      }
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateHash);

    if (pathname === "/") {
      const journalEl = document.getElementById("journal");
      const contactEl = document.getElementById("contact");

      const handleIntersection = () => {
        const scrollY = window.scrollY;
        const contactTop = contactEl ? contactEl.offsetTop - 300 : Infinity;
        const journalTop = journalEl ? journalEl.offsetTop - 200 : Infinity;

        if (contactEl && scrollY >= contactTop) {
          setCurrentHash("#contact");
        } else if (journalEl && scrollY >= journalTop) {
          setCurrentHash("#journal");
        } else {
          setCurrentHash("");
        }
      };

      const observer = new IntersectionObserver(
        () => {
          handleIntersection();
        },
        { rootMargin: "-80px 0px -40% 0px", threshold: [0, 0.1, 0.5] }
      );

      if (journalEl) observer.observe(journalEl);
      if (contactEl) observer.observe(contactEl);
      window.addEventListener("scroll", handleIntersection, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", handleIntersection);
        window.removeEventListener("hashchange", updateHash);
        window.removeEventListener("popstate", updateHash);
      };
    }

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const setSolid = (solid: boolean) => {
      header.dataset.solid = String(solid);
      setIsSolid(solid);
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
        <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:px-8 lg:h-[5.25rem] lg:gap-6 lg:px-12 xl:px-16">
          <Link href="/" aria-label="DJ Impex & Co. Home" className="relative flex items-center">
            {/* Mobile emblem: Displays DJI prism crest without duplicate 'Nabeen' wordmark on mobile */}
            <div className="block sm:hidden">
              <Image
                src="/images/logos/dji-logo-transparent.png"
                alt="D J Impex & Co."
                width={120}
                height={120}
                priority
                className="h-9 w-auto object-contain drop-shadow-sm transition-transform duration-200 active:scale-95"
              />
            </div>

            {/* Desktop & Tablet: Full NABEEN wordmark */}
            <div className="relative hidden sm:block">
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
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 lg:gap-7">
            <nav aria-label="Main" className="hidden items-center gap-7 xl:flex">
              {navigation.map((item) => {
                const isJournal = item.href === "/#journal";
                const isContact = item.href === "/#contact";
                const isHome = item.href === "/";
                const active = isJournal
                  ? pathname === "/" && currentHash === "#journal"
                  : isContact
                  ? pathname === "/" && currentHash === "#contact"
                  : isHome
                  ? pathname === "/" && currentHash !== "#journal" && currentHash !== "#contact"
                  : pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (isJournal) {
                        setCurrentHash("#journal");
                      } else if (isContact) {
                        setCurrentHash("#contact");
                      } else if (isHome) {
                        setCurrentHash("");
                      }
                    }}
                    aria-current={active ? "page" : undefined}
                    className={`border-b pb-0.5 text-[0.9375rem] font-medium transition-all duration-[var(--duration-quick)] ${
                      active
                        ? "border-accent opacity-100"
                        : "border-transparent opacity-85 hover:border-accent hover:opacity-100"
                    }`}
                  >
                    {withReg(item.label)}
                  </Link>
                );
              })}
            </nav>

            <LanguageSelector variant="header" onDark={!isSolid} />

            <button
              type="button"
              onClick={() => setOpenedAt(pathname)}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-lg p-2 transition-colors hover:bg-white/10 active:scale-95 xl:hidden"
            >
              <span className="visually-hidden">Open menu</span>
              <span aria-hidden="true" className="grid w-5 gap-[5px]">
                <span className="h-0.5 w-full rounded-full bg-current" />
                <span className="h-0.5 w-full rounded-full bg-current" />
                <span className="h-0.5 w-full rounded-full bg-current" />
              </span>
            </button>
          </div>
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
