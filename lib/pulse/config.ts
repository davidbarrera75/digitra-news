export interface CityConfig {
  slug: string;
  name: string;
  airportCode: string;
  lat: number;
  lon: number;
  timezone: string;
  // Main flight routes to this city
  flightRoutes: { from: string; fromCode: string }[];
  // Current season (manual, update monthly)
  currentSeason: "alta" | "media" | "baja";
}

export const PULSE_CITIES: CityConfig[] = [
  {
    slug: "cartagena",
    name: "Cartagena",
    airportCode: "CTG",
    lat: 10.391,
    lon: -75.5146,
    timezone: "America/Bogota",
    flightRoutes: [
      { from: "Bogotá", fromCode: "BOG" },
      { from: "Medellín", fromCode: "MDE" },
      { from: "Cali", fromCode: "CLO" },
    ],
    currentSeason: "alta",
  },
  {
    slug: "medellin",
    name: "Medellín",
    airportCode: "MDE",
    lat: 6.2442,
    lon: -75.5812,
    timezone: "America/Bogota",
    flightRoutes: [
      { from: "Bogotá", fromCode: "BOG" },
      { from: "Cartagena", fromCode: "CTG" },
      { from: "Cali", fromCode: "CLO" },
    ],
    currentSeason: "media",
  },
  {
    slug: "bogota",
    name: "Bogotá",
    airportCode: "BOG",
    lat: 4.711,
    lon: -74.0721,
    timezone: "America/Bogota",
    flightRoutes: [
      { from: "Medellín", fromCode: "MDE" },
      { from: "Cartagena", fromCode: "CTG" },
      { from: "Cali", fromCode: "CLO" },
    ],
    currentSeason: "media",
  },
  {
    slug: "santa-marta",
    name: "Santa Marta",
    airportCode: "SMR",
    lat: 11.2408,
    lon: -74.199,
    timezone: "America/Bogota",
    flightRoutes: [
      { from: "Bogotá", fromCode: "BOG" },
      { from: "Medellín", fromCode: "MDE" },
    ],
    currentSeason: "alta",
  },
  {
    slug: "cali",
    name: "Cali",
    airportCode: "CLO",
    lat: 3.4516,
    lon: -76.532,
    timezone: "America/Bogota",
    flightRoutes: [
      { from: "Bogotá", fromCode: "BOG" },
      { from: "Medellín", fromCode: "MDE" },
    ],
    currentSeason: "media",
  },
  {
    slug: "barranquilla",
    name: "Barranquilla",
    airportCode: "BAQ",
    lat: 10.9685,
    lon: -74.7813,
    timezone: "America/Bogota",
    flightRoutes: [
      { from: "Bogotá", fromCode: "BOG" },
      { from: "Medellín", fromCode: "MDE" },
    ],
    currentSeason: "media",
  },
  {
    slug: "bucaramanga",
    name: "Bucaramanga",
    airportCode: "BGA",
    lat: 7.1254,
    lon: -73.1198,
    timezone: "America/Bogota",
    flightRoutes: [
      { from: "Bogotá", fromCode: "BOG" },
    ],
    currentSeason: "baja",
  },
  {
    slug: "san-andres",
    name: "San Andrés",
    airportCode: "ADZ",
    lat: 12.5847,
    lon: -81.7006,
    timezone: "America/Bogota",
    flightRoutes: [
      { from: "Bogotá", fromCode: "BOG" },
      { from: "Medellín", fromCode: "MDE" },
      { from: "Cali", fromCode: "CLO" },
    ],
    currentSeason: "alta",
  },
];

export function getCityConfig(slug: string): CityConfig | undefined {
  return PULSE_CITIES.find((c) => c.slug === slug);
}
