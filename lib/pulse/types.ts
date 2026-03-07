export interface FlightRoute {
  from: string;
  fromCode: string;
  price: number;
  currency: string;
  airline?: string;
}

export interface FlightsData {
  routes: FlightRoute[];
  avgPrice: number;
  cheapestRoute: string;
  updatedAt: string;
}

export interface AccommodationData {
  airbnbAvg: number;
  bookingAvg: number;
  avgPrice: number;
  minPrice: number;
  listings: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  currency: string;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  rainChance: number;
  forecast: {
    date: string;
    tempMax: number;
    tempMin: number;
    rain: number;
    icon: string;
  }[];
}

export interface EventItem {
  name: string;
  date: string;
  type: string;
}

export interface EventsData {
  season: "alta" | "media" | "baja";
  events: EventItem[];
}

export interface PulseData {
  id: number;
  destinationId: number;
  destination: {
    id: number;
    name: string;
    slug: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
  };
  date: string;
  score: number;
  scoreLabel: string | null;
  flights: FlightsData | null;
  accommodation: AccommodationData | null;
  weather: WeatherData | null;
  events: EventsData | null;
  seasonType: string | null;
  aiSummary: string | null;
}
