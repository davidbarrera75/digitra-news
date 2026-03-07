import { prisma } from "@/lib/db";
import { ScrapingResult } from "./scrapers";

export interface MarketInsights {
  averageNightlyRate: number;
  airbnbAvg: number;
  bookingAvg: number;
  priceRange: { budget: number; mid: number; premium: number };
  totalListings: number;
  airbnbListings: number;
  bookingListings: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
}

export function analyzeMarketData(
  airbnbData: ScrapingResult | null,
  bookingData: ScrapingResult | null
): Omit<MarketInsights, "trend" | "trendPercent"> {
  const airbnbAvg = airbnbData?.averagePrice || 0;
  const bookingAvg = bookingData?.averagePrice || 0;

  const prices = [
    ...(airbnbData?.rawListings.map((l) => l.price) || []),
    ...(bookingData?.rawListings.map((l) => l.price) || []),
  ].sort((a, b) => a - b);

  const avgRate = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  const q1 = Math.floor(prices.length * 0.25);
  const q2 = Math.floor(prices.length * 0.5);
  const q3 = Math.floor(prices.length * 0.75);

  return {
    averageNightlyRate: avgRate,
    airbnbAvg,
    bookingAvg,
    priceRange: {
      budget: prices[q1] || 0,
      mid: prices[q2] || 0,
      premium: prices[q3] || 0,
    },
    totalListings: (airbnbData?.listingsCount || 0) + (bookingData?.listingsCount || 0),
    airbnbListings: airbnbData?.listingsCount || 0,
    bookingListings: bookingData?.listingsCount || 0,
  };
}

export async function calculateTrend(
  destinationId: number,
  currentAvg: number
): Promise<{ trend: "up" | "down" | "stable"; trendPercent: number }> {
  const previous = await prisma.marketData.findFirst({
    where: { destinationId, metricType: "avg_nightly_rate" },
    orderBy: { collectedAt: "desc" },
  });

  if (!previous) return { trend: "stable", trendPercent: 0 };

  const prevValue = Number(previous.value);
  if (prevValue === 0) return { trend: "stable", trendPercent: 0 };

  const pct = Math.round(((currentAvg - prevValue) / prevValue) * 100);
  if (Math.abs(pct) < 2) return { trend: "stable", trendPercent: 0 };
  return { trend: pct > 0 ? "up" : "down", trendPercent: pct };
}

export async function saveMarketData(destinationId: number, insights: MarketInsights, rawData?: object) {
  const metrics = [
    { type: "avg_nightly_rate", value: insights.averageNightlyRate },
    { type: "airbnb_avg", value: insights.airbnbAvg },
    { type: "booking_avg", value: insights.bookingAvg },
    { type: "budget_price", value: insights.priceRange.budget },
    { type: "mid_price", value: insights.priceRange.mid },
    { type: "premium_price", value: insights.priceRange.premium },
    { type: "total_listings", value: insights.totalListings },
  ];

  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  await prisma.$transaction(
    metrics.map((m) =>
      prisma.marketData.create({
        data: {
          destinationId,
          metricType: m.type,
          value: m.value,
          period,
          source: "apify",
          rawData: m.type === "avg_nightly_rate" ? (rawData as object) : undefined,
          collectedAt: now,
        },
      })
    )
  );
}

export async function getLatestMarketData(destinationId?: number) {
  const where = destinationId
    ? { destinationId, metricType: "avg_nightly_rate" }
    : { metricType: "avg_nightly_rate" };

  return prisma.marketData.findMany({
    where,
    orderBy: { collectedAt: "desc" },
    take: destinationId ? 1 : 20,
    include: { destination: true },
  });
}
