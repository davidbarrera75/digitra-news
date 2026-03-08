import Link from "next/link";

interface PulseCity {
  name: string;
  slug: string;
  score: number;
  scoreLabel: string | null;
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-red-500 bg-red-50 border-red-200";
}

export default function PulseToday({ cities, date }: { cities: PulseCity[]; date: string }) {
  if (cities.length === 0) return null;

  return (
    <section className="py-8 border-t border-border">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-display font-bold text-primary">Pulse Hoy</h2>
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-medium uppercase tracking-wider rounded-full">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            En vivo
          </span>
        </div>
        <Link href="/pulse" className="text-sm text-accent hover:underline">Ver detalle →</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/pulse/${city.slug}`}
            className={`rounded-xl border p-3 text-center hover:shadow-sm transition-all ${scoreColor(city.score)}`}
          >
            <div className="relative mx-auto w-12 h-12 mb-2">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.15" />
                <circle
                  cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3"
                  strokeDasharray={`${(city.score / 100) * 125.6} 125.6`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono">
                {city.score}
              </span>
            </div>
            <p className="text-xs font-semibold truncate">{city.name}</p>
          </Link>
        ))}
      </div>
      <p className="text-[10px] text-gray-300 mt-3">Actualizado: {date} · Fuente: Digitra Pulse</p>
    </section>
  );
}
