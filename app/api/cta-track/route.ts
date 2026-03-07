import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    await prisma.ctaClick.create({
      data: {
        articleId: data.articleId || null,
        ctaType: data.ctaType || null,
        ctaText: data.ctaText || null,
        destinationUrl: data.destinationUrl || null,
        referrerUrl: req.headers.get("referer") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
