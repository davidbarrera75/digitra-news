"use client";

import { useState } from "react";
import { createCuratedSource, updateCuratedSource, deleteCuratedSource } from "@/lib/actions/curated";

interface Source {
  id: number;
  name: string;
  url: string;
  rssFeedUrl: string | null;
  categoryId: number | null;
  isActive: boolean;
  lastFetchedAt: string | null;
  category?: { name: string } | null;
}

const CATEGORIES = [
  { id: 1, name: "Destinos" },
  { id: 2, name: "Data Turismo" },
  { id: 3, name: "Tendencias" },
  { id: 4, name: "Alquiler Vacacional" },
  { id: 5, name: "Noticias" },
];

export default function SourcesManager({ initialSources }: { initialSources: Source[] }) {
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [rssFeedUrl, setRssFeedUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name || !url) return;
    setSaving(true);
    try {
      const source = await createCuratedSource({ name, url, rssFeedUrl: rssFeedUrl || undefined, categoryId });
      setSources([...sources, { ...source, category: CATEGORIES.find((c) => c.id === categoryId) || null } as Source]);
      setShowForm(false);
      setName("");
      setUrl("");
      setRssFeedUrl("");
      setCategoryId(undefined);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: number, current: boolean) => {
    await updateCuratedSource(id, { isActive: !current });
    setSources(sources.map((s) => (s.id === id ? { ...s, isActive: !current } : s)));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta fuente?")) return;
    await deleteCuratedSource(id);
    setSources(sources.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Fuentes RSS</h1>
          <p className="text-sm text-gray-500 mt-1">{sources.length} fuentes configuradas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90"
        >
          {showForm ? "Cancelar" : "Agregar fuente"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-lg border mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Skift"
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">URL del sitio</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://skift.com"
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">URL del RSS Feed</label>
              <input
                type="url"
                value={rssFeedUrl}
                onChange={(e) => setRssFeedUrl(e.target.value)}
                placeholder="https://skift.com/feed/"
                className="w-full px-3 py-2 text-sm border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Categoría</label>
              <select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-sm border rounded-lg"
              >
                <option value="">Sin categoría</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={saving || !name || !url}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar fuente"}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {sources.map((source) => (
          <div
            key={source.id}
            className={`flex items-center justify-between p-4 rounded-lg border bg-white ${
              source.isActive ? "border-gray-200" : "border-gray-100 opacity-60"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-primary">{source.name}</h3>
                {source.category && (
                  <span className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded-full">
                    {source.category.name}
                  </span>
                )}
                {!source.isActive && (
                  <span className="px-2 py-0.5 text-[10px] bg-red-100 text-red-600 rounded-full">Inactiva</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{source.rssFeedUrl || source.url}</p>
              {source.lastFetchedAt && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Último fetch: {new Date(source.lastFetchedAt).toLocaleDateString("es-CO")}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(source.id, source.isActive)}
                className={`px-3 py-1 text-xs rounded ${
                  source.isActive
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {source.isActive ? "Desactivar" : "Activar"}
              </button>
              <button
                onClick={() => handleDelete(source.id)}
                className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
