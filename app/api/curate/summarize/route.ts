import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { summarizeArticle } from "@/lib/curate/summarizer";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { title, description, sourceUrl } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
    }

    const summary = await summarizeArticle(title, description || "", sourceUrl || "");
    return NextResponse.json(summary);
  } catch (err) {
    console.error("[Curate/Summarize]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al resumir" },
      { status: 500 }
    );
  }
}
