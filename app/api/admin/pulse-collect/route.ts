import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { collectPulseForCity, collectAllPulses } from "@/lib/pulse/collector";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const city = body.city as string | undefined;

    if (city) {
      const pulse = await collectPulseForCity(city);
      return NextResponse.json({
        success: true,
        city: pulse?.destination.name,
        score: pulse?.score,
        label: pulse?.scoreLabel,
      });
    }

    const results = await collectAllPulses();
    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("[Admin/Pulse-Collect]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al recolectar datos" },
      { status: 500 }
    );
  }
}
