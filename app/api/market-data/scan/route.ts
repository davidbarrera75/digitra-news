import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { scrapeMarketPrices } from "@/lib/apify/scrapers";
import { analyzeMarketData, calculateTrend, saveMarketData } from "@/lib/apify/market-analyzer";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { destinationId, checkIn, checkOut } = await req.json();
    if (!destinationId) {
      return NextResponse.json({ error: "destinationId requerido" }, { status: 400 });
    }

    const destination = await prisma.destination.findUnique({ where: { id: destinationId } });
    if (!destination) {
      return NextResponse.json({ error: "Destino no encontrado" }, { status: 404 });
    }

    const searchTerm = `${destination.name}, ${destination.country}`;

    const result = await scrapeMarketPrices(searchTerm, checkIn, checkOut);

    if (result.listingsCount === 0) {
      return NextResponse.json(
        { error: `No se encontraron listings para ${destination.name}` },
        { status: 500 }
      );
    }

    const analysis = analyzeMarketData(result);
    const trendInfo = await calculateTrend(destinationId, analysis.averageNightlyRate);

    const insights = { ...analysis, ...trendInfo };

    await saveMarketData(destinationId, insights, {
      booking: { avg: result.averagePrice, count: result.listingsCount },
      scannedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      destination: destination.name,
      insights,
      sources: {
        booking: { listings: result.listingsCount, avg: result.averagePrice },
      },
    });
  } catch (err) {
    console.error("[MarketData/Scan]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al escanear mercado" },
      { status: 500 }
    );
  }
}
