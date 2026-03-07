import TrendIndicator from "@/components/ui/TrendIndicator";

interface DataCardProps {
  label: string;
  value: string;
  trend?: number;
  trendSuffix?: string;
  sublabel?: string;
  href?: string;
}

export default function DataCard({ label, value, trend, trendSuffix = "%", sublabel }: DataCardProps) {
  return (
    <div className="data-card">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end gap-3">
        <p className="text-3xl font-mono font-bold text-primary">{value}</p>
        {trend !== undefined && <TrendIndicator value={trend} suffix={trendSuffix} />}
      </div>
      {sublabel && <p className="text-xs text-gray-400 mt-2">{sublabel}</p>}
      <p className="text-[10px] text-gray-300 mt-3">Fuente: Digitra News</p>
    </div>
  );
}
