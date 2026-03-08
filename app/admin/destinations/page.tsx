export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import Image from "next/image";

export default async function DestinationsAdminPage() {
  const destinations = await prisma.destination.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-primary mb-6">Destinos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((dest) => (
          <div key={dest.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative aspect-[16/9] bg-gray-100">
              {dest.coverImage ? (
                <Image
                  src={dest.coverImage}
                  alt={dest.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center text-gray-400 text-sm">
                  Sin foto
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-primary">{dest.name}</h3>
              <p className="text-xs text-gray-400">{dest.country} · {dest.articleCount} articulos</p>
              <p className="text-xs text-gray-400 font-mono mt-1">/{dest.slug}</p>
              {dest.latitude && dest.longitude && (
                <p className="text-[10px] text-gray-300 mt-1">
                  {Number(dest.latitude).toFixed(4)}, {Number(dest.longitude).toFixed(4)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
