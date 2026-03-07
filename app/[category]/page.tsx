import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { getCategoryBySlug } from "@/lib/actions/categories";
import { getArticlesByCategory } from "@/lib/actions/articles";
import CategoryPill from "@/components/ui/CategoryPill";
import ArticleCard from "@/components/articles/ArticleCard";
import Link from "next/link";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.name} — ${SITE_NAME}`,
    description: category.description || undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const articles = await getArticlesByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <CategoryPill name={category.name} color={category.color || "#0EA5E9"} size="md" />
        <h1 className="mt-4 text-4xl font-display font-bold text-primary">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-gray-500 max-w-2xl">{category.description}</p>
        )}
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No hay artículos en {category.name} todavía.</p>
          <Link href="/admin/articles/new" className="text-accent hover:underline text-sm mt-4 inline-block">
            Crear primer artículo →
          </Link>
        </div>
      )}
    </div>
  );
}
