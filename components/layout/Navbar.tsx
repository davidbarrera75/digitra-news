"use client";

import { useState } from "react";
import { SITE_NAME } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import LocalizedLink from "@/components/LocalizedLink";
import LocaleSelector from "@/components/LocaleSelector";

const NAV_KEYS: { key: string; href: string }[] = [
  { key: "nav.destinations", href: "/destinos" },
  { key: "nav.data", href: "/datos" },
  { key: "nav.trends", href: "/tendencias" },
  { key: "nav.rental", href: "/alquiler-vacacional" },
  { key: "nav.news", href: "/noticias" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <LocalizedLink href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-primary">
              {SITE_NAME}
            </span>
          </LocalizedLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_KEYS.map((link) => (
              <LocalizedLink
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                {t(link.key)}
              </LocalizedLink>
            ))}
            <LocalizedLink
              href="/pulse"
              className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Pulse
            </LocalizedLink>
            <LocalizedLink
              href="/buscar"
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label={t("nav.search")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </LocalizedLink>
            <LocaleSelector />
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <LocaleSelector />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-600"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {NAV_KEYS.map((link) => (
              <LocalizedLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-gray-600 hover:text-primary"
              >
                {t(link.key)}
              </LocalizedLink>
            ))}
            <LocalizedLink
              href="/pulse"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-accent"
            >
              Pulse
            </LocalizedLink>
          </div>
        )}
      </nav>
    </header>
  );
}
