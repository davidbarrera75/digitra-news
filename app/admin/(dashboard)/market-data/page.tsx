"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DestinationData {
  destination: { id: number; name: string; slug: string; country: string };
  avgPrice: number | null;
  totalListings: number | null;
  trend: number;
  lastUpdated: string | null;
}

export default function MarketDataPage() {
  const [data, setData] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState<number | null>(null);
  const [scanningAll, setScanningAll] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/market-summary");
      if (!res.ok) {
        setMessage(res.status === 401 ? "Sesión expirada. Vuelve a iniciar sesión." : "Error al cargar datos");
        return;
      }
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      } else {
        setMessage("Error al cargar datos");
      }
    } catch {
      setMessage("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const scanDestination = async (destId: number) => {
    setScanning(destId);
    setMessage("");
    try {
      const res = await fetch("/api/market-data/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationId: destId }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setMessage(`${json.destination}: $${json.insights.averageNightlyRate}/noche (${json.insights.totalListings} listings)`);
      await loadData();
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : "desconocido"}`);
    } finally {
      setScanning(null);
    }
  };

  const scanAll = async () => {
    setScanningAll(true);
    setMessage("Escaneando todos los destinos... esto puede tardar varios minutos");
    let completed = 0;
    for (const item of data) {
      try {
        await fetch("/api/market-data/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destinationId: item.destination.id }),
        });
        completed++;
        setMessage(`Progreso: ${completed}/${data.length} destinos escaneados`);
      } catch {
        // Continue with next
      }
    }
    setMessage(`Escaneo completo: ${completed}/${data.length} destinos`);
    setScanningAll(false);
    await loadData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Market Data</h1>
          <p className="text-sm text-gray-500 mt-1">Precios de alojamiento por destino vía Apify</p>
        </div>
        <button
          onClick={scanAll}
          disabled={scanningAll}
          className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
        >
          {scanningAll ? "Escaneando..." : "Escanear todos"}
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">{message}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando destinos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div
              key={item.destination.id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-primary">{item.destination.name}</h3>
                  <p className="text-xs text-gray-400">{item.destination.country}</p>
                </div>
                {item.trend !== 0 && (
                  <span
                    className={`text-sm font-mono font-medium ${
                      item.trend > 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {item.trend > 0 ? "▲" : "▼"} {Math.abs(item.trend)}%
                  </span>
                )}
              </div>

              {item.avgPrice ? (
                <div className="mb-3">
                  <p className="text-3xl font-mono font-bold text-primary">${item.avgPrice}</p>
                  <p className="text-xs text-gray-400">precio promedio/noche</p>
                  {item.totalListings && (
                    <p className="text-xs text-gray-500 mt-1">{item.totalListings} listings analizados</p>
                  )}
                </div>
              ) : (
                <div className="mb-3 py-4 text-center text-gray-300 text-sm">Sin datos aún</div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => scanDestination(item.destination.id)}
                  disabled={scanning === item.destination.id || scanningAll}
                  className="flex-1 px-3 py-1.5 text-xs bg-accent/10 text-accent rounded hover:bg-accent/20 disabled:opacity-50"
                >
                  {scanning === item.destination.id ? "Escaneando..." : "Escanear"}
                </button>
                {item.avgPrice && (
                  <Link
                    href={`/admin/market-data/${item.destination.slug}`}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50"
                  >
                    Detalle
                  </Link>
                )}
              </div>

              {item.lastUpdated && (
                <p className="text-[10px] text-gray-300 mt-3">
                  Actualizado:{" "}
                  {new Date(item.lastUpdated).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
