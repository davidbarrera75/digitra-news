import { AccommodationData } from "@/lib/pulse/types";
import PulseCard from "./PulseCard";

export default function AccommodationCard({ data }: { data: AccommodationData }) {
  const trendColor = data.trend === "down" ? "text-green-600" : data.trend === "up" ? "text-red-500" : "text-gray-400";
  const trendArrow = data.trend === "down" ? "▼" : data.trend === "up" ? "▲" : "–";

  return (
    <PulseCard icon="🏠" title="Alojamiento" source="Airbnb + Booking">
      <div className="text-center py-2">
        <p className="text-3xl font-mono font-bold text-primary">
          ${data.avgPrice.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400">promedio/noche ({data.currency})</p>
        <span className={`inline-flex items-center gap-1 text-sm font-mono font-medium mt-1 ${trendColor}`}>
          {trendArrow} {Math.abs(data.trendPercent)}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-50">
        <div className="text-center p-2 bg-sky-50 rounded-lg">
          <p className="text-[10px] text-sky-600 font-medium uppercase">Airbnb</p>
          <p className="text-lg font-mono font-bold text-sky-700">${data.airbnbAvg.toLocaleString()}</p>
        </div>
        <div className="text-center p-2 bg-emerald-50 rounded-lg">
          <p className="text-[10px] text-emerald-600 font-medium uppercase">Booking</p>
          <p className="text-lg font-mono font-bold text-emerald-700">${data.bookingAvg.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Desde ${data.minPrice.toLocaleString()}</span>
        <span>{data.listings} listings</span>
      </div>
    </PulseCard>
  );
}
