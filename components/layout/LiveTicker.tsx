"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface TickerItem {
  name: string;
  slug: string;
  score: number;
  avgPrice: number | null;
  currency: string;
}

function scoreColor(score: number) {
  if (score >= 75) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function formatPrice(price: number | null, currency: string) {
  if (!price) return null;
  return currency === "COP"
    ? `$${Math.round(price / 1000)}k`
    : `$${Math.round(price)}`;
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

  const tickerContent = items.map((item) => (
    <Link
      key={item.slug}
      href={`/pulse/${item.slug}`}
      className="inline-flex items-center gap-1.5 px-4 whitespace-nowrap hover:opacity-80 transition-opacity"
    >
      <span className="text-gray-300 font-medium">{item.name}</span>
      <span className={`font-mono font-bold ${scoreColor(item.score)}`}>
        {item.score}
      </span>
      {item.avgPrice && (
        <>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400 font-mono">
            {formatPrice(item.avgPrice, item.currency)}/noche
          </span>
        </>
      )}
    </Link>
  ));

  return (
    <div className="bg-primary text-xs overflow-hidden border-b border-gray-800">
      <div className="flex items-center">
        {/* EN VIVO badge */}
        <div className="flex-shrink-0 z-10 bg-primary pl-3 pr-4 py-1.5 flex items-center gap-2 border-r border-gray-800">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            En vivo
          </span>
        </div>

        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden py-1.5">
          <div className="ticker-track flex">
            {/* Duplicate content for seamless loop */}
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
