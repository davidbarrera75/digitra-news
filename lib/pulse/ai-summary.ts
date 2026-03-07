import Anthropic from "@anthropic-ai/sdk";
import { PulseData } from "./types";

const client = new Anthropic();

export async function generatePulseSummary(pulse: PulseData): Promise<string> {
  const parts: string[] = [];
  parts.push(`Ciudad: ${pulse.destination.name}, ${pulse.destination.country}`);
  parts.push(`Fecha: ${pulse.date}`);
  parts.push(`Digitra Score: ${pulse.score}/100 — ${pulse.scoreLabel}`);

  if (pulse.weather) {
    parts.push(`Clima: ${pulse.weather.temp}°C, ${pulse.weather.description}, lluvia ${pulse.weather.rainChance}%`);
  }

  if (pulse.accommodation) {
    parts.push(`Alojamiento promedio: $${pulse.accommodation.avgPrice.toLocaleString()} COP/noche (Airbnb: $${pulse.accommodation.airbnbAvg.toLocaleString()}, Booking: $${pulse.accommodation.bookingAvg.toLocaleString()})`);
    parts.push(`Tendencia: ${pulse.accommodation.trend} (${pulse.accommodation.trendPercent}%)`);
  }

  if (pulse.flights && pulse.flights.routes.length > 0) {
    const routes = pulse.flights.routes.map((r) => `${r.from}: $${r.price.toLocaleString()} COP`).join(", ");
    parts.push(`Vuelos: ${routes}`);
  }

  if (pulse.events && pulse.events.events.length > 0) {
    parts.push(`Eventos: ${pulse.events.events.map((e) => e.name).join(", ")}`);
  }

  parts.push(`Temporada: ${pulse.seasonType || "media"}`);

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: `Eres el editor de Digitra News, medio turístico de datos en LATAM. Genera un resumen de 2-3 oraciones sobre el estado turístico actual de la ciudad. Usa datos concretos. Menciona "Según el Digitra Score" al menos una vez. Escribe en español, tono periodístico pero accesible. NO uses emojis. Solo texto plano.`,
    messages: [
      {
        role: "user",
        content: `Genera el resumen diario del Pulse para:\n\n${parts.join("\n")}`,
      },
    ],
  });

  return response.content[0].type === "text" ? response.content[0].text : "";
}
