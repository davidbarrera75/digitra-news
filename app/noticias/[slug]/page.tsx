export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getCuratedItemBySlug, getRelatedCuratedItems } from "@/lib/actions/curated";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CategoryPill from "@/components/ui/CategoryPill";
import RentalsCTA from "@/components/cta/RentalsCTA";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCuratedItemBySlug(slug);
  if (!item) return {};

  const title = item.aiSummary || item.title;
  const description = item.originalExcerpt || item.aiSummary || item.title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: (item.publishedAt || item.createdAt).toISOString(),
    },
    alternates: {
      canonical: `${SITE_URL}/noticias/${item.slug}`,
    },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const item = await getCuratedItemBySlug(slug);

  if (!item) notFound();

  // Redirect to canonical slug if accessed via non-matching URL
  if (item.slug && item.slug !== slug) {
    const { redirect } = await import("next/navigation");
    redirect(`/noticias/${item.slug}`);
  }

  const related = await getRelatedCuratedItems(item.id, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.aiSummary || item.title,
    description: item.originalExcerpt || item.aiSummary || item.title,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    datePublished: (item.publishedAt || item.createdAt).toISOString(),
    mainEntityOfPage: `${SITE_URL}/noticias/${item.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/noticias" className="text-sm text-accent hover:underline">
            ← Noticias
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <article className="lg:col-span-2">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CategoryPill name="Noticias" color="#EF4444" />
                <span className="text-xs text-gray-400">{item.sourceName}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary leading-tight">
                {item.aiSummary || item.title}
              </h1>
              {item.aiSummary && (
                <p className="mt-3 text-lg text-gray-500">{item.title}</p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span>Fuente: {item.sourceName}</span>
                <span>·</span>
                <time>
                  {format(new Date(item.publishedAt || item.createdAt), "d MMMM yyyy", { locale: es })}
                </time>
              </div>
            </header>

            {/* Content section */}
            <div className="prose prose-lg max-w-none">
              {item.originalExcerpt && (
                <blockquote className="border-l-4 border-accent pl-4 italic text-gray-600 mb-6">
                  {item.originalExcerpt}
                </blockquote>
              )}

              {item.aiSummary && (
                <div className="mb-8">
                  <p className="text-lg text-primary leading-relaxed">{item.aiSummary}</p>
                </div>
              )}
            </div>

            {/* Source link */}
            <div className="mt-8 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-border">
              <p className="text-sm text-gray-500 mb-3">Lee la noticia completa en la fuente original:</p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
              >
                Leer en {item.sourceName}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
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
            <RentalsCTA variant="sidebar" />

            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-4">Más noticias</h3>
                <div className="space-y-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/noticias/${rel.slug}`}
                      className="group block p-3 rounded-lg border border-border hover:border-accent/30 transition-all"
                    >
                      <span className="text-[10px] font-medium text-accent uppercase tracking-wider">
                        {rel.sourceName}
                      </span>
                      <h4 className="mt-1 text-sm font-medium text-primary group-hover:text-accent transition-colors line-clamp-2">
                        {rel.aiSummary || rel.title}
                      </h4>
                    </Link>
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
