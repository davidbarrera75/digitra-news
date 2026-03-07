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

  const datasetId = await runActor("tri_angle/airbnb-rooms-urls-scraper", {
    location: city,
    checkIn: dates.checkIn,
    checkOut: dates.checkOut,
    currency: "USD",
    maxItems: 80,
  });

  const items = await getDatasetItems<ApifyItem>(datasetId);

  const listings: ScrapedListing[] = items
    .filter((item) => {
      const pricing = item.pricing as Record<string, unknown> | undefined;
      const rate = pricing?.rate as Record<string, unknown> | undefined;
      return item.price || rate?.amount;
    })
    .map((item) => {
      const pricing = item.pricing as Record<string, unknown> | undefined;
      const rate = pricing?.rate as Record<string, unknown> | undefined;
      return {
        name: getStr(item.name || item.title),
        price: getNum(item.price || rate?.amount),
        currency: "USD",
        url: getStr(item.url),
        rating: getNum(item.rating || item.stars),
        reviews: getNum(item.reviewsCount || item.numberOfGuests),
        type: getStr(item.roomType || item.type),
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

  const datasetId = await runActor("voyager/booking-scraper", {
    search: city,
    checkIn: dates.checkIn,
    checkOut: dates.checkOut,
    currency: "USD",
    maxItems: 80,
    sortBy: "popularity",
  });

  const items = await getDatasetItems<ApifyItem>(datasetId);

  const listings: ScrapedListing[] = items
    .filter((item) => item.price || item.priceFormatted)
    .map((item) => {
      let price = getNum(item.price);
      if (!price && item.priceFormatted) {
        price = Number(String(item.priceFormatted).replace(/[^0-9.]/g, "")) || 0;
      }
      return {
        name: getStr(item.name || item.hotel_name),
        price,
        currency: "USD",
        url: getStr(item.url || item.link),
        rating: getNum(item.rating || item.review_score),
        reviews: getNum(item.reviewCount || item.review_nr),
        type: getStr(item.type || item.accommodation_type || "hotel"),
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
