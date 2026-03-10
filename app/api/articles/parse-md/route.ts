import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { parseMdArticle } from "@/lib/blog/md-parser";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.name.endsWith(".md")) {
      return NextResponse.json(
        { error: "Se requiere un archivo .md" },
        { status: 400 }
      );
    }

    const markdown = await file.text();
    const parsed = parseMdArticle(markdown);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[API/parse-md]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al procesar" },
      { status: 500 }
    );
  }
}
