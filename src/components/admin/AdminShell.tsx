"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  Images,
  LayoutDashboard,
  LayoutPanelTop,
  Mail,
  Menu,
  Moon,
  Newspaper,
  Sun,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/images", label: "Image gallery", Icon: Images },
  { href: "/admin/page-images", label: "Page images", Icon: LayoutPanelTop },
  { href: "/admin/blogs", label: "Blog manager", Icon: Newspaper },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Mail },
] as const;

const THEME_KEY = "nabeen-admin-theme";
export const THEME_CLASS = "admin-dark";

export function AdminShell({ children, unprotected }: { children: React.ReactNode; unprotected: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * The theme lives on <html> as a class, not in React state.
   *
   * The inline script in the admin layout applies the stored choice before the
   * first paint, which is the only way to avoid a flash of the wrong theme.
   * Keeping a second copy in state would then either disagree with the
   * server-rendered markup on hydration or need an effect to catch up, so the
   * toggle writes straight to the DOM and both icons are rendered with CSS
   * choosing between them.
   */
  function toggleTheme() {
    const next = !document.documentElement.classList.contains(THEME_CLASS);
    document.documentElement.classList.toggle(THEME_CLASS, next);
    try {
      window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* Blocked storage: the toggle still works, it just is not remembered. */
    }
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="lg:flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
            <Link href="/admin" className="text-sm font-semibold tracking-[0.18em] uppercase">
              Nabeen<sup className="text-[0.6em]">®</sup> admin
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="text-slate-500 lg:hidden"
              aria-label="Close the menu"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Admin sections" className="space-y-1 p-3">
            {NAV.map(({ href, label, Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-navy text-white dark:bg-slate-800 dark:text-white"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-200 p-3 dark:border-slate-800">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ExternalLink size={17} aria-hidden="true" />
              View the website
            </Link>
          </div>
        </aside>

        {menuOpen ? (
          <button
            type="button"
            aria-label="Close the menu"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          />
        ) : null}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:px-8 dark:border-slate-800 dark:bg-slate-900/90">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="text-slate-600 lg:hidden dark:text-slate-300"
              aria-label="Open the menu"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <p className="flex-1 truncate text-sm text-slate-500 dark:text-slate-400">
              Content and enquiries, stored in /data
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Switch between the light and dark theme"
            >
              <Moon size={16} aria-hidden="true" className="dark:hidden" />
              <Sun size={16} aria-hidden="true" className="hidden dark:block" />
            </button>
          </header>

          {unprotected ? (
            <p className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 lg:px-8 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              This panel has no sign-in. Set ADMIN_PASSWORD in the environment to require a password before
              anyone can read enquiries or change content.
            </p>
          ) : null}

          <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
