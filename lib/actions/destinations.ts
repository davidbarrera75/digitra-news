"use server";

import { prisma } from "@/lib/db";

export async function getDestinations() {
  return prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { articleCount: "desc" },
  });
}

export async function getDestinationBySlug(slug: string) {
  return prisma.destination.findUnique({ where: { slug } });
}
