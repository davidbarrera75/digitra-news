export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, destinations, curatedItems] = await Promise.all([
    prisma.article.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
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
      select: { slug: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/pulse`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/buscar`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${SITE_URL}/newsletter`, changeFrequency: "monthly", priority: 0.3 },
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

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/${article.category?.slug || "noticias"}/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const pulsePages: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${SITE_URL}/pulse/${dest.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const curatedPages: MetadataRoute.Sitemap = curatedItems
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${SITE_URL}/noticias/${item.slug}`,
      lastModified: item.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...destinationPages, ...pulsePages, ...articlePages, ...curatedPages];
}
