"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface TickerItem {
  name: string;
  slug: string;
  score: number;
  avgPrice: number | null;
  currency: string;
  temp: number | null;
  weatherIcon: string | null;
}

function scoreColor(score: number) {
  if (score >= 75) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function scoreBg(score: number) {
  if (score >= 75) return "bg-green-400/10";
  if (score >= 60) return "bg-yellow-400/10";
  return "bg-red-400/10";
}

function formatPrice(price: number | null, currency: string) {
  if (!price) return null;
  return currency === "COP"
    ? `$${Math.round(price / 1000)}k`
    : `$${Math.round(price)}`;
}

function weatherEmoji(icon: string | null) {
  if (!icon) return "🌤";
  const code = icon.replace("n", "d"); // normalize night icons
  const map: Record<string, string> = {
    "01d": "☀️",
    "02d": "⛅",
    "03d": "☁️",
    "04d": "☁️",
    "09d": "🌧",
    "10d": "🌦",
    "11d": "⛈",
    "13d": "❄️",
    "50d": "🌫",
  };
  return map[code] || "🌤";
}

export default function LiveTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    fetch("/api/ticker")
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  const tickerContent = items.map((item, i) => (
    <Link
      key={item.slug}
      href={`/pulse/${item.slug}`}
      className="inline-flex items-center gap-2 px-5 whitespace-nowrap hover:opacity-80 transition-opacity"
    >
      {/* City name */}
      <span className="text-white font-semibold">{item.name}</span>

      {/* Score with label */}
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${scoreBg(item.score)}`}
      >
        <span className="text-gray-500 text-[9px] uppercase">Demanda</span>
        <span className={`font-mono font-bold ${scoreColor(item.score)}`}>
          {item.score}
        </span>
      </span>

      {/* Temperature */}
      {item.temp !== null && (
        <span className="text-gray-400">
          {weatherEmoji(item.weatherIcon)} {Math.round(item.temp)}°
        </span>
      )}

      {/* Avg price */}
      {item.avgPrice && (
        <span className="text-gray-400 font-mono">
          {formatPrice(item.avgPrice, item.currency)}/noche
        </span>
      )}

      {/* Separator */}
      {i < items.length - 1 && (
        <span className="text-gray-700 ml-3">|</span>
      )}
    </Link>
  ));

  return (
    <div className="bg-primary text-xs overflow-hidden border-b border-gray-800">
      <div className="flex items-center">
        {/* EN VIVO badge */}
        <div className="flex-shrink-0 z-10 bg-primary pl-3 pr-4 py-2 flex items-center gap-2 border-r border-gray-800">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            En vivo
          </span>
        </div>

        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden py-2">
          <div className="ticker-track flex">
            <div className="ticker-content flex shrink-0">{tickerContent}</div>
            <div className="ticker-content flex shrink-0" aria-hidden="true">
              {tickerContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
