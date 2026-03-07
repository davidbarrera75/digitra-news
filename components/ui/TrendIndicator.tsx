interface TrendIndicatorProps {
  value: number;
  suffix?: string;
}

export default function TrendIndicator({ value, suffix = "%" }: TrendIndicatorProps) {
  const isUp = value > 0;
  const isZero = value === 0;

  return (
    <span className={`inline-flex items-center gap-0.5 text-sm font-mono font-medium ${isZero ? "text-gray-400" : isUp ? "trend-up" : "trend-down"}`}>
      {!isZero && (isUp ? "▲" : "▼")}
      {isZero ? "–" : `${Math.abs(value)}${suffix}`}
    </span>
  );
}
