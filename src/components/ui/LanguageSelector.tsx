"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

export type LanguageCode = "en" | "fr" | "ar";

export type Language = {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
};

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "fr", label: "French", nativeLabel: "Français", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "ltr" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export function LanguageSelector({
  variant = "header",
  onDark = false,
  className = "",
}: {
  variant?: "header" | "footer" | "mobile";
  onDark?: boolean;
  className?: string;
}) {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("en");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize and load translation engine
  useEffect(() => {
    // 1. Detect saved language preference
    const saved = (localStorage.getItem("nabeen_lang") as LanguageCode) || "en";
    if (["en", "fr", "ar"].includes(saved)) {
      setCurrentLang(saved);
      document.documentElement.dir = "ltr";
      document.documentElement.lang = saved;
    }

    // 2. Setup Google Translate initialization hook
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr,ar",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // 3. Inject Google translate script once
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // 4. Click outside to close dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lang: LanguageCode) => {
    setIsOpen(false);
    if (lang === currentLang) return;

    setCurrentLang(lang);
    localStorage.setItem("nabeen_lang", lang);

    const hostname = window.location.hostname;

    if (lang === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
      window.location.reload();
      return;
    }

    // Set cookie for Google Translate
    document.cookie = `googtrans=/en/${lang}; path=/;`;
    document.cookie = `googtrans=/auto/${lang}; path=/;`;
    if (hostname !== "localhost") {
      document.cookie = `googtrans=/en/${lang}; path=/; domain=.${hostname};`;
      document.cookie = `googtrans=/auto/${lang}; path=/; domain=.${hostname};`;
    }

    // Update HTML dir and lang
    document.documentElement.dir = "ltr";
    document.documentElement.lang = lang;

    // Trigger translate select if already rendered
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }

    // Reload smoothly to apply translation to all DOM components
    window.location.reload();
  };

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  if (variant === "mobile") {
    return (
      <div className={`grid gap-2 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-accent uppercase">
          <Globe size={14} aria-hidden="true" />
          <span>Language / Langue / اللغة</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center justify-center gap-1.5 rounded-md border py-2.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "border-accent bg-accent/15 text-accent font-semibold"
                    : "border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:text-white"
                }`}
              >
                <span>{lang.nativeLabel}</span>
                {isSelected ? <Check size={12} className="text-accent" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div ref={dropdownRef} className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:border-accent hover:text-white"
        >
          <Globe size={14} className="text-accent" aria-hidden="true" />
          <span>{activeLangObj.nativeLabel}</span>
          <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-36 overflow-hidden rounded-lg border border-white/15 bg-navy-deep/95 p-1 shadow-xl backdrop-blur-md">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-accent/20 font-semibold text-accent"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{lang.nativeLabel}</span>
                  {isSelected ? <Check size={12} className="text-accent" /> : null}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Header variant (desktop dropdown)
  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select language"
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-[var(--duration-quick)] ${
          onDark
            ? "border-white/25 bg-white/10 text-white hover:border-accent hover:bg-white/15"
            : "border-slate/25 bg-slate-50 text-navy hover:border-navy hover:bg-white"
        }`}
      >
        <Globe size={13} className="text-accent" aria-hidden="true" />
        <span className="uppercase tracking-wider">{activeLangObj.code}</span>
        <ChevronDown size={11} className={`opacity-70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border p-1 shadow-2xl backdrop-blur-lg z-50 animate-in fade-in zoom-in-95 duration-150 ${
            onDark
              ? "border-white/20 bg-navy-deep/95 text-white"
              : "border-line bg-white/95 text-navy shadow-navy/10"
          }`}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-accent uppercase border-b border-white/10">
            Select Language
          </div>
          <div className="pt-1">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                    isSelected
                      ? onDark
                        ? "bg-accent/20 font-semibold text-accent"
                        : "bg-mist font-semibold text-navy"
                      : onDark
                      ? "text-white/80 hover:bg-white/10 hover:text-white"
                      : "text-slate hover:bg-mist/70 hover:text-navy"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold opacity-60">
                      {lang.code}
                    </span>
                    <span>{lang.nativeLabel}</span>
                  </div>
                  {isSelected ? <Check size={13} className="text-accent" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
