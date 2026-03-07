import Anthropic from "@anthropic-ai/sdk";
import { EventsData, EventItem } from "./types";

const client = new Anthropic();

/**
 * Generate dynamic events for a city using Claude Haiku.
 * Returns real/typical events happening around the current date.
 */
export async function generateCityEvents(
  cityName: string,
  season: "alta" | "media" | "baja"
): Promise<EventsData> {
  const today = new Date().toISOString().split("T")[0];

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: `Eres un experto en turismo colombiano. Genera eventos reales o tipicos que esten ocurriendo o proximos a ocurrir en la ciudad indicada. Responde SOLO con JSON valido, sin markdown ni explicaciones.

Formato:
{"events": [{"name": "Nombre del evento", "date": "YYYY-MM-DD", "type": "festival|cultura|turismo|naturaleza|gastronomia|deporte|musica"}]}

Reglas:
- Incluye 2-4 eventos relevantes para la fecha actual
- Prioriza eventos REALES conocidos (ferias, festivales, temporadas)
- Si no hay eventos grandes, incluye actividades tipicas de la temporada
- Las fechas deben ser cercanas a la fecha actual (maximo 60 dias en el futuro)
- Tipos permitidos: festival, cultura, turismo, naturaleza, gastronomia, deporte, musica`,
      messages: [
        {
          role: "user",
          content: `Ciudad: ${cityName}, Colombia\nFecha actual: ${today}\nTemporada: ${season}\n\nGenera los eventos actuales/proximos.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonStr = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(jsonStr);

    const events: EventItem[] = (parsed.events || []).map((e: Record<string, string>) => ({
      name: String(e.name || ""),
      date: String(e.date || today),
      type: String(e.type || "cultura"),
    }));

    return { season, events };
  } catch (err) {
    console.error(`[Events] Error generating events for ${cityName}:`, err);
    return { season, events: [] };
  }
}
