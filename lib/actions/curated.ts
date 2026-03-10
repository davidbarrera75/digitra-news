"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCuratedSources() {
  return prisma.curatedSource.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });
}

export async function createCuratedSource(data: {
  name: string;
  url: string;
  rssFeedUrl?: string;
  categoryId?: number;
}) {
  const source = await prisma.curatedSource.create({
    data: {
      name: data.name,
      url: data.url,
      rssFeedUrl: data.rssFeedUrl || null,
      categoryId: data.categoryId || null,
    },
  });
  revalidatePath("/admin/curated/sources");
  return source;
}

export async function updateCuratedSource(
  id: number,
  data: { name?: string; url?: string; rssFeedUrl?: string; categoryId?: number; isActive?: boolean }
) {
  const source = await prisma.curatedSource.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/curated/sources");
  return source;
}

export async function deleteCuratedSource(id: number) {
  await prisma.curatedSource.delete({ where: { id } });
  revalidatePath("/admin/curated/sources");
}

export async function getLatestCuratedItems(limit = 4) {
  return prisma.curatedItem.findMany({
    where: { relevanceScore: { gte: 5 } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getCuratedItemBySlug(slug: string) {
  // Try exact match first
  const item = await prisma.curatedItem.findUnique({
    where: { slug },
    include: { source: true, category: true },
  });
  if (item) return item;

  // Fallback: try matching without trailing number (for Google-indexed URLs like slug-705582)
  const withoutTrailingNum = slug.replace(/-\d+$/, "");
  if (withoutTrailingNum !== slug) {
    const fuzzy = await prisma.curatedItem.findFirst({
      where: {
        slug: { startsWith: withoutTrailingNum },
        relevanceScore: { gte: 5 },
      },
      include: { source: true, category: true },
    });
    if (fuzzy) return fuzzy;
  }

  return null;
}

export async function getRelatedCuratedItems(currentId: number, limit = 4) {
  return prisma.curatedItem.findMany({
    where: {
      id: { not: currentId },
      relevanceScore: { gte: 5 },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllCuratedItemSlugs() {
  return prisma.curatedItem.findMany({
    where: {
      slug: { not: null },
      relevanceScore: { gte: 5 },
    },
    select: { slug: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}
