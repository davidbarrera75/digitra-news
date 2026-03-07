import { EventsData } from "@/lib/pulse/types";
import PulseCard from "./PulseCard";

const SEASON_LABELS: Record<string, { text: string; color: string }> = {
  alta: { text: "Temporada Alta", color: "bg-red-100 text-red-700" },
  media: { text: "Temporada Media", color: "bg-yellow-100 text-yellow-700" },
  baja: { text: "Temporada Baja", color: "bg-green-100 text-green-700" },
};

const EVENT_ICONS: Record<string, string> = {
  festival: "🎭",
  cultura: "🎨",
  turismo: "🚢",
  naturaleza: "🌿",
  gastronomia: "🍽️",
  deporte: "⚽",
  musica: "🎵",
};

export default function EventsCard({ data }: { data: EventsData }) {
  const season = SEASON_LABELS[data.season] || SEASON_LABELS.media;

  return (
    <PulseCard icon="🎉" title="Temporada y Eventos" source="Digitra News">
      <div className="mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${season.color}`}>
          {season.text}
        </span>
      </div>

      {data.events.length > 0 ? (
        <div className="space-y-2">
          {data.events.map((event, i) => (
            <div key={i} className="flex items-start gap-2 py-1">
              <span className="text-sm">{EVENT_ICONS[event.type] || "📅"}</span>
              <div>
                <p className="text-sm font-medium text-gray-700">{event.name}</p>
                <p className="text-[10px] text-gray-400">
                  {new Date(event.date + "T12:00:00").toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 py-2">Sin eventos destacados esta semana</p>
      )}
    </PulseCard>
  );
}
