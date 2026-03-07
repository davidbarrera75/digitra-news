import { prisma } from "@/lib/db";
import { getCityConfig, CityConfig } from "./config";
import { fetchWeather } from "./weather";
import { calculateDigitraScore } from "./score";
import { generatePulseSummary } from "./ai-summary";
import { AccommodationData, FlightsData, EventsData, PulseData } from "./types";

/**
 * Collect all data for a city and create/update today's PulseSnapshot.
 */
export async function collectPulseForCity(citySlug: string): Promise<PulseData | null> {
  const config = getCityConfig(citySlug);
  if (!config) throw new Error(`City config not found: ${citySlug}`);

  const destination = await prisma.destination.findUnique({ where: { slug: citySlug } });
  if (!destination) throw new Error(`Destination not found: ${citySlug}`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Collect data in parallel
  const [weather, accommodation, flights] = await Promise.all([
    fetchWeather(config.lat, config.lon),
    getAccommodationData(destination.id),
    getFlightsData(config),
  ]);

  const events = getEventsData(config);

  // Calculate Digitra Score
  const scoreResult = calculateDigitraScore({
    flights,
    accommodation,
    weather,
    events,
  });

  // Upsert snapshot
  const snapshot = await prisma.pulseSnapshot.upsert({
    where: {
      destinationId_date: {
        destinationId: destination.id,
        date: today,
      },
    },
    create: {
      destinationId: destination.id,
      date: today,
      score: scoreResult.score,
      scoreLabel: scoreResult.label,
      flightsData: flights as object || undefined,
      accommodationData: accommodation as object || undefined,
      weatherData: weather as object || undefined,
      eventsData: events as object || undefined,
      seasonType: config.currentSeason,
    },
    update: {
      score: scoreResult.score,
      scoreLabel: scoreResult.label,
      flightsData: flights as object || undefined,
      accommodationData: accommodation as object || undefined,
      weatherData: weather as object || undefined,
      eventsData: events as object || undefined,
      seasonType: config.currentSeason,
    },
    include: { destination: true },
  });

  // Build PulseData for AI summary
  const pulseData: PulseData = {
    id: snapshot.id,
    destinationId: snapshot.destinationId,
    destination: {
      id: destination.id,
      name: destination.name,
      slug: destination.slug,
      country: destination.country,
      latitude: destination.latitude ? Number(destination.latitude) : null,
      longitude: destination.longitude ? Number(destination.longitude) : null,
    },
    date: today.toISOString().split("T")[0],
    score: scoreResult.score,
    scoreLabel: scoreResult.label,
    flights,
    accommodation,
    weather,
    events,
    seasonType: config.currentSeason,
    aiSummary: null,
  };

  // Generate AI summary
  try {
    const summary = await generatePulseSummary(pulseData);
    await prisma.pulseSnapshot.update({
      where: { id: snapshot.id },
      data: { aiSummary: summary },
    });
    pulseData.aiSummary = summary;
  } catch (err) {
    console.error(`[Pulse/AI] Error generating summary for ${citySlug}:`, err);
  }

  return pulseData;
}

/**
 * Collect pulse for all configured cities.
 */
export async function collectAllPulses(): Promise<{ city: string; success: boolean; score?: number; error?: string }[]> {
  const { PULSE_CITIES } = await import("./config");
  const results = [];

  for (const city of PULSE_CITIES) {
    try {
      const pulse = await collectPulseForCity(city.slug);
      results.push({ city: city.name, success: true, score: pulse?.score });
    } catch (err) {
      results.push({ city: city.name, success: false, error: String(err) });
    }
  }

  return results;
}

// --- Data fetchers ---

async function getAccommodationData(destinationId: number): Promise<AccommodationData | null> {
  // Use existing market_data if available
  const metrics = await prisma.marketData.findMany({
    where: { destinationId },
    orderBy: { collectedAt: "desc" },
    take: 10,
  });

  if (metrics.length === 0) return null;

  const byType: Record<string, number> = {};
  for (const m of metrics) {
    if (!byType[m.metricType]) {
      byType[m.metricType] = Number(m.value);
    }
  }

  const airbnbAvg = byType["airbnb_avg"] || 0;
  const bookingAvg = byType["booking_avg"] || 0;
  const avgPrice = byType["avg_nightly_rate"] || Math.round((airbnbAvg + bookingAvg) / 2) || 0;
  const totalListings = byType["total_listings"] || 0;

  // Calculate trend from last two avg_nightly_rate entries
  const avgRates = metrics.filter((m) => m.metricType === "avg_nightly_rate");
  let trend: "up" | "down" | "stable" = "stable";
  let trendPercent = 0;
  if (avgRates.length >= 2) {
    const current = Number(avgRates[0].value);
    const prev = Number(avgRates[1].value);
    if (prev > 0) {
      trendPercent = Math.round(((current - prev) / prev) * 100);
      trend = trendPercent > 2 ? "up" : trendPercent < -2 ? "down" : "stable";
    }
  }

  return {
    airbnbAvg,
    bookingAvg,
    avgPrice,
    minPrice: byType["budget_price"] || Math.round(avgPrice * 0.5),
    listings: totalListings,
    trend,
    trendPercent,
    currency: "USD",
  };
}

async function getFlightsData(config: CityConfig): Promise<FlightsData | null> {
  // For MVP: generate realistic price ranges based on city and season
  // These will be replaced by real Apify data when scrapers are configured
  const basePrices: Record<string, number> = {
    BOG: 150000,
    MDE: 180000,
    CTG: 200000,
    CLO: 170000,
    SMR: 190000,
    BAQ: 185000,
    BGA: 160000,
    ADZ: 280000,
  };

  const seasonMultiplier = config.currentSeason === "alta" ? 1.3 : config.currentSeason === "baja" ? 0.8 : 1.0;
  // Add daily variance
  const dayVariance = 0.9 + Math.random() * 0.2;

  const routes = config.flightRoutes.map((route) => {
    const basePrice = basePrices[config.airportCode] || 200000;
    const price = Math.round(basePrice * seasonMultiplier * dayVariance / 1000) * 1000;
    return {
      from: route.from,
      fromCode: route.fromCode,
      price,
      currency: "COP",
    };
  });

  if (routes.length === 0) return null;

  const prices = routes.map((r) => r.price);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const cheapest = routes.reduce((a, b) => (a.price < b.price ? a : b));

  return {
    routes,
    avgPrice,
    cheapestRoute: cheapest.from,
    updatedAt: new Date().toISOString(),
  };
}

function getEventsData(config: CityConfig): EventsData {
  // Manual events per city — update periodically
  const cityEvents: Record<string, EventsData> = {
    cartagena: {
      season: config.currentSeason,
      events: [
        { name: "Festival Internacional de Cine", date: "2026-03-15", type: "festival" },
        { name: "Temporada de cruceros", date: "2026-03-07", type: "turismo" },
      ],
    },
    medellin: {
      season: config.currentSeason,
      events: [
        { name: "Feria de las Flores prep", date: "2026-08-01", type: "festival" },
      ],
    },
    bogota: {
      season: config.currentSeason,
      events: [
        { name: "Festival Iberoamericano de Teatro", date: "2026-04-01", type: "cultura" },
      ],
    },
    "santa-marta": {
      season: config.currentSeason,
      events: [
        { name: "Temporada de avistamiento de ballenas", date: "2026-07-15", type: "naturaleza" },
      ],
    },
    "san-andres": {
      season: config.currentSeason,
      events: [
        { name: "Green Moon Festival", date: "2026-05-01", type: "festival" },
      ],
    },
  };

  return cityEvents[config.slug] || { season: config.currentSeason, events: [] };
}
