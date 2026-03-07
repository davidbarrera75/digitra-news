export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/actions/articles";
import ArticleCard from "@/components/articles/ArticleCard";
import CategoryPill from "@/components/ui/CategoryPill";
import RentalsCTA from "@/components/cta/RentalsCTA";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  params: Promise<{ destination: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination: slug } = await params;

  // Try as destination first
  const dest = await prisma.destination.findUnique({ where: { slug } });
  if (dest) {
    return {
      title: `${dest.name}, ${dest.country} — Guías y datos | ${SITE_NAME}`,
      description: dest.description || `Todo sobre turismo en ${dest.name}: guías, precios de Airbnb, tendencias y consejos para viajeros.`,
    };
  }

  // Try as article in "destinos" category
  const article = await getArticleBySlug(slug);
  if (article) {
    return {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || undefined,
      openGraph: {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.excerpt || undefined,
        type: "article",
        publishedTime: article.publishedAt?.toISOString(),
      },
      alternates: {
        canonical: `${SITE_URL}/destinos/${article.slug}`,
      },
    };
  }

  return {};
}

export default async function DestinationOrArticlePage({ params }: Props) {
  const { destination: slug } = await params;

  // Try as destination first
  const dest = await prisma.destination.findUnique({
    where: { slug },
    include: {
      articles: {
        include: { article: { include: { category: true } } },
        orderBy: { article: { publishedAt: "desc" } },
      },
    },
  });

  if (dest) {
    const articles = dest.articles
      .map((ad) => ad.article)
      .filter((a) => a.status === "published");

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/destinos" className="text-sm text-accent hover:underline">← Destinos</Link>
          <h1 className="mt-4 text-4xl font-display font-bold text-primary">{dest.name}</h1>
          <p className="mt-1 text-gray-500">{dest.country}</p>
          {dest.description && <p className="mt-2 text-gray-500 max-w-2xl">{dest.description}</p>}
        </div>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No hay artículos sobre {dest.name} todavía.</p>
          </div>
        )}
      </div>
    );
  }

  // Try as article
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== "published") notFound();

  // If article category is not "destinos", redirect to correct URL
  if (article.category && article.category.slug !== "destinos") {
    redirect(`/${article.category.slug}/${article.slug}`);
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
    mainEntityOfPage: `${SITE_URL}/destinos/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/destinos" className="text-sm text-accent hover:underline">
            ← {article.category?.name || "Destinos"}
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span>Por David Barrera</span>
                <span>·</span>
                {article.publishedAt && (
                  <time>{format(new Date(article.publishedAt), "d MMMM yyyy", { locale: es })}</time>
                )}
              </div>
            </header>
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            {article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
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
