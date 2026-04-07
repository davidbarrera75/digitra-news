export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import { getLatestPulses } from "@/lib/actions/pulse";
import ComparisonTable from "@/components/pulse/ComparisonTable";

export const metadata: Metadata = {
  title: "Pulse — Inteligencia Turística en Tiempo Real",
  description:
    "Estado diario de las principales ciudades turísticas de Colombia: vuelos, precios Airbnb, clima, eventos y el Digitra Score.",
  openGraph: {
    title: "Digitra Pulse — Inteligencia Turística en Tiempo Real",
    description: "Compara ciudades colombianas: vuelos, alojamiento, clima y más.",
  },
};

export default async function PulsePage() {
  const pulses = await getLatestPulses();

  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <span className="text-xs font-mono text-accent uppercase tracking-widest">En vivo</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black leading-tight">
            Digitra Pulse
          </h1>
          <p className="text-lg text-gray-300 mt-3 max-w-2xl">
            Inteligencia turistica en tiempo real. Compara vuelos, alojamiento, clima y eventos de las principales ciudades de Colombia.
          </p>
          <p className="text-sm text-gray-400 mt-4 font-mono capitalize">{today}</p>
        </div>
      </div>

      {/* Best destination highlight */}
      {pulses.length > 0 && pulses[0].score >= 60 && (
        <div className="max-w-6xl mx-auto px-4 -mt-6">
          <Link
            href={`/pulse/${pulses[0].destination.slug}`}
            className="block bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-accent uppercase tracking-widest mb-1">
                  Mejor destino hoy
                </p>
                <h2 className="text-2xl font-display font-bold text-primary">
                  {pulses[0].destination.name}
                </h2>
                {pulses[0].aiSummary && (
                  <p className="text-sm text-gray-600 mt-2 max-w-xl">{pulses[0].aiSummary}</p>
                )}
              </div>
              <div className="text-center">
                <p className="text-5xl font-mono font-black text-accent">{pulses[0].score}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Score</p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Comparison Table */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-primary">
            ¿A donde viajar esta semana?
          </h2>
          <span className="text-[10px] text-gray-400 font-mono">
            {pulses.length} ciudades monitoreadas
          </span>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <ComparisonTable pulses={pulses} />
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-primary rounded-xl p-8 text-center">
          <h3 className="text-xl font-display font-bold text-white mb-2">
            ¿Tienes una propiedad vacacional?
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Crea tu pagina de reservas gratis y aparece en el Pulse de tu ciudad.
          </p>
          <a
            href="https://digitra.rentals/anfitriones"
            target="_blank"
            rel="noopener"
            className="inline-block px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Crear pagina gratis →
          </a>
        </div>
      </div>

      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Digitra Pulse — Inteligencia Turística Colombia",
            description: "Datos diarios de vuelos, alojamiento, clima y eventos para ciudades turísticas de Colombia.",
            creator: { "@type": "Organization", name: "Digitra News", url: "https://digitra.news" },
            temporalCoverage: new Date().toISOString().split("T")[0],
            spatialCoverage: { "@type": "Place", name: "Colombia" },
          }),
        }}
      />
    </div>
  );
}
