import Anthropic from "@anthropic-ai/sdk";
import { AISummary } from "./types";

const client = new Anthropic();

const SUMMARIZER_PROMPT = `Eres un editor de digitra.news, el primer medio turístico basado en datos de Latinoamérica.

Tu trabajo: analizar noticias del sector turístico y generar un resumen en español.

Responde SIEMPRE en JSON con esta estructura exacta:
{
  "summary": "Resumen en español, 2-3 oraciones. Enfocado en el dato clave y su impacto en turismo LATAM.",
  "tags": ["tag1", "tag2", "tag3"],
  "relevanceScore": 8,
  "suggestedCategory": "destinos|datos|tendencias|alquiler-vacacional|noticias"
}

Criterios de relevancia (1-10):
- 9-10: Datos concretos sobre turismo LATAM, precios, ocupación, nuevas rutas
- 7-8: Tendencias globales que impactan LATAM, regulaciones, tecnología hotelera
- 5-6: Noticias de turismo global con impacto indirecto en LATAM
- 3-4: Noticias de viaje genéricas sin conexión LATAM
- 1-2: Contenido irrelevante para turismo

Categorías:
- destinos: guías, experiencias, nuevas rutas
- datos: precios, ocupación, estadísticas, rankings
- tendencias: proyecciones, tecnología, cambios en la industria
- alquiler-vacacional: Airbnb, Booking, anfitriones, regulaciones STR
- noticias: actualidad del sector, aerolíneas, hoteles, políticas`;

export async function summarizeArticle(
  title: string,
  description: string,
  sourceUrl: string
): Promise<AISummary> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system: SUMMARIZER_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analiza y resume esta noticia:\n\nTÍTULO: ${title}\nDESCRIPCIÓN: ${description}\nFUENTE: ${sourceUrl}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      summary: description.substring(0, 300),
      tags: [],
      relevanceScore: 5,
      suggestedCategory: "noticias",
    };
  }

  return JSON.parse(jsonMatch[0]) as AISummary;
}
