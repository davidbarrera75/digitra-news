export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { translateArticle, translateCuratedItem, translatePulseSnapshot } from "@/lib/ai/translate";

// POST /api/translate
// Body: { type: "article" | "curated" | "pulse" | "all-articles" | "all-curated" | "all-pulse", id?: number }
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, id } = body;

  try {
    switch (type) {
      case "article": {
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const article = await prisma.article.findUnique({ where: { id } });
        if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });

        const translated = await translateArticle(article);
        await prisma.article.update({ where: { id }, data: translated });
        return NextResponse.json({ success: true, translated: { titleEn: translated.titleEn } });
      }

      case "curated": {
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const item = await prisma.curatedItem.findUnique({ where: { id } });
        if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

        const translated = await translateCuratedItem(item);
        await prisma.curatedItem.update({ where: { id }, data: translated });
        return NextResponse.json({ success: true, translated: { titleEn: translated.titleEn } });
      }

      case "pulse": {
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const pulse = await prisma.pulseSnapshot.findUnique({ where: { id } });
        if (!pulse) return NextResponse.json({ error: "Pulse not found" }, { status: 404 });

        const translated = await translatePulseSnapshot(pulse);
        await prisma.pulseSnapshot.update({ where: { id }, data: translated });
        return NextResponse.json({ success: true, translated });
      }

      case "all-articles": {
        const articles = await prisma.article.findMany({
          where: { status: "published", titleEn: null },
          orderBy: { publishedAt: "desc" },
        });
        let count = 0;
        for (const article of articles) {
          const translated = await translateArticle(article);
          await prisma.article.update({ where: { id: article.id }, data: translated });
          count++;
        }
        return NextResponse.json({ success: true, translated: count });
      }

      case "all-curated": {
        const items = await prisma.curatedItem.findMany({
          where: { status: "published", titleEn: null },
          orderBy: { createdAt: "desc" },
        });
        let count = 0;
        for (const item of items) {
          const translated = await translateCuratedItem(item);
          await prisma.curatedItem.update({ where: { id: item.id }, data: translated });
          count++;
        }
        return NextResponse.json({ success: true, translated: count });
      }

      case "all-pulse": {
        // Translate only latest pulse per destination (not historical)
        const destinations = await prisma.destination.findMany({ where: { isActive: true } });
        let count = 0;
        for (const dest of destinations) {
          const pulse = await prisma.pulseSnapshot.findFirst({
            where: { destinationId: dest.id, aiSummaryEn: null },
            orderBy: { date: "desc" },
          });
          if (pulse) {
            const translated = await translatePulseSnapshot(pulse);
            await prisma.pulseSnapshot.update({ where: { id: pulse.id }, data: translated });
            count++;
          }
        }
        return NextResponse.json({ success: true, translated: count });
      }

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("[translate]", error);
    const message = error instanceof Error ? error.message : "Translation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
