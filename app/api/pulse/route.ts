export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getLatestPulses, getCityPulse } from "@/lib/actions/pulse";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    if (city) {
      const pulse = await getCityPulse(city);
      if (!pulse) return NextResponse.json({ error: "Ciudad no encontrada" }, { status: 404 });
      return NextResponse.json(pulse);
    }

    const pulses = await getLatestPulses();
    return NextResponse.json(pulses);
  } catch (err) {
    console.error("[Pulse/API]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
