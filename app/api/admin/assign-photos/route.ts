import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { searchPhoto, titleToSearchQuery } from "@/lib/unsplash/client";

/**
 * POST /api/admin/assign-photos
 * Auto-assign Unsplash cover images to articles and destinations that don't have one.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const target = body.target || "all"; // "articles", "destinations", "all"

  const results: { type: string; name: string; success: boolean; url?: string; error?: string }[] = [];

  // Assign to articles without cover images
  if (target === "articles" || target === "all") {
    const articles = await prisma.article.findMany({
      where: { coverImage: null, status: "published" },
      select: { id: true, title: true, slug: true },
    });

    for (const article of articles) {
      try {
        const query = titleToSearchQuery(article.title);
        const photo = await searchPhoto(query);

        if (photo) {
          await prisma.article.update({
            where: { id: article.id },
            data: {
              coverImage: photo.url,
              coverImageAlt: photo.alt,
            },
          });
          results.push({ type: "article", name: article.title, success: true, url: photo.url });
        } else {
          results.push({ type: "article", name: article.title, success: false, error: "No photo found" });
        }

        // Respect Unsplash rate limits (50 req/hr)
        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        results.push({ type: "article", name: article.title, success: false, error: String(err) });
      }
    }
  }

  // Assign to destinations without cover images
  if (target === "destinations" || target === "all") {
    const destinations = await prisma.destination.findMany({
      where: { coverImage: null, isActive: true },
      select: { id: true, name: true, slug: true, country: true },
    });

    for (const dest of destinations) {
      try {
        const query = `${dest.name} ${dest.country} tourism landmark`;
        const photo = await searchPhoto(query);

        if (photo) {
          await prisma.destination.update({
            where: { id: dest.id },
            data: { coverImage: photo.url },
          });
          results.push({ type: "destination", name: dest.name, success: true, url: photo.url });
        } else {
          results.push({ type: "destination", name: dest.name, success: false, error: "No photo found" });
        }

        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        results.push({ type: "destination", name: dest.name, success: false, error: String(err) });
      }
    }
  }

  const successCount = results.filter((r) => r.success).length;

  return NextResponse.json({
    success: true,
    assigned: successCount,
    total: results.length,
    results,
  });
}
