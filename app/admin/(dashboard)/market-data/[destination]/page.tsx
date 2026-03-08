export const dynamic = "force-dynamic";

import { getDestinationDetail } from "@/lib/actions/market-data";
import Link from "next/link";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination: slug } = await params;
  const detail = await getDestinationDetail(slug);

  if (!detail) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Destino no encontrado</p>
        <Link href="/admin/market-data" className="text-accent text-sm mt-2 inline-block">
          ← Volver
        </Link>
      </div>
    );
  }

  const { destination, metrics } = detail;
  const avgRates = metrics["avg_nightly_rate"] || [];
  const airbnbAvgs = metrics["airbnb_avg"] || [];
  const bookingAvgs = metrics["booking_avg"] || [];
  const budgets = metrics["budget_price"] || [];
  const mids = metrics["mid_price"] || [];
  const premiums = metrics["premium_price"] || [];
  const listings = metrics["total_listings"] || [];

  const latestAvg = avgRates[0]?.value || 0;
  const latestListings = listings[0]?.value || 0;
  const latestAirbnb = airbnbAvgs[0]?.value || 0;
  const latestBooking = bookingAvgs[0]?.value || 0;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/market-data" className="text-gray-400 hover:text-primary">
          ← Volver
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">{destination.name}</h1>
          <p className="text-sm text-gray-500">{destination.country}</p>
        </div>
      </div>

      {avgRates.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No hay datos de mercado aún. Ejecuta un escaneo desde el panel principal.
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Promedio/Noche</p>
              <p className="text-2xl font-mono font-bold text-primary">${latestAvg}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Listings</p>
              <p className="text-2xl font-mono font-bold text-primary">{latestListings}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Airbnb Avg</p>
              <p className="text-2xl font-mono font-bold text-accent">${latestAirbnb}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Booking Avg</p>
              <p className="text-2xl font-mono font-bold text-secondary">${latestBooking}</p>
            </div>
          </div>

          {/* Platform Comparison */}
          <div className="bg-white rounded-lg border p-6 mb-8">
            <h2 className="text-lg font-display font-bold text-primary mb-4">Comparación Airbnb vs Booking</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-accent font-medium">Airbnb</span>
                  <span className="font-mono">${latestAirbnb}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{
                      width: `${Math.min(100, (latestAirbnb / Math.max(latestAirbnb, latestBooking, 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary font-medium">Booking.com</span>
                  <span className="font-mono">${latestBooking}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{
                      width: `${Math.min(100, (latestBooking / Math.max(latestAirbnb, latestBooking, 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              {latestAirbnb > 0 && latestBooking > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {latestAirbnb > latestBooking
                    ? `Airbnb es ${Math.round(((latestAirbnb - latestBooking) / latestBooking) * 100)}% más caro`
                    : latestBooking > latestAirbnb
                      ? `Booking es ${Math.round(((latestBooking - latestAirbnb) / latestAirbnb) * 100)}% más caro`
                      : "Ambas plataformas tienen precios similares"}
                </p>
              )}
            </div>
          </div>

          {/* Price Ranges */}
          {budgets.length > 0 && (
            <div className="bg-white rounded-lg border p-6 mb-8">
              <h2 className="text-lg font-display font-bold text-primary mb-4">Rangos de Precio</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 uppercase tracking-wider mb-1">Budget</p>
                  <p className="text-xl font-mono font-bold text-green-700">${budgets[0]?.value || 0}</p>
                  <p className="text-[10px] text-green-500">percentil 25</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 uppercase tracking-wider mb-1">Mid-Range</p>
                  <p className="text-xl font-mono font-bold text-blue-700">${mids[0]?.value || 0}</p>
                  <p className="text-[10px] text-blue-500">mediana</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 uppercase tracking-wider mb-1">Premium</p>
                  <p className="text-xl font-mono font-bold text-purple-700">${premiums[0]?.value || 0}</p>
                  <p className="text-[10px] text-purple-500">percentil 75</p>
                </div>
              </div>
            </div>
          )}

          {/* Historical Data */}
          {avgRates.length > 1 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-display font-bold text-primary mb-4">Historial de Precios</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-xs text-gray-400 uppercase">Fecha</th>
                      <th className="text-right py-2 text-xs text-gray-400 uppercase">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avgRates.slice(0, 12).map((rate, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-2 text-gray-600">
                          {new Date(rate.collectedAt).toLocaleDateString("es-CO", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-2 text-right font-mono font-medium">${rate.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
