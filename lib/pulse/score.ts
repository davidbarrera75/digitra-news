import { AccommodationData, FlightsData, WeatherData, EventsData } from "./types";
import { weatherScore } from "./weather";

interface ScoreInput {
  flights: FlightsData | null;
  accommodation: AccommodationData | null;
  weather: WeatherData | null;
  events: EventsData | null;
  // Historical averages for comparison
  historicalFlightAvg?: number;
  historicalAccommodationAvg?: number;
}

interface ScoreResult {
  score: number; // 0-100
  label: string;
  breakdown: {
    flights: number;
    accommodation: number;
    weather: number;
    events: number;
    season: number;
  };
}

/**
 * Digitra Score: 0-100 index measuring how good a moment is to visit a destination.
 *
 * Weights:
 * - Flights (20%): cheaper vs historical = higher score
 * - Accommodation (20%): cheaper vs historical = higher score
 * - Weather (25%): good weather = higher score
 * - Events (15%): events happening = bonus
 * - Season (20%): alta=bonus, baja=penalty
 */
export function calculateDigitraScore(input: ScoreInput): ScoreResult {
  const breakdown = {
    flights: 50,
    accommodation: 50,
    weather: 50,
    events: 50,
    season: 50,
  };

  // --- Flights Score (0-100) ---
  if (input.flights && input.flights.routes.length > 0) {
    const avgPrice = input.flights.avgPrice;
    const histAvg = input.historicalFlightAvg || avgPrice;
    if (histAvg > 0) {
      const ratio = avgPrice / histAvg;
      // Below average = good (score up), above = bad (score down)
      if (ratio <= 0.7) breakdown.flights = 95;
      else if (ratio <= 0.85) breakdown.flights = 80;
      else if (ratio <= 1.0) breakdown.flights = 65;
      else if (ratio <= 1.15) breakdown.flights = 45;
      else if (ratio <= 1.3) breakdown.flights = 30;
      else breakdown.flights = 15;
    }
  }

  // --- Accommodation Score (0-100) ---
  if (input.accommodation) {
    const avg = input.accommodation.avgPrice;
    const histAvg = input.historicalAccommodationAvg || avg;
    if (histAvg > 0) {
      const ratio = avg / histAvg;
      if (ratio <= 0.7) breakdown.accommodation = 95;
      else if (ratio <= 0.85) breakdown.accommodation = 80;
      else if (ratio <= 1.0) breakdown.accommodation = 65;
      else if (ratio <= 1.15) breakdown.accommodation = 45;
      else if (ratio <= 1.3) breakdown.accommodation = 30;
      else breakdown.accommodation = 15;
    }

    // Bonus for downward trend
    if (input.accommodation.trend === "down") breakdown.accommodation += 10;
    if (input.accommodation.trend === "up") breakdown.accommodation -= 5;
    breakdown.accommodation = Math.max(0, Math.min(100, breakdown.accommodation));
  }

  // --- Weather Score (0-100) ---
  if (input.weather) {
    breakdown.weather = weatherScore(input.weather);
  }

  // --- Events Score (0-100) ---
  if (input.events) {
    const eventCount = input.events.events.length;
    if (eventCount >= 3) breakdown.events = 90;
    else if (eventCount >= 2) breakdown.events = 75;
    else if (eventCount >= 1) breakdown.events = 60;
    else breakdown.events = 40;
  }

  // --- Season Score (0-100) ---
  if (input.events) {
    switch (input.events.season) {
      case "alta":
        breakdown.season = 80;
        break;
      case "media":
        breakdown.season = 55;
        break;
      case "baja":
        breakdown.season = 30;
        break;
    }
  }

  // Weighted average
  const score = Math.round(
    breakdown.flights * 0.2 +
    breakdown.accommodation * 0.2 +
    breakdown.weather * 0.25 +
    breakdown.events * 0.15 +
    breakdown.season * 0.2
  );

  const label = getScoreLabel(score);

  return { score, label, breakdown };
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Momento ideal para viajar";
  if (score >= 65) return "Buen momento para viajar";
  if (score >= 50) return "Condiciones normales";
  if (score >= 35) return "Condiciones regulares";
  return "Mejor esperar";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981"; // emerald
  if (score >= 65) return "#0EA5E9"; // sky
  if (score >= 50) return "#F59E0B"; // amber
  if (score >= 35) return "#F97316"; // orange
  return "#EF4444"; // red
}

export function getScoreEmoji(score: number): string {
  if (score >= 80) return "🟢";
  if (score >= 65) return "🔵";
  if (score >= 50) return "🟡";
  if (score >= 35) return "🟠";
  return "🔴";
}
