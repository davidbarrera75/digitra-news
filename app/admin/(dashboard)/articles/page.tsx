export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllArticlesAdmin } from "@/lib/actions/articles";
import CategoryPill from "@/components/ui/CategoryPill";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function ArticlesListPage() {
  const articles = await getAllArticlesAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-primary">
          Artículos ({articles.length})
        </h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Nuevo artículo
        </Link>
      </div>

      {articles.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                <th className="text-left p-4">Título</th>
                <th className="text-left p-4">Categoría</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Tipo</th>
                <th className="text-left p-4">Fecha</th>
                <th className="text-left p-4">Vistas</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-sm font-medium text-primary hover:text-accent transition-colors line-clamp-1"
                    >
                      {article.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">/{article.slug}</p>
                  </td>
                  <td className="p-4">
                    {article.category && (
                      <CategoryPill name={article.category.name} color={article.category.color || "#0EA5E9"} />
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        article.status === "published"
                          ? "bg-green-50 text-green-600"
                          : article.status === "scheduled"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {article.status === "published" ? "Publicado" : article.status === "scheduled" ? "Programado" : "Borrador"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-400">
                      {article.sourceType === "curated" ? "Curado" : "Original"}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-400">
                    {format(new Date(article.createdAt), "d MMM yyyy", { locale: es })}
                  </td>
                  <td className="p-4 text-xs text-gray-400 font-mono">
                    {article.viewsCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          <p>No hay artículos todavía.</p>
          <Link href="/admin/articles/new" className="text-accent hover:underline text-sm mt-2 inline-block">
            Crear el primero →
          </Link>
        </div>
      )}
    </div>
  );
}
