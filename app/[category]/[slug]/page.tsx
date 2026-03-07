export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/actions/articles";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CategoryPill from "@/components/ui/CategoryPill";
import RentalsCTA from "@/components/cta/RentalsCTA";
import ArticleCard from "@/components/articles/ArticleCard";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || undefined,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      images: article.ogImage || article.coverImage ? [{ url: article.ogImage || article.coverImage! }] : undefined,
    },
    alternates: {
      canonical: article.canonicalUrl || `${SITE_URL}/${article.category?.slug}/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || (article.category && article.category.slug !== category)) {
    notFound();
  }

  const related = article.category
    ? (await getArticlesByCategory(article.category.slug, 4)).filter((a) => a.id !== article.id).slice(0, 3)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Person", name: "David Barrera" },
    publisher: { "@type": "Organization", name: SITE_NAME },
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    image: article.coverImage || undefined,
    mainEntityOfPage: `${SITE_URL}/${category}/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href={`/${category}`} className="text-sm text-accent hover:underline">
            ← {article.category?.name || category}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <article className="lg:col-span-2">
            <header className="mb-8">
              {article.category && (
                <div className="flex items-center gap-3 mb-4">
                  <CategoryPill name={article.category.name} color={article.category.color || "#0EA5E9"} />
                  <span className="text-xs text-gray-400">{article.readingTime} min lectura</span>
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary leading-tight">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="mt-3 text-xl text-gray-500">{article.subtitle}</p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span>Por David Barrera</span>
                <span>·</span>
                {article.publishedAt && (
                  <time>{format(new Date(article.publishedAt), "d MMMM yyyy", { locale: es })}</time>
                )}
              </div>
            </header>

            {article.coverImage && (
              <figure className="mb-8">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={article.coverImage}
                    alt={article.coverImageAlt || article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {article.coverImage.includes("unsplash.com") && (
                  <figcaption className="text-[10px] text-gray-400 mt-1 text-right">
                    Foto via <a href="https://unsplash.com/?utm_source=digitra_news&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Unsplash</a>
                  </figcaption>
                )}
              </figure>
            )}

            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {article.sourceType === "curated" && article.sourceUrl && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-border">
                <p className="text-sm text-gray-500">
                  Fuente original:{" "}
                  <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {article.sourceName || article.sourceUrl}
                  </a>
                </p>
              </div>
            )}

            {article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <RentalsCTA variant="sidebar" articleId={article.id} />

            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-4">Artículos relacionados</h3>
                <div className="space-y-4">
                  {related.map((rel) => (
                    <ArticleCard key={rel.id} article={rel} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
