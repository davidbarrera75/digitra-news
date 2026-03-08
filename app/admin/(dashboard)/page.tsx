export const dynamic = "force-dynamic";

import Link from "next/link";
import { getArticleStats } from "@/lib/actions/articles";

export default async function AdminDashboard() {
  const stats = await getArticleStats();

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-primary mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Artículos", value: stats.total, color: "bg-accent" },
          { label: "Publicados", value: stats.published, color: "bg-secondary" },
          { label: "Borradores", value: stats.drafts, color: "bg-amber-500" },
          { label: "Categorías", value: "5", color: "bg-purple-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-2 h-2 rounded-full ${stat.color} mb-3`} />
            <p className="text-2xl font-mono font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-primary mb-4">Acciones rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/articles/new"
          className="p-6 bg-white rounded-xl border border-gray-200 hover:border-accent/30 hover:shadow-sm transition-all"
        >
          <h3 className="font-semibold text-primary mb-1">Nuevo artículo</h3>
          <p className="text-sm text-gray-400">Crear artículo original con editor</p>
        </Link>
        <Link
          href="/admin/curated"
          className="p-6 bg-white rounded-xl border border-gray-200 hover:border-accent/30 hover:shadow-sm transition-all"
        >
          <h3 className="font-semibold text-primary mb-1">Curar noticias</h3>
          <p className="text-sm text-gray-400">Importar y resumir desde fuentes RSS</p>
        </Link>
        <Link
          href="/admin/generate"
          className="p-6 bg-white rounded-xl border border-accent/20 border-2 hover:border-accent/40 hover:shadow-sm transition-all"
        >
          <h3 className="font-semibold text-accent mb-1">Generar con IA</h3>
          <p className="text-sm text-gray-400">Análisis SEO + generación de artículo con Claude</p>
        </Link>
      </div>
    </div>
  );
}
