"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryPill from "@/components/ui/CategoryPill";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  readingTime: number;
  category: { name: string; slug: string; color: string | null } | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.trim().length < 2) { setResults([]); setSearched(false); return; }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data);
      setSearched(true);
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-display font-bold text-primary mb-6">Buscar</h1>

      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar artículos, destinos, datos..."
          className="w-full px-5 py-4 pl-12 border border-border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {loading && <p className="text-gray-400 text-center py-4">Buscando...</p>}

      {searched && !loading && results.length === 0 && (
        <p className="text-gray-400 text-center py-12">No se encontraron resultados para &quot;{query}&quot;</p>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">{results.length} resultado{results.length !== 1 ? "s" : ""}</p>
          {results.map((article) => (
            <Link
              key={article.id}
              href={article.category ? `/${article.category.slug}/${article.slug}` : `/${article.slug}`}
              className="group block p-5 rounded-xl border border-border hover:border-accent/30 hover:shadow-sm transition-all"
            >
              {article.category && (
                <CategoryPill name={article.category.name} color={article.category.color || "#0EA5E9"} />
              )}
              <h3 className="mt-2 text-lg font-display font-semibold text-primary group-hover:text-accent transition-colors">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
              )}
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                {article.publishedAt && (
                  <time>{format(new Date(article.publishedAt), "d MMM yyyy", { locale: es })}</time>
                )}
                <span>{article.readingTime} min lectura</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <p className="text-gray-400 text-center py-12">Escribe para buscar artículos, destinos y datos del turismo.</p>
      )}
    </div>
  );
}
