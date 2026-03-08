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

function buildAirbnbSearchUrl(city: string, checkIn: string, checkOut: string): string {
  const query = encodeURIComponent(city);
  const nights = Math.max(1, Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  ));
  return `https://www.airbnb.com/s/${query}/homes?checkin=${checkIn}&checkout=${checkOut}&price_filter_num_nights=${nights}&currency=USD`;
}

export async function scrapeAirbnbPrices(city: string, checkIn?: string, checkOut?: string): Promise<ScrapingResult> {
  const dates = checkIn && checkOut ? { checkIn, checkOut } : getNextWeekDates();
  const searchUrl = buildAirbnbSearchUrl(city, dates.checkIn, dates.checkOut);

  const datasetId = await runActor("easyapi/airbnb-search-results-scraper", {
    searchUrls: [searchUrl],
    maxItems: 80,
  });

  const items = await getDatasetItems<ApifyItem>(datasetId);

  // Output: price.perNight = "$ 54", rating.average = "4.82 (127)"
  const listings: ScrapedListing[] = items
    .filter((item) => {
      const priceObj = item.price as Record<string, unknown> | undefined;
      return priceObj?.perNight;
    })
    .map((item) => {
      const priceObj = item.price as Record<string, unknown> | undefined;
      const perNightStr = getStr(priceObj?.perNight);
      const nightlyPrice = Number(perNightStr.replace(/[^0-9.]/g, "")) || 0;

      const ratingObj = item.rating as Record<string, unknown> | undefined;
      const ratingStr = getStr(ratingObj?.average); // "4.82 (127)"
      const ratingMatch = ratingStr.match(/([\d.]+)\s*\((\d+)\)/);
      const rating = ratingMatch ? Number(ratingMatch[1]) : 0;
      const reviews = ratingMatch ? Number(ratingMatch[2]) : 0;

      return {
        name: getStr(item.name || item.title),
        price: nightlyPrice,
        currency: "USD",
        url: getStr(item.listingUrl || item.url),
        rating,
        reviews,
        type: getStr(item.title),
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
