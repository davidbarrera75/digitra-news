import { NextRequest, NextResponse } from "next/server";
import { analyzeKeyword } from "@/lib/ai/generate-article";

export async function POST(req: NextRequest) {
  try {
    const { keyword } = await req.json();

    if (!keyword || keyword.trim().length < 3) {
      return NextResponse.json({ error: "Keyword debe tener al menos 3 caracteres" }, { status: 400 });
    }

    const analysis = await analyzeKeyword(keyword.trim());
    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[Generate/Analyze]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al analizar keyword" },
      { status: 500 }
    );
  }
}
