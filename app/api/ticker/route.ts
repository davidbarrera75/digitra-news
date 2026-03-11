import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const items = [];
  for (const dest of destinations) {
    const snapshot = await prisma.pulseSnapshot.findFirst({
      where: { destinationId: dest.id },
      include: { destination: true },
      orderBy: { date: "desc" },
    });
    if (snapshot) {
      const accommodation = snapshot.accommodationData as {
        avgPrice?: number;
        currency?: string;
      } | null;
      items.push({
        name: snapshot.destination.name,
        slug: snapshot.destination.slug,
        score: snapshot.score,
        avgPrice: accommodation?.avgPrice ?? null,
        currency: accommodation?.currency ?? "USD",
      });
    }
  }

  items.sort((a, b) => b.score - a.score);

  return NextResponse.json({ items, updatedAt: new Date().toISOString() });
}
