import { runActor, getDatasetItems } from "./client";

// Flexible type for varied Apify actor outputs
interface ApifyItem {
  [key: string]: unknown;
}

function getStr(val: unknown): string {
  return val ? String(val) : "";
}

function getNum(val: unknown): number {
  return val ? Number(val) || 0 : 0;
}

interface ScrapedListing {
  name: string;
  price: number;
  currency: string;
  url: string;
  rating?: number;
  reviews?: number;
  type?: string;
}

export interface ScrapingResult {
  averagePrice: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  listingsCount: number;
  source: string;
  rawListings: ScrapedListing[];
}

function getNextWeekDates() {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 7);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 2);
  return {
    checkIn: checkIn.toISOString().split("T")[0],
    checkOut: checkOut.toISOString().split("T")[0],
  };
}

function calculateStats(prices: number[]): { avg: number; median: number; min: number; max: number } {
  if (prices.length === 0) return { avg: 0, median: 0, min: 0, max: 0 };
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return {
    avg: Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length),
    median: sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2),
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

export async function scrapeAirbnbPrices(city: string, checkIn?: string, checkOut?: string): Promise<ScrapingResult> {
  const dates = checkIn && checkOut ? { checkIn, checkOut } : getNextWeekDates();
  const nights = Math.max(1, Math.round(
    (new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / 86400000
  ));

  const datasetId = await runActor("tri_angle/airbnb-scraper", {
    locationQueries: [city],
    checkIn: dates.checkIn,
    checkOut: dates.checkOut,
    currency: "USD",
  });

  const items = await getDatasetItems<ApifyItem>(datasetId);

  const listings: ScrapedListing[] = items
    .filter((item) => {
      const priceObj = item.price as Record<string, unknown> | undefined;
      return priceObj?.price;
    })
    .map((item) => {
      const priceObj = item.price as Record<string, unknown> | undefined;
      const priceStr = getStr(priceObj?.price);
      const totalPrice = Number(priceStr.replace(/[^0-9.]/g, "")) || 0;
      const nightlyPrice = Math.round(totalPrice / nights);
      const ratingObj = item.rating as Record<string, unknown> | undefined;
      return {
        name: getStr(item.sharingConfigTitle || item.seoTitle),
        price: nightlyPrice,
        currency: "USD",
        url: getStr(item.url),
        rating: getNum(ratingObj?.guestSatisfaction),
        reviews: getNum(ratingObj?.reviewsCount),
        type: getStr(item.roomType),
      };
    })
    .filter((l) => l.price > 0 && l.price < 5000);

  const prices = listings.map((l) => l.price);
  const stats = calculateStats(prices);

  return {
    averagePrice: stats.avg,
    medianPrice: stats.median,
    minPrice: stats.min,
    maxPrice: stats.max,
    listingsCount: listings.length,
    source: "Airbnb",
    rawListings: listings,
  };
}

export async function scrapeBookingPrices(city: string, checkIn?: string, checkOut?: string): Promise<ScrapingResult> {
  const dates = checkIn && checkOut ? { checkIn, checkOut } : getNextWeekDates();
  const nights = Math.max(1, Math.round(
    (new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / 86400000
  ));

  const datasetId = await runActor("voyager/booking-scraper", {
    search: city,
    checkIn: dates.checkIn,
    checkOut: dates.checkOut,
    currency: "USD",
    maxItems: 80,
    sortBy: "distance_from_search",
  });

  const items = await getDatasetItems<ApifyItem>(datasetId);

  const listings: ScrapedListing[] = items
    .filter((item) => getNum(item.price) > 0)
    .map((item) => {
      const totalPrice = getNum(item.price);
      const nightlyPrice = Math.round(totalPrice / nights);
      return {
        name: getStr(item.name),
        price: nightlyPrice,
        currency: "USD",
        url: getStr(item.url),
        rating: getNum(item.rating),
        reviews: getNum(item.reviews),
        type: getStr(item.type || "hotel"),
      };
    })
    .filter((l) => l.price > 0 && l.price < 5000);

  const prices = listings.map((l) => l.price);
  const stats = calculateStats(prices);

  return {
    averagePrice: stats.avg,
    medianPrice: stats.median,
    minPrice: stats.min,
    maxPrice: stats.max,
    listingsCount: listings.length,
    source: "Booking.com",
    rawListings: listings,
  };
}
