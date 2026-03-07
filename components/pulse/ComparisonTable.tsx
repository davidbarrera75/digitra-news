import Link from "next/link";
import { PulseData } from "@/lib/pulse/types";
import ScoreGauge from "./ScoreGauge";

export default function ComparisonTable({ pulses }: { pulses: PulseData[] }) {
  if (pulses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-2">Sin datos de Pulse</p>
        <p className="text-sm">Ejecuta la recoleccion desde el admin para generar los primeros datos.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ciudad</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Score</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Vuelo desde</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Airbnb/noche</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Clima</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Temporada</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {pulses.map((pulse) => {
            const cheapestFlight = pulse.flights?.routes.reduce(
              (min, r) => (r.price < min ? r.price : min),
              Infinity
            );

            return (
              <tr
                key={pulse.destinationId}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <Link href={`/pulse/${pulse.destination.slug}`} className="group">
                    <p className="font-display font-bold text-primary group-hover:text-accent transition-colors">
                      {pulse.destination.name}
                    </p>
                    <p className="text-[10px] text-gray-400">{pulse.destination.country}</p>
                  </Link>
                </td>
                <td className="py-4 px-4 text-center">
                  <ScoreGauge score={pulse.score} label={null} size="sm" />
                </td>
                <td className="py-4 px-4 text-right">
                  {cheapestFlight && cheapestFlight < Infinity ? (
                    <span className="font-mono font-medium text-primary">
                      ${cheapestFlight.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-300">–</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  {pulse.accommodation ? (
                    <div>
                      <span className="font-mono font-medium text-primary">
                        ${pulse.accommodation.avgPrice.toLocaleString()}
                      </span>
                      {pulse.accommodation.trend !== "stable" && (
                        <span
                          className={`ml-1 text-xs font-mono ${
                            pulse.accommodation.trend === "down" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {pulse.accommodation.trend === "down" ? "▼" : "▲"}
                          {Math.abs(pulse.accommodation.trendPercent)}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-300">–</span>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  {pulse.weather ? (
                    <span className="text-sm">{pulse.weather.temp}°C</span>
                  ) : (
                    <span className="text-gray-300">–</span>
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  {pulse.seasonType && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        pulse.seasonType === "alta"
                          ? "bg-red-100 text-red-600"
                          : pulse.seasonType === "baja"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {pulse.seasonType}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <Link
                    href={`/pulse/${pulse.destination.slug}`}
                    className="text-xs text-accent hover:underline"
                  >
                    Ver pulse →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-[10px] text-gray-300 text-right mt-2">
        Actualizado: {pulses[0]?.date || "–"} · Fuente: Digitra News
      </p>
    </div>
  );
}
