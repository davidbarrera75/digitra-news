"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/lib/actions/articles";

interface SEOAnalysis {
  competencia: string;
  debilidades: string;
  oportunidad: string;
  titulo: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywordPrincipal: string;
  keywordsSecundarias: string[];
  preguntas: string[];
  diferenciador: string;
  estructura: { tag: string; text: string }[];
  categoria: string;
  tags: string[];
  tipoContenido: string;
}

const CATEGORY_MAP: Record<string, number> = {
  destinos: 1,
  datos: 2,
  tendencias: 3,
  "alquiler-vacacional": 4,
  noticias: 5,
};

export default function GenerateArticlePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [step, setStep] = useState<"input" | "analyzing" | "review" | "writing" | "preview">("input");
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!keyword.trim()) return;
    setStep("analyzing");
    setError("");

    try {
      const res = await fetch("/api/generate/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error en análisis");
      }

      const data = await res.json();
      setAnalysis(data);
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al analizar");
      setStep("input");
    }
  };

  const handleGenerate = async () => {
    if (!analysis) return;
    setStep("writing");
    setError("");

    try {
      const res = await fetch("/api/generate/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysis),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error en generación");
      }

      const data = await res.json();
      setContent(data.content);
      setExcerpt(data.excerpt);
      setReadingTime(data.readingTime);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar");
      setStep("review");
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!analysis || !content) return;
    setSaving(true);

    try {
      await createArticle({
        title: analysis.titulo,
        slug: analysis.slug,
        content,
        excerpt,
        categoryId: CATEGORY_MAP[analysis.categoria] || undefined,
        metaTitle: analysis.metaTitle,
        metaDescription: analysis.metaDescription,
        seoKeyword: analysis.keywordPrincipal,
        tags: analysis.tags,
        readingTime,
        status,
        isFeatured: false,
      });

      router.push("/admin/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-primary mb-2">Generar Artículo con IA</h1>
      <p className="text-sm text-gray-400 mb-8">
        Proceso: Keyword → Análisis SEO competitivo → Revisión → Generación → Publicación
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      {/* STEP 1: Input keyword */}
      {step === "input" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-primary mb-1">Paso 1: Keyword o tema</h2>
            <p className="text-sm text-gray-400 mb-6">
              Ingresa una keyword, tema o pregunta. Claude analizará la competencia y diseñará la estrategia SEO.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="ej: qué hacer en guatapé, mejores airbnb cartagena, turismo colombia 2026"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                onClick={handleAnalyze}
                disabled={!keyword.trim()}
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Analizar
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Ideas rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "qué hacer en guatapé",
                  "mejores barrios para hospedarse en medellín",
                  "airbnb vs hoteles cartagena",
                  "tendencias turismo colombia 2026",
                  "playas cerca de santa marta",
                  "precio promedio airbnb san andrés",
                ].map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setKeyword(idea)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs rounded-full transition-colors"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP: Analyzing */}
      {step === "analyzing" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-primary font-medium">Analizando competencia SEO...</p>
            <p className="text-sm text-gray-400 mt-1">Claude está revisando qué contenidos posicionan para &quot;{keyword}&quot;</p>
          </div>
        </div>
      )}

      {/* STEP 2: Review analysis */}
      {step === "review" && analysis && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-primary">Paso 2: Revisión del Análisis SEO</h2>
            <div className="flex gap-3">
              <button
                onClick={() => { setStep("input"); setAnalysis(null); }}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
              >
                ← Cambiar keyword
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Generar artículo →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Análisis competitivo */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">1</span>
                  Competencia
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{analysis.competencia}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">2</span>
                  Debilidades
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{analysis.debilidades}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">3</span>
                  Oportunidad
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{analysis.oportunidad}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs">4</span>
                  Diferenciador
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{analysis.diferenciador}</p>
              </div>
            </div>

            {/* Propuesta de artículo */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-primary mb-3">Artículo propuesto</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Título (H1)</span>
                    <p className="text-base font-display font-bold text-primary">{analysis.titulo}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Slug</span>
                    <p className="text-sm font-mono text-gray-600">/{analysis.categoria}/{analysis.slug}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Meta Title</span>
                    <p className="text-sm text-gray-600">{analysis.metaTitle}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Meta Description</span>
                    <p className="text-sm text-gray-600">{analysis.metaDescription}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Categoría</span>
                      <p className="text-sm text-gray-600">{analysis.categoria}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Tipo</span>
                      <p className="text-sm text-gray-600">{analysis.tipoContenido}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-primary mb-3">Keywords</h3>
                <div className="mb-3">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Principal</span>
                  <p className="text-sm font-medium text-accent">{analysis.keywordPrincipal}</p>
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Secundarias</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {analysis.keywordsSecundarias.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-primary mb-3">Estructura (H2/H3)</h3>
                <div className="space-y-1">
                  {analysis.estructura.map((item, i) => (
                    <div key={i} className={`text-sm ${item.tag === "h3" ? "pl-4 text-gray-500" : "font-medium text-primary"}`}>
                      <span className="text-[10px] text-gray-400 mr-2">{item.tag.toUpperCase()}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-primary mb-3">Preguntas FAQ</h3>
                <ol className="space-y-1.5">
                  {analysis.preguntas.map((q, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      <span className="text-gray-400 mr-1">{i + 1}.</span> {q}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-primary mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP: Writing */}
      {step === "writing" && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-secondary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-primary font-medium">Generando artículo completo...</p>
            <p className="text-sm text-gray-400 mt-1">Claude está escribiendo 2500+ palabras optimizadas para SEO</p>
            <p className="text-xs text-gray-300 mt-2">Esto puede tomar 30-60 segundos</p>
          </div>
        </div>
      )}

      {/* STEP 3: Preview */}
      {step === "preview" && analysis && content && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-primary">Paso 3: Preview del artículo</h2>
              <p className="text-sm text-gray-400">{readingTime} min lectura · {analysis.keywordPrincipal}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep("review")}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
              >
                ← Volver al análisis
              </button>
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Guardar borrador
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="px-6 py-2 bg-secondary hover:bg-secondary/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>

          {/* SEO preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <p className="text-xs text-gray-400 mb-1">Preview en Google:</p>
            <p className="text-blue-700 text-base hover:underline cursor-default">{analysis.metaTitle}</p>
            <p className="text-green-700 text-xs font-mono">digitra.news/{analysis.categoria}/{analysis.slug}</p>
            <p className="text-sm text-gray-600 mt-0.5">{analysis.metaDescription}</p>
          </div>

          {/* Article preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
            <header className="mb-8 pb-6 border-b border-gray-100">
              <span
                className="category-pill px-3 py-1 text-xs"
                style={{ backgroundColor: "#10B98115", color: "#10B981" }}
              >
                {analysis.categoria}
              </span>
              <h1 className="mt-4 text-3xl md:text-4xl font-display font-bold text-primary leading-tight">
                {analysis.titulo}
              </h1>
              {excerpt && (
                <p className="mt-3 text-lg text-gray-500">{excerpt.substring(0, 200)}...</p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span>Por David Barrera</span>
                <span>·</span>
                <span>{readingTime} min lectura</span>
                <span>·</span>
                <span>{analysis.keywordPrincipal}</span>
              </div>
            </header>

            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
