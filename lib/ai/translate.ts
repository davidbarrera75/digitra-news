import Anthropic from "@anthropic-ai/sdk";
import { Prisma } from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";

const client = new Anthropic();

const TRANSLATE_SYSTEM = `You are a professional translator specializing in tourism and travel content.
Translate from Spanish to English. Maintain the same tone, style, and formatting (HTML tags, markdown, etc.).
For proper nouns (city names, place names, brand names), keep them in their original form.
For tourism-specific terms, use natural English equivalents.
Return ONLY the translation, no explanations or notes.`;

interface TranslateOptions {
  text: string;
  context?: string; // e.g. "article title", "meta description", "FAQ items"
}

export async function translateText({ text, context }: TranslateOptions): Promise<string> {
  if (!text || text.trim().length === 0) return '';

  const userPrompt = context
    ? `Translate this ${context} from Spanish to English:\n\n${text}`
    : `Translate from Spanish to English:\n\n${text}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20241022",
    max_tokens: 8192,
    system: TRANSLATE_SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = response.content[0];
  if (block.type === "text") return block.text;
  return '';
}

export async function translateArticle(article: {
  title: string;
  subtitle?: string | null;
  content: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  coverImageAlt?: string | null;
  faqItems?: JsonValue;
}): Promise<{
  titleEn: string;
  subtitleEn: string | null;
  contentEn: string;
  excerptEn: string | null;
  metaTitleEn: string | null;
  metaDescriptionEn: string | null;
  coverImageAltEn: string | null;
  faqItemsEn: Prisma.InputJsonValue | typeof Prisma.JsonNull;
}> {
  // Batch all translations in parallel for speed
  const [titleEn, subtitleEn, contentEn, excerptEn, metaTitleEn, metaDescriptionEn, coverImageAltEn, faqItemsEn] =
    await Promise.all([
      translateText({ text: article.title, context: "article title" }),
      article.subtitle
        ? translateText({ text: article.subtitle, context: "article subtitle" })
        : Promise.resolve(null),
      translateText({ text: article.content, context: "article body (HTML content)" }),
      article.excerpt
        ? translateText({ text: article.excerpt, context: "article excerpt/summary" })
        : Promise.resolve(null),
      article.metaTitle
        ? translateText({ text: article.metaTitle, context: "SEO meta title" })
        : Promise.resolve(null),
      article.metaDescription
        ? translateText({ text: article.metaDescription, context: "SEO meta description" })
        : Promise.resolve(null),
      article.coverImageAlt
        ? translateText({ text: article.coverImageAlt, context: "image alt text" })
        : Promise.resolve(null),
      article.faqItems
        ? translateFaqItems(article.faqItems)
        : Promise.resolve(null),
    ]);

  return {
    titleEn, subtitleEn, contentEn, excerptEn, metaTitleEn, metaDescriptionEn, coverImageAltEn,
    faqItemsEn: faqItemsEn ?? Prisma.JsonNull,
  };
}

async function translateFaqItems(faqItems: JsonValue): Promise<Record<string, string>[] | null> {
  if (!Array.isArray(faqItems) || faqItems.length === 0) return null;

  const items = faqItems as Record<string, string>[];
  // Translate all FAQ Q&A as a single batch for efficiency
  const faqText = items
    .map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`)
    .join('\n\n');

  const translated = await translateText({
    text: faqText,
    context: "FAQ questions and answers",
  });

  // Parse back into structured format
  const pairs = translated.split(/\n\n+/);
  return pairs.map((pair) => {
    const lines = pair.split('\n');
    const question = (lines[0] || '').replace(/^Q\d+:\s*/, '');
    const answer = (lines[1] || '').replace(/^A\d+:\s*/, '');
    return { question, answer };
  }).filter(item => item.question && item.answer);
}

export async function translateCuratedItem(item: {
  title: string;
  aiSummary?: string | null;
}): Promise<{ titleEn: string; aiSummaryEn: string | null }> {
  const [titleEn, aiSummaryEn] = await Promise.all([
    translateText({ text: item.title, context: "news headline" }),
    item.aiSummary
      ? translateText({ text: item.aiSummary, context: "news summary" })
      : Promise.resolve(null),
  ]);
  return { titleEn, aiSummaryEn };
}

export async function translatePulseSnapshot(pulse: {
  scoreLabel?: string | null;
  aiSummary?: string | null;
}): Promise<{ scoreLabelEn: string | null; aiSummaryEn: string | null }> {
  const [scoreLabelEn, aiSummaryEn] = await Promise.all([
    pulse.scoreLabel
      ? translateText({ text: pulse.scoreLabel, context: "tourism score label (short, e.g. 'Excelente', 'Bueno')" })
      : Promise.resolve(null),
    pulse.aiSummary
      ? translateText({ text: pulse.aiSummary, context: "tourism pulse AI summary" })
      : Promise.resolve(null),
  ]);
  return { scoreLabelEn, aiSummaryEn };
}
