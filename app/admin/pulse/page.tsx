"use client";

import { useState } from "react";
import Link from "next/link";

interface CollectResult {
  city: string;
  success: boolean;
  score?: number;
  error?: string;
}

const CITIES = [
  { slug: "cartagena", name: "Cartagena" },
  { slug: "medellin", name: "Medellín" },
  { slug: "bogota", name: "Bogotá" },
  { slug: "santa-marta", name: "Santa Marta" },
  { slug: "cali", name: "Cali" },
  { slug: "barranquilla", name: "Barranquilla" },
  { slug: "bucaramanga", name: "Bucaramanga" },
  { slug: "san-andres", name: "San Andrés" },
];

export default function AdminPulsePage() {
  const [collecting, setCollecting] = useState(false);
  const [collectingCity, setCollectingCity] = useState<string | null>(null);
  const [results, setResults] = useState<CollectResult[]>([]);
  const [message, setMessage] = useState("");

  const collectAll = async () => {
    setCollecting(true);
    setMessage("Recolectando datos para todas las ciudades...");
    setResults([]);
    try {
      const res = await fetch("/api/pulse/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results || []);
      const ok = (data.results || []).filter((r: CollectResult) => r.success).length;
      setMessage(`Pulse actualizado: ${ok}/${data.results?.length || 0} ciudades`);
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "desconocido"}`);
    } finally {
      setCollecting(false);
    }
  };

  const collectCity = async (slug: string) => {
    setCollectingCity(slug);
    try {
      const res = await fetch("/api/pulse/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: slug }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessage(`${data.city}: Score ${data.score}/100`);
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "desconocido"}`);
    } finally {
      setCollectingCity(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Digitra Pulse</h1>
          <p className="text-sm text-gray-500 mt-1">Recoleccion de datos y generacion de scores</p>
        </div>
        <div className="flex gap-3">
          <Link href="/pulse" target="_blank" className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Ver Pulse →
          </Link>
          <button onClick={collectAll} disabled={collecting} className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50">
            {collecting ? "Recolectando..." : "Actualizar todas"}
          </button>
        </div>
      </div>

      {message && <div className="mb-6 p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">{message}</div>}

      {results.length > 0 && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {results.map((r) => (
            <div key={r.city} className={`p-3 rounded-lg border text-center ${r.success ? "bg-white border-gray-200" : "bg-red-50 border-red-200"}`}>
              <p className="text-sm font-medium">{r.city}</p>
              {r.success ? <p className="text-2xl font-mono font-bold text-primary mt-1">{r.score}</p> : <p className="text-xs text-red-500 mt-1">Error</p>}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CITIES.map((city) => (
          <div key={city.slug} className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-display font-bold text-primary">{city.name}</h3>
            <div className="flex gap-2 mt-3">
              <button onClick={() => collectCity(city.slug)} disabled={collectingCity === city.slug || collecting} className="flex-1 px-3 py-1.5 text-xs bg-accent/10 text-accent rounded hover:bg-accent/20 disabled:opacity-50">
                {collectingCity === city.slug ? "..." : "Actualizar"}
              </button>
              <Link href={`/pulse/${city.slug}`} target="_blank" className="px-3 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50">
                Ver
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-2">Cron automatico</p>
        <code className="block p-2 bg-white rounded text-xs font-mono">
          0 6 * * * curl -X POST https://digitra.news/api/pulse/collect?secret=TU_SECRET -H Content-Type:application/json -d {`'{}'`}
        </code>
        <p className="mt-2 text-xs text-gray-400">Agrega PULSE_CRON_SECRET al .env del VPS.</p>
      </div>
    </div>
  );
}
