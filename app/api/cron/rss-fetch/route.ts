import { NextRequest, NextResponse } from "next/server";
import { fetchAllFeeds } from "@/lib/curate/rss-fetcher";
import { summarizeArticle } from "@/lib/curate/summarizer";
import { prisma } from "@/lib/db";

const CRON_SECRET = process.env.PULSE_CRON_SECRET || "digitra-pulse-2026";

const CATEGORY_MAP: Record<string, number> = {
  destinos: 1,
  datos: 2,
  tendencias: 3,
  "alquiler-vacacional": 4,
  noticias: 5,
};

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret");
    if (secret !== CRON_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const items = await fetchAllFeeds();
    if (items.length === 0) {
      return NextResponse.json({ success: true, message: "No hay items nuevos", saved: 0 });
    }

    // Filter items from last 48 hours
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const recent = items.filter((item) => new Date(item.pubDate) > cutoff);

    let saved = 0;
    const errors: string[] = [];

    for (const item of recent.slice(0, 15)) {
      try {
        // Skip if already exists
        const existing = await prisma.curatedItem.findFirst({
          where: { sourceUrl: item.link },
        });
        if (existing) continue;

        // Summarize with AI
        const summary = await summarizeArticle(item.title, item.description, item.link);

        // Only save if relevance >= 5
        if (summary.relevanceScore < 5) continue;

        await prisma.curatedItem.create({
          data: {
            title: item.title,
            sourceUrl: item.link,
            sourceName: item.source,
            sourceId: item.sourceId,
            originalExcerpt: item.description,
            aiSummary: summary.summary,
            tags: summary.tags,
            relevanceScore: summary.relevanceScore,
            suggestedCategory: summary.suggestedCategory,
            categoryId: CATEGORY_MAP[summary.suggestedCategory] || CATEGORY_MAP.noticias,
            publishedAt: new Date(item.pubDate),
          },
        });
        saved++;
      } catch (err) {
        errors.push(`${item.title}: ${err instanceof Error ? err.message : "error"}`);
      }
    }

    return NextResponse.json({
      success: true,
      fetched: items.length,
      recent: recent.length,
      saved,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("[Cron/RSS]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
