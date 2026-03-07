import Anthropic from "@anthropic-ai/sdk";
import { FlightsData } from "./types";

const client = new Anthropic();

interface FlightRouteConfig {
  from: string;
  fromCode: string;
}

/**
 * Generate realistic flight prices using Claude Haiku.
 * Based on market knowledge of Colombian domestic flights.
 */
export async function generateFlightPrices(
  cityName: string,
  airportCode: string,
  routes: FlightRouteConfig[],
  season: "alta" | "media" | "baja"
): Promise<FlightsData | null> {
  if (routes.length === 0) return null;

  const today = new Date().toISOString().split("T")[0];
  const routesList = routes.map((r) => `${r.from} (${r.fromCode}) -> ${cityName} (${airportCode})`).join("\n");

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: `Eres un experto en vuelos domesticos colombianos. Genera precios realistas de vuelos one-way para las rutas indicadas. Considera aerolineas como Avianca, LATAM, Wingo, JetSMART, Viva (ahora parte de Avianca). Responde SOLO con JSON valido, sin markdown.

Formato:
{"routes": [{"from": "Ciudad", "fromCode": "XXX", "price": 150000, "currency": "COP", "airline": "Avianca"}]}

Reglas:
- Precios en COP (pesos colombianos), realistas para la fecha y temporada
- Temporada alta: precios 20-40% mas altos
- Temporada baja: precios 15-25% mas bajos
- San Andres siempre es mas caro (incluye tasas aeroportuarias)
- Rutas cortas (BOG-MDE, BOG-BGA): $120,000-$250,000 COP
- Rutas medias (BOG-CTG, BOG-SMR, BOG-CLO): $150,000-$350,000 COP
- Rutas largas/islas (BOG-ADZ): $250,000-$500,000 COP
- Incluye la aerolinea mas probable para esa ruta
- Varia los precios entre rutas, no uses el mismo para todas`,
      messages: [
        {
          role: "user",
          content: `Fecha: ${today}\nTemporada: ${season}\n\nRutas:\n${routesList}\n\nGenera precios realistas.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonStr = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    const generatedRoutes = (parsed.routes || []).map((r: Record<string, unknown>) => ({
      from: String(r.from || ""),
      fromCode: String(r.fromCode || ""),
      price: Number(r.price) || 0,
      currency: String(r.currency || "COP"),
      airline: String(r.airline || ""),
    }));

    if (generatedRoutes.length === 0) return null;

    const prices = generatedRoutes.map((r: { price: number }) => r.price);
    const avgPrice = Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length);
    const cheapest = generatedRoutes.reduce((a: { price: number; from: string }, b: { price: number; from: string }) =>
      a.price < b.price ? a : b
    );

    return {
      routes: generatedRoutes,
      avgPrice,
      cheapestRoute: cheapest.from,
      updatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error(`[Flights/AI] Error generating prices for ${cityName}:`, err);
    return null;
  }
}
