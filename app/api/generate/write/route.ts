import { NextRequest, NextResponse } from "next/server";
import { generateArticleContent, estimateReadingTime, generateExcerpt } from "@/lib/ai/generate-article";
import type { SEOAnalysis } from "@/lib/ai/generate-article";

export async function POST(req: NextRequest) {
  try {
    const analysis: SEOAnalysis = await req.json();

    if (!analysis.titulo || !analysis.estructura?.length) {
      return NextResponse.json({ error: "Análisis incompleto" }, { status: 400 });
    }

    const content = await generateArticleContent(analysis);
    const readingTime = estimateReadingTime(content);
    const excerpt = generateExcerpt(content);

    return NextResponse.json({
      content,
      readingTime,
      excerpt,
    });
  } catch (err) {
    console.error("[Generate/Write]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al generar artículo" },
      { status: 500 }
    );
  }
}
