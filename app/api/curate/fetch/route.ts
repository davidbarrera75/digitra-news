import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchAllFeeds } from "@/lib/curate/rss-fetcher";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const items = await fetchAllFeeds();
    return NextResponse.json({ items, count: items.length });
  } catch (err) {
    console.error("[Curate/Fetch]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al obtener feeds" },
      { status: 500 }
    );
  }
}
