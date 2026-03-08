"use client";

import { useState } from "react";
import Link from "next/link";
import { createArticle } from "@/lib/actions/articles";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceId: number;
}

interface AISummary {
  summary: string;
  tags: string[];
  relevanceScore: number;
  suggestedCategory: string;
}

const CATEGORIES: Record<string, { id: number; name: string }> = {
  destinos: { id: 1, name: "Destinos" },
  datos: { id: 2, name: "Data Turismo" },
  tendencias: { id: 3, name: "Tendencias" },
  "alquiler-vacacional": { id: 4, name: "Alquiler Vacacional" },
  noticias: { id: 5, name: "Noticias" },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 200);
}

function relevanceColor(score: number) {
  if (score >= 7) return "bg-green-100 text-green-700";
  if (score >= 4) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function CuratedPage() {
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<RSSItem | null>(null);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [filterSource, setFilterSource] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [message, setMessage] = useState("");

  const fetchFeeds = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/curate/fetch", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setItems(data.items || []);
      setMessage(`${data.count} artículos encontrados`);
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  const summarizeItem = async (item: RSSItem) => {
    setSelected(item);
    setSummary(null);
    setSummarizing(true);
    setEditTitle(item.title);
    setEditContent("");
    try {
      const res = await fetch("/api/curate/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          sourceUrl: item.link,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSummary(data);
      setEditContent(
        `<p>${data.summary}</p>\n\n<p>Fuente original: <a href="${item.link}" target="_blank" rel="noopener">${item.source}</a></p>`
      );
    } catch (err) {
      setMessage(`Error IA: ${err instanceof Error ? err.message : "desconocido"}`);
    } finally {
      setSummarizing(false);
    }
  };

  const publishArticle = async () => {
    if (!selected || !summary) return;
    setPublishing(true);
    try {
      const catSlug = summary.suggestedCategory;
      const cat = CATEGORIES[catSlug] || CATEGORIES.noticias;
      await createArticle({
        title: editTitle,
        slug: slugify(editTitle),
        content: editContent,
        excerpt: summary.summary,
        categoryId: cat.id,
        sourceType: "curated",
        sourceUrl: selected.link,
        sourceName: selected.source,
        tags: summary.tags,
        readingTime: 2,
        status: "published",
      });
      setMessage(`Artículo "${editTitle}" publicado`);
      setSelected(null);
      setSummary(null);
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "desconocido"}`);
    } finally {
      setPublishing(false);
    }
  };

  const sources = Array.from(new Set(items.map((i) => i.source)));
  const filteredItems = filterSource ? items.filter((i) => i.source === filterSource) : items;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Curación de Contenido</h1>
          <p className="text-sm text-gray-500 mt-1">Importa y resume noticias de fuentes RSS</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/curated/sources"
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Gestionar fuentes
          </Link>
          <button
            onClick={fetchFeeds}
            disabled={loading}
            className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Actualizar feeds"}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">{message}</div>
      )}

      {/* Filters */}
      {sources.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFilterSource("")}
            className={`px-3 py-1 text-xs rounded-full border ${
              !filterSource ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Todas ({items.length})
          </button>
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSource(s)}
              className={`px-3 py-1 text-xs rounded-full border ${
                filterSource === s ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s} ({items.filter((i) => i.source === s).length})
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Feed items */}
        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg mb-2">Sin artículos</p>
              <p className="text-sm">Haz clic en &quot;Actualizar feeds&quot; para obtener noticias</p>
            </div>
          )}
          {filteredItems.map((item, idx) => (
            <div
              key={`${item.sourceId}-${idx}`}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selected?.link === item.link
                  ? "border-accent bg-accent/5"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => summarizeItem(item)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-accent mb-1">{item.source}</p>
                  <h3 className="text-sm font-semibold text-primary line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    {new Date(item.pubDate).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    summarizeItem(item);
                  }}
                  className="px-2 py-1 text-[10px] bg-accent/10 text-accent rounded hover:bg-accent/20 whitespace-nowrap"
                >
                  Resumir IA
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Preview/Edit */}
        <div className="sticky top-4">
          {!selected && (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-dashed border-gray-300 text-gray-400 text-sm">
              Selecciona un artículo para ver el resumen IA
            </div>
          )}

          {selected && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              {summarizing && (
                <div className="flex items-center gap-2 text-sm text-accent">
                  <span className="animate-spin">⏳</span> Analizando con IA...
                </div>
              )}

              {summary && (
                <>
                  {/* Relevance badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded ${relevanceColor(summary.relevanceScore)}`}
                    >
                      Relevancia: {summary.relevanceScore}/10
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {CATEGORIES[summary.suggestedCategory]?.name || summary.suggestedCategory}
                    </span>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">{summary.summary}</div>

                  {/* Tags */}
                  <div className="flex gap-1 flex-wrap">
                    {summary.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] bg-accent/10 text-accent rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Edit form */}
                  <div className="space-y-3 pt-2 border-t">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Contenido HTML</label>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 text-sm border rounded-lg font-mono"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={publishArticle}
                        disabled={publishing || !editTitle || !editContent}
                        className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {publishing ? "Publicando..." : "Publicar artículo"}
                      </button>
                      <a
                        href={selected.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                      >
                        Ver original
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
