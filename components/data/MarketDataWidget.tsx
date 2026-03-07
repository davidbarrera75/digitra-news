"use client";

import { useEffect, useState } from "react";
import DataCard from "./DataCard";

interface MarketItem {
  destination: string;
  slug: string;
  value: number;
  period: string;
}

export default function MarketDataWidget() {
  const [data, setData] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/market-data?metric=avg_nightly_rate")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) setData(json.data.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || data.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((item) => (
        <DataCard
          key={item.slug}
          label={item.destination}
          value={`$${item.value}`}
          sublabel="promedio/noche"
        />
      ))}
    </div>
  );
}
