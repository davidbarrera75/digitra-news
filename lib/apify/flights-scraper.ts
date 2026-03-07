import { runActor, getDatasetItems } from "./client";

interface GoogleFlightResult {
  [key: string]: unknown;
}

export interface FlightPrice {
  from: string;
  fromCode: string;
  toCode: string;
  price: number;
  currency: string;
  airline: string;
}

/**
 * Scrape Google Flights for a single route using Apify.
 * Actor: misceres/google-flights-scraper
 */
export async function scrapeFlightRoute(
  fromCode: string,
  toCode: string,
  fromName: string
): Promise<FlightPrice | null> {
  // Search for flights 7 days from now (next week prices)
  const departureDate = new Date();
  departureDate.setDate(departureDate.getDate() + 7);
  const dateStr = departureDate.toISOString().split("T")[0];

  try {
    const datasetId = await runActor(
      "misceres/google-flights-scraper",
      {
        departureAirportCode: fromCode,
        arrivalAirportCode: toCode,
        departureDate: dateStr,
        adults: 1,
        currency: "COP",
        tripType: "ONE_WAY",
        maxResults: 5,
      },
      120
    );

    const items = await getDatasetItems<GoogleFlightResult>(datasetId);

    if (!items || items.length === 0) return null;

    // Extract cheapest price from results
    let cheapestPrice = Infinity;
    let cheapestAirline = "";

    for (const item of items) {
      // Handle various output formats from the actor
      const price = extractPrice(item);
      const airline = extractAirline(item);

      if (price > 0 && price < cheapestPrice) {
        cheapestPrice = price;
        cheapestAirline = airline;
      }

      // Some actors nest flights in an array
      const flights = item.flights as GoogleFlightResult[] | undefined;
      if (Array.isArray(flights)) {
        for (const flight of flights) {
          const fp = extractPrice(flight);
          const fa = extractAirline(flight);
          if (fp > 0 && fp < cheapestPrice) {
            cheapestPrice = fp;
            cheapestAirline = fa;
          }
        }
      }
    }

    if (cheapestPrice === Infinity) return null;

    return {
      from: fromName,
      fromCode,
      toCode,
      price: Math.round(cheapestPrice),
      currency: "COP",
      airline: cheapestAirline,
    };
  } catch (err) {
    console.error(`[Flights] Error scraping ${fromCode}->${toCode}:`, err);
    return null;
  }
}

function extractPrice(item: GoogleFlightResult): number {
  // Try common field names
  const candidates = [item.price, item.totalPrice, item.amount, item.cost];
  for (const c of candidates) {
    if (typeof c === "number" && c > 0) return c;
    if (typeof c === "string") {
      const n = Number(c.replace(/[^0-9.]/g, ""));
      if (n > 0) return n;
    }
  }
  // Nested pricing object
  const pricing = item.pricing as Record<string, unknown> | undefined;
  if (pricing?.total) {
    const n = Number(String(pricing.total).replace(/[^0-9.]/g, ""));
    if (n > 0) return n;
  }
  return 0;
}

function extractAirline(item: GoogleFlightResult): string {
  const candidates = [item.airline, item.airlineName, item.carrier, item.operatingAirline];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c;
  }
  // Nested
  const legs = item.legs as GoogleFlightResult[] | undefined;
  if (Array.isArray(legs) && legs.length > 0) {
    return String(legs[0].airline || legs[0].carrier || "");
  }
  return "";
}

/**
 * Scrape all routes for a city. Runs routes in parallel.
 * Returns results for routes that succeeded, null for failures.
 */
export async function scrapeAllFlightRoutes(
  routes: { from: string; fromCode: string }[],
  toCode: string
): Promise<(FlightPrice | null)[]> {
  const results = await Promise.allSettled(
    routes.map((route) => scrapeFlightRoute(route.fromCode, toCode, route.from))
  );

  return results.map((r) => (r.status === "fulfilled" ? r.value : null));
}
