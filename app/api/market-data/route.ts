export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get("destination");
    const metric = searchParams.get("metric") || "avg_nightly_rate";

    if (destination) {
      const dest = await prisma.destination.findUnique({ where: { slug: destination } });
      if (!dest) return NextResponse.json({ error: "Destino no encontrado" }, { status: 404 });

      const data = await prisma.marketData.findMany({
        where: { destinationId: dest.id, metricType: metric },
        orderBy: { collectedAt: "desc" },
        take: 12,
      });

      return NextResponse.json({ destination: dest.name, metric, data });
    }

    // Return latest for all destinations
    const destinations = await prisma.destination.findMany({ where: { isActive: true } });
    const result = [];

    for (const dest of destinations) {
      const latest = await prisma.marketData.findFirst({
        where: { destinationId: dest.id, metricType: metric },
        orderBy: { collectedAt: "desc" },
      });
      if (latest) {
        result.push({
          destination: dest.name,
          slug: dest.slug,
          value: Number(latest.value),
          period: latest.period,
          collectedAt: latest.collectedAt,
        });
      }
    }

    return NextResponse.json({ metric, data: result });
  } catch (err) {
    console.error("[MarketData]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
