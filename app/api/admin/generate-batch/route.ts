import { NextRequest, NextResponse } from "next/server";
import { analyzeKeyword, generateArticleContent, estimateReadingTime, generateExcerpt } from "@/lib/ai/generate-article";
import { prisma } from "@/lib/db";

const BATCH_SECRET = process.env.PULSE_CRON_SECRET || "digitra-pulse-2026";

const CATEGORY_MAP: Record<string, number> = {
  destinos: 1,
  datos: 2,
  tendencias: 3,
  "alquiler-vacacional": 4,
  noticias: 5,
};

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-admin-secret");
    if (secret !== BATCH_SECRET) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { keywords, status = "published" } = await req.json();

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ error: "Se requiere array de keywords" }, { status: 400 });
    }

    const results: { keyword: string; success: boolean; title?: string; slug?: string; error?: string }[] = [];

    for (const keyword of keywords) {
      try {
        console.log(`[Batch] Analyzing: ${keyword}`);
        const analysis = await analyzeKeyword(keyword);

        // Check if slug already exists
        const existing = await prisma.article.findUnique({ where: { slug: analysis.slug } });
        if (existing) {
          results.push({ keyword, success: false, error: "Slug ya existe" });
          continue;
        }

        console.log(`[Batch] Writing: ${analysis.titulo}`);
        const content = await generateArticleContent(analysis);
        const readingTime = estimateReadingTime(content);
        const excerpt = generateExcerpt(content);

        const article = await prisma.article.create({
          data: {
            title: analysis.titulo,
            slug: analysis.slug,
            content,
            excerpt,
            categoryId: CATEGORY_MAP[analysis.categoria] || null,
            sourceType: "ai-generated",
            metaTitle: analysis.metaTitle,
            metaDescription: analysis.metaDescription,
            seoKeyword: analysis.keywordPrincipal,
            tags: analysis.tags,
            readingTime,
            status,
            isFeatured: false,
            publishedAt: status === "published" ? new Date() : null,
          },
        });

        results.push({
          keyword,
          success: true,
          title: article.title,
          slug: article.slug,
        });

        console.log(`[Batch] Created: ${article.title}`);
      } catch (err) {
        console.error(`[Batch] Error for "${keyword}":`, err);
        results.push({
          keyword,
          success: false,
          error: err instanceof Error ? err.message : "Error desconocido",
        });
      }
    }

    return NextResponse.json({
      total: keywords.length,
      success: results.filter((r) => r.success).length,
      results,
    });
  } catch (err) {
    console.error("[Batch]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
