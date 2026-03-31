import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import LayoutShell from "@/components/layout/LayoutShell";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getServerLocale } from "@/lib/i18n/server";
import { getAlternates } from "@/lib/i18n/alternates";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const META: Record<string, { title: string; description: string }> = {
  es: {
    title: `${SITE_NAME} — Turismo basado en datos`,
    description: "El primer medio turístico basado en datos de Latinoamérica. Precios de Airbnb, tendencias de viaje, destinos y análisis del mercado turístico.",
  },
  en: {
    title: `${SITE_NAME} — Data-driven Tourism`,
    description: "Latin America's first data-driven tourism media. Airbnb pricing, travel trends, destinations and tourism market analysis.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const alternates = await getAlternates();
  const meta = META[locale] || META.es;

  return {
    title: {
      default: meta.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: meta.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
      types: {
        "application/rss+xml": `${SITE_URL}/feed.xml`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_US" : "es_CO",
    },
    twitter: {
      card: "summary_large_image",
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-body">
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/logo.png`,
                description: META[locale]?.description || META.es.description,
                sameAs: ["https://digitra.rentals"],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL,
                inLanguage: [locale === "en" ? "en" : "es"],
                potentialAction: {
                  "@type": "SearchAction",
                  target: `${SITE_URL}/buscar?q={search_term_string}`,
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
        <LocaleProvider locale={locale}>
          <LayoutShell>{children}</LayoutShell>
        </LocaleProvider>
      </body>
    </html>
  );
}
