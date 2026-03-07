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
