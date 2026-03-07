export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import { getCityPulse } from "@/lib/actions/pulse";
import ScoreGauge from "@/components/pulse/ScoreGauge";
import WeatherCard from "@/components/pulse/WeatherCard";
import FlightsCard from "@/components/pulse/FlightsCard";
import AccommodationCard from "@/components/pulse/AccommodationCard";
import EventsCard from "@/components/pulse/EventsCard";

interface Props {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const pulse = await getCityPulse(city);
  if (!pulse) return { title: "Pulse — Digitra News" };

  const title = `${pulse.destination.name} Pulse — vuelos, Airbnb y clima hoy | Digitra News`;
  const description = pulse.aiSummary || `Estado turístico de ${pulse.destination.name}: vuelos, precios de alojamiento, clima y eventos actualizados diariamente.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function CityPulsePage({ params }: Props) {
  const { city } = await params;
  const pulse = await getCityPulse(city);

  if (!pulse) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-primary mb-2">Ciudad no encontrada</p>
          <p className="text-gray-500 mb-4">No hay datos de Pulse para esta ciudad.</p>
          <Link href="/pulse" className="text-accent hover:underline">← Volver al Pulse</Link>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Link href="/pulse" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Digitra Pulse
          </Link>
          <div className="flex items-center gap-3 mt-4 mb-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest">
              Actualizado: {pulse.date}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black">
            {pulse.destination.name}
          </h1>
          <p className="text-gray-400 mt-1 capitalize">{today}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Score + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-12">
          <div>
            <ScoreGauge score={pulse.score} label={pulse.scoreLabel} />
          </div>
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 flex items-center">
            {pulse.aiSummary ? (
              <div>
                <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">
                  Resumen del dia
                </p>
                <p className="text-gray-700 leading-relaxed">{pulse.aiSummary}</p>
                <p className="text-[10px] text-gray-300 mt-3">Generado por IA · Digitra News</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                El resumen se genera automaticamente al recolectar datos.
              </p>
            )}
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flights */}
          {pulse.flights && (
            <FlightsCard flights={pulse.flights} cityName={pulse.destination.name} />
          )}

          {/* Accommodation */}
          {pulse.accommodation && (
            <AccommodationCard data={pulse.accommodation} />
          )}

          {/* Weather */}
          {pulse.weather && (
            <WeatherCard weather={pulse.weather} />
          )}

          {/* Events */}
          {pulse.events && (
            <EventsCard data={pulse.events} />
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-xl border border-accent/10 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-display font-bold text-primary">
                ¿Buscas alojamiento en {pulse.destination.name}?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Encuentra propiedades verificadas con los mejores precios.
              </p>
            </div>
            <a
              href={`https://digitra.rentals/propiedades/colombia/${pulse.destination.slug}`}
              target="_blank"
              rel="noopener"
              className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors text-sm"
            >
              Ver propiedades →
            </a>
          </div>
        </div>
      </div>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `${pulse.destination.name} Pulse — Datos Turísticos`,
            description: `Datos diarios de vuelos, alojamiento y clima para ${pulse.destination.name}, ${pulse.destination.country}.`,
            creator: { "@type": "Organization", name: "Digitra News", url: "https://digitra.news" },
            temporalCoverage: pulse.date,
            spatialCoverage: {
              "@type": "Place",
              name: pulse.destination.name,
              geo: pulse.destination.latitude
                ? {
                    "@type": "GeoCoordinates",
                    latitude: pulse.destination.latitude,
                    longitude: pulse.destination.longitude,
                  }
                : undefined,
            },
          }),
        }}
      />
    </div>
  );
}
