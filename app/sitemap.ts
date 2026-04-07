export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";
import { LOCALES, getLocalePrefix } from "@/lib/i18n/locale-config";

function buildLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    const prefix = getLocalePrefix(locale);
    languages[locale] = `${SITE_URL}${prefix}${path}`;
  }
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, destinations, curatedItems] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true, titleEn: true, category: { select: { slug: true } } },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    }),
    prisma.destination.findMany({
      where: { isActive: true },
      select: { slug: true },
    }),
    prisma.curatedItem.findMany({
      where: { slug: { not: null }, relevanceScore: { gte: 5 } },
      select: { slug: true, createdAt: true, titleEn: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // NOTE: hreflang alternates are only emitted for entries that actually have
  // a real EN translation (currently: articles with titleEn). Static pages,
  // categories, destinations and pulse pages serve the same Spanish content
  // under /en/* and would only generate "alternate page with proper canonical
  // tag" reports in GSC + waste crawl budget if we declared them.
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/pulse`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/buscar`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${SITE_URL}/newsletter`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/acerca`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacidad`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/terminos`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${SITE_URL}/politica-editorial`, changeFrequency: "monthly", priority: 0.2 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/${cat.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const destinationPages: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${SITE_URL}/destinos/${dest.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Only add EN alternates for articles that have translations
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => {
    const path = `/${article.category?.slug || "noticias"}/${article.slug}`;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      ...(article.titleEn ? { alternates: { languages: buildLanguages(path) } } : {}),
    };
  });

  const pulsePages: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${SITE_URL}/pulse/${dest.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const curatedPages: MetadataRoute.Sitemap = curatedItems
    .filter((item) => item.slug)
    .map((item) => {
      const path = `/noticias/${item.slug}`;
      return {
        url: `${SITE_URL}${path}`,
        lastModified: item.createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        ...(item.titleEn ? { alternates: { languages: buildLanguages(path) } } : {}),
      };
    });

  return [...staticPages, ...categoryPages, ...destinationPages, ...pulsePages, ...articlePages, ...curatedPages];
}
