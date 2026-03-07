export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLatestMarketSummary } from "@/lib/actions/market-data";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const data = await getLatestMarketSummary();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Admin/MarketSummary]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
