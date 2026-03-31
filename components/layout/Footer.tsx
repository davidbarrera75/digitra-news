"use client";

import { SITE_NAME } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import LocalizedLink from "@/components/LocalizedLink";
import FooterNewsletter from "./FooterNewsletter";

const NAV_KEYS: { key: string; href: string }[] = [
  { key: "nav.destinations", href: "/destinos" },
  { key: "nav.data", href: "/datos" },
  { key: "nav.trends", href: "/tendencias" },
  { key: "nav.rental", href: "/alquiler-vacacional" },
  { key: "nav.news", href: "/noticias" },
];

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-display font-bold text-white mb-3">
              {SITE_NAME}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("footer.brand")}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 font-body">
              {t("footer.sections")}
            </h4>
            <ul className="space-y-2">
              {NAV_KEYS.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {t(link.key)}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Digitra */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 font-body">
              {t("footer.digitra")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://digitra.rentals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Digitra Rentals
                </a>
              </li>
              <li>
                <LocalizedLink href="/pulse" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Pulse
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/newsletter" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Newsletter
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/acerca" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("nav.about")}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink href="/contacto" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t("nav.contact")}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* Newsletter mini */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 font-body">
              {t("footer.newsletter")}
            </h4>
            <p className="text-gray-400 text-sm mb-3">
              {t("footer.newsletterText")}
            </p>
            <FooterNewsletter />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 space-y-3">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            <LocalizedLink href="/privacidad" className="text-gray-500 hover:text-gray-300 transition-colors">
              {t("footer.privacy")}
            </LocalizedLink>
            <LocalizedLink href="/terminos" className="text-gray-500 hover:text-gray-300 transition-colors">
              {t("footer.terms")}
            </LocalizedLink>
            <LocalizedLink href="/politica-editorial" className="text-gray-500 hover:text-gray-300 transition-colors">
              {t("footer.editorial")}
            </LocalizedLink>
          </div>
          <p className="text-center text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} {SITE_NAME}. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
