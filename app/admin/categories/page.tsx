export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";

export default async function CategoriesAdminPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const articleCounts = await prisma.article.groupBy({
    by: ["categoryId"],
    where: { status: "published", categoryId: { not: null } },
    _count: true,
  });

  const countMap = new Map(articleCounts.map((c) => [c.categoryId, c._count]));

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-primary mb-6">Categorias</h1>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Articulos</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Color</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-primary">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-600">{countMap.get(cat.id) || 0}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color || "#ccc" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
