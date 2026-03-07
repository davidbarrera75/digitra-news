import Anthropic from "@anthropic-ai/sdk";
import { ANALYSIS_PROMPT, ARTICLE_PROMPT } from "./system-prompt";

const client = new Anthropic();

export interface SEOAnalysis {
  competencia: string;
  debilidades: string;
  oportunidad: string;
  titulo: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywordPrincipal: string;
  keywordsSecundarias: string[];
  preguntas: string[];
  diferenciador: string;
  estructura: { tag: string; text: string }[];
  categoria: string;
  tags: string[];
  tipoContenido: string;
}

export async function analyzeKeyword(keyword: string): Promise<SEOAnalysis> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Analiza esta keyword/tema para digitra.news y genera la estrategia SEO completa:\n\n"${keyword}"`,
      },
    ],
    system: ANALYSIS_PROMPT,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No se pudo extraer el análisis JSON de la respuesta");
  }

  return JSON.parse(jsonMatch[0]) as SEOAnalysis;
}

export async function generateArticleContent(analysis: SEOAnalysis): Promise<string> {
  const structureText = analysis.estructura
    .map((s) => `${s.tag.toUpperCase()}: ${s.text}`)
    .join("\n");

  const prompt = `Escribe el artículo completo basándote en este análisis SEO:

TÍTULO: ${analysis.titulo}
KEYWORD PRINCIPAL: ${analysis.keywordPrincipal}
KEYWORDS SECUNDARIAS: ${analysis.keywordsSecundarias.join(", ")}
TIPO: ${analysis.tipoContenido}
CATEGORÍA: ${analysis.categoria}

ESTRUCTURA A SEGUIR:
${structureText}

PREGUNTAS QUE DEBE RESPONDER (incluir como sección FAQ al final):
${analysis.preguntas.map((q, i) => `${i + 1}. ${q}`).join("\n")}

DIFERENCIADOR: ${analysis.diferenciador}

DEBILIDADES DE LA COMPETENCIA A EXPLOTAR:
${analysis.debilidades}

Escribe el artículo completo en HTML. Mínimo 2500 palabras. Incluye la sección FAQ con schema-friendly markup.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    system: ARTICLE_PROMPT,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Clean any markdown code blocks if present
  return text
    .replace(/^```html?\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();
}

export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function generateExcerpt(html: string, maxLength = 450): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s\S*$/, "") + "...";
}
