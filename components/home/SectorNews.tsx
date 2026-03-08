import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface NewsItem {
  id: number;
  title: string;
  sourceName: string;
  sourceUrl: string;
  aiSummary: string | null;
  createdAt: Date;
}

export default function SectorNews({ items }: { items: NewsItem[] }) {
  // Only show items that have an AI summary in Spanish
  const filtered = items.filter((item) => item.aiSummary);
  if (filtered.length === 0) return null;

  return (
    <section className="py-8 border-t border-border">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-display font-bold text-primary">Tendencias Turismo</h2>
          <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-medium uppercase tracking-wider rounded-full">
            Actualización diaria
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <a
            key={item.id}
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-xl border border-border hover:border-accent/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-medium text-accent uppercase tracking-wider">
                {item.sourceName}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-[10px] text-gray-400">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: es })}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
              {item.aiSummary}
            </h3>
            <p className="mt-1.5 text-xs text-gray-400 line-clamp-1">{item.title}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
