"use server";

import { prisma } from "@/lib/db";

export async function getMarketDataByDestination(destinationId: number) {
  return prisma.marketData.findMany({
    where: { destinationId },
    orderBy: { collectedAt: "desc" },
    take: 50,
  });
}

export async function getLatestMarketSummary() {
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const result = [];
  for (const dest of destinations) {
    const latest = await prisma.marketData.findFirst({
      where: { destinationId: dest.id, metricType: "avg_nightly_rate" },
      orderBy: { collectedAt: "desc" },
    });

    const listings = await prisma.marketData.findFirst({
      where: { destinationId: dest.id, metricType: "total_listings" },
      orderBy: { collectedAt: "desc" },
    });

    // Get previous avg for trend
    const allAvgs = await prisma.marketData.findMany({
      where: { destinationId: dest.id, metricType: "avg_nightly_rate" },
      orderBy: { collectedAt: "desc" },
      take: 2,
    });

    let trend = 0;
    if (allAvgs.length === 2) {
      const current = Number(allAvgs[0].value);
      const prev = Number(allAvgs[1].value);
      if (prev > 0) trend = Math.round(((current - prev) / prev) * 100);
    }

    result.push({
      destination: dest,
      avgPrice: latest ? Number(latest.value) : null,
      totalListings: listings ? Number(listings.value) : null,
      trend,
      lastUpdated: latest?.collectedAt || null,
    });
  }

  return result;
}

export async function getAllDestinations() {
  return prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getDestinationDetail(destinationSlug: string) {
  const dest = await prisma.destination.findUnique({
    where: { slug: destinationSlug },
  });
  if (!dest) return null;

  const metrics = await prisma.marketData.findMany({
    where: { destinationId: dest.id },
    orderBy: { collectedAt: "desc" },
    take: 100,
  });

  // Group by metricType
  const grouped: Record<string, { value: number; collectedAt: Date }[]> = {};
  for (const m of metrics) {
    if (!grouped[m.metricType]) grouped[m.metricType] = [];
    grouped[m.metricType].push({ value: Number(m.value), collectedAt: m.collectedAt });
  }

  return { destination: dest, metrics: grouped };
}
