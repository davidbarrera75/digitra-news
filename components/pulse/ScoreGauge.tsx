interface ScoreGaugeProps {
  score: number;
  label: string | null;
  size?: "sm" | "lg";
}

function getColor(score: number) {
  if (score >= 80) return { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200", bar: "bg-emerald-500" };
  if (score >= 65) return { bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-200", bar: "bg-sky-500" };
  if (score >= 50) return { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-200", bar: "bg-amber-500" };
  if (score >= 35) return { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-200", bar: "bg-orange-500" };
  return { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-200", bar: "bg-red-500" };
}

export default function ScoreGauge({ score, label, size = "lg" }: ScoreGaugeProps) {
  const colors = getColor(score);

  if (size === "sm") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} ring-1 ${colors.ring}`}>
        <span className={`text-lg font-mono font-bold ${colors.text}`}>{score}</span>
        <span className="text-[10px] text-gray-500">/100</span>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl ${colors.bg} ring-1 ${colors.ring} p-6 text-center`}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Digitra Score</p>
      <p className={`text-6xl font-mono font-black ${colors.text} leading-none`}>{score}</p>
      <div className="w-full h-2 bg-white/50 rounded-full mt-4 overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-full transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      {label && <p className="text-sm text-gray-600 mt-3 font-medium">{label}</p>}
      <p className="text-[10px] text-gray-400 mt-1">Fuente: Digitra News</p>
    </div>
  );
}
