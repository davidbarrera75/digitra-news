import { FlightsData } from "@/lib/pulse/types";
import PulseCard from "./PulseCard";

export default function FlightsCard({ flights, cityName }: { flights: FlightsData; cityName: string }) {
  return (
    <PulseCard icon="✈️" title="Vuelos" source="Digitra News">
      <div className="space-y-2">
        {flights.routes.map((route) => (
          <div
            key={route.fromCode}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-700">
                {route.from} → {cityName}
              </p>
              <p className="text-[10px] text-gray-400">
                {route.fromCode} → destino{route.airline ? ` · ${route.airline}` : ""}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-mono font-bold text-primary">
                ${route.price.toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400">COP</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Ruta más económica: <span className="font-medium text-accent">{flights.cheapestRoute}</span>
        </p>
      </div>
    </PulseCard>
  );
}
