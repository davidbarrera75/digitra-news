import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { scrapeAirbnbPrices, scrapeBookingPrices } from "@/lib/apify/scrapers";
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

    // Scrape both platforms in parallel
    const [airbnbResult, bookingResult] = await Promise.allSettled([
      scrapeAirbnbPrices(searchTerm, checkIn, checkOut),
      scrapeBookingPrices(searchTerm, checkIn, checkOut),
    ]);

    const airbnb = airbnbResult.status === "fulfilled" ? airbnbResult.value : null;
    const booking = bookingResult.status === "fulfilled" ? bookingResult.value : null;

    if (!airbnb && !booking) {
      return NextResponse.json(
        {
          error: "No se pudieron obtener datos de ninguna plataforma",
          details: {
            airbnb: airbnbResult.status === "rejected" ? String(airbnbResult.reason) : null,
            booking: bookingResult.status === "rejected" ? String(bookingResult.reason) : null,
          },
        },
        { status: 500 }
      );
    }

    const analysis = analyzeMarketData(airbnb, booking);
    const trendInfo = await calculateTrend(destinationId, analysis.averageNightlyRate);

    const insights = { ...analysis, ...trendInfo };

    await saveMarketData(destinationId, insights, {
      airbnb: airbnb ? { avg: airbnb.averagePrice, count: airbnb.listingsCount } : null,
      booking: booking ? { avg: booking.averagePrice, count: booking.listingsCount } : null,
      scannedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      destination: destination.name,
      insights,
      sources: {
        airbnb: airbnb ? { listings: airbnb.listingsCount, avg: airbnb.averagePrice } : "failed",
        booking: booking ? { listings: booking.listingsCount, avg: booking.averagePrice } : "failed",
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
