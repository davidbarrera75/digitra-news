export const revalidate = 3600;

import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getCuratedItemBySlug, getRelatedCuratedItems } from "@/lib/actions/curated";
import { getArticleBySlug, getArticlesByCategory } from "@/lib/actions/articles";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import CategoryPill from "@/components/ui/CategoryPill";
import RentalsCTA from "@/components/cta/RentalsCTA";
import ArticleCard from "@/components/articles/ArticleCard";
import ShareButton from "@/components/articles/ShareButton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getServerLocale } from "@/lib/i18n/server";
import { getAlternates } from "@/lib/i18n/alternates";
import { localized, formatDateByLocale } from "@/lib/i18n/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCuratedItemBySlug(slug);
  if (!item) {
    // Fallback: check if it's an article in "noticias" category
    const article = await getArticleBySlug(slug);
    if (article && article.category?.slug === "noticias") {
      const locale = await getServerLocale();
      const title = localized(article, 'metaTitle', locale) || localized(article, 'title', locale);
      const description = localized(article, 'metaDescription', locale) || localized(article, 'excerpt', locale) || undefined;
      const alternates = article.titleEn
        ? await getAlternates(`/noticias/${slug}`)
        : undefined;
      return {
        title,
        description,
        alternates: {
          canonical: article.canonicalUrl || `${SITE_URL}/noticias/${slug}`,
          ...(alternates ? { languages: alternates.languages } : {}),
        },
      };
    }
    return {};
  }

  const locale = await getServerLocale();
  const title = localized(item, 'aiSummary', locale) || localized(item, 'title', locale);
  const description = item.originalExcerpt || title;
  const alternates = (item as Record<string, unknown>).titleEn
    ? await getAlternates(`/noticias/${item.slug}`)
    : undefined;

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
      ...(alternates ? { languages: alternates.languages } : {}),
    },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const item = await getCuratedItemBySlug(slug);

  if (!item) {
    // Fallback: render article if it exists in "noticias" category
    const article = await getArticleBySlug(slug);
    if (article && article.category?.slug === "noticias") {
      return renderArticleFallback(article, slug);
    }
    notFound();
  }

  if (item.slug && item.slug !== slug) {
    const { redirect } = await import("next/navigation");
    redirect(`/noticias/${item.slug}`);
  }

  const locale = await getServerLocale();
  const related = await getRelatedCuratedItems(item.id, 4);

  const displayTitle = localized(item, 'title', locale);
  const displaySummary = localized(item, 'aiSummary', locale);
  const headline = displaySummary || displayTitle;

  const newsLabel = locale === 'en' ? 'News' : 'Noticias';
  const sourceLabel = locale === 'en' ? 'Source:' : 'Fuente:';
  const readFullLabel = locale === 'en' ? 'Read the full story from the original source:' : 'Lee la noticia completa en la fuente original:';
  const readAtLabel = locale === 'en' ? `Read at ${item.sourceName}` : `Leer en ${item.sourceName}`;
  const moreNewsLabel = locale === 'en' ? 'More news' : 'Más noticias';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description: item.originalExcerpt || headline,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    datePublished: (item.publishedAt || item.createdAt).toISOString(),
    inLanguage: locale,
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
            ← {newsLabel}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <article className="lg:col-span-2">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CategoryPill name={newsLabel} color="#EF4444" />
                <span className="text-xs text-gray-400">{item.sourceName}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary leading-tight">
                {headline}
              </h1>
              {displaySummary && (
                <p className="mt-3 text-lg text-gray-500">{displayTitle}</p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span>{sourceLabel} {item.sourceName}</span>
                <span>·</span>
                <time>
                  {locale === 'en'
                    ? formatDateByLocale(new Date(item.publishedAt || item.createdAt), 'en')
                    : format(new Date(item.publishedAt || item.createdAt), "d MMMM yyyy", { locale: es })}
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

              {displaySummary && (
                <div className="mb-8">
                  <p className="text-lg text-primary leading-relaxed">{displaySummary}</p>
                </div>
              )}
            </div>

            {/* Source link */}
            <div className="mt-8 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-border">
              <p className="text-sm text-gray-500 mb-3">{readFullLabel}</p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
              >
                {readAtLabel}
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
                <h3 className="text-sm font-semibold text-primary mb-4">{moreNewsLabel}</h3>
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
                        {locale === 'en' ? ((rel as Record<string, unknown>).aiSummaryEn as string || rel.aiSummary || (rel as Record<string, unknown>).titleEn as string || rel.title) : (rel.aiSummary || rel.title)}
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

// Renders an Article (not CuratedItem) that lives in the "noticias" category
async function renderArticleFallback(article: Awaited<ReturnType<typeof getArticleBySlug>> & {}, slug: string) {
  const locale = await getServerLocale();
  const related = (await getArticlesByCategory("noticias", 4)).filter((a) => a.id !== article.id).slice(0, 3);

  const displayTitle = localized(article, 'title', locale);
  const displaySubtitle = localized(article, 'subtitle', locale);
  const displayContent = localized(article, 'content', locale);
  const displayAlt = localized(article, 'coverImageAlt', locale) || displayTitle;
  const newsLabel = locale === 'en' ? 'News' : 'Noticias';
  const relatedLabel = locale === 'en' ? 'Related articles' : 'Artículos relacionados';
  const readingLabel = locale === 'en' ? `${article.readingTime} min read` : `${article.readingTime} min lectura`;
  const byLabel = locale === 'en' ? 'By David Barrera' : 'Por David Barrera';

  const articleUrl = `${SITE_URL}/noticias/${slug}`;
  const displayExcerpt = localized(article, 'excerpt', locale);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${articleUrl}#article`,
      headline: displayTitle,
      description: displayExcerpt,
      url: articleUrl,
      datePublished: article.publishedAt?.toISOString(),
      dateModified: article.updatedAt.toISOString(),
      image: article.coverImage || undefined,
      author: { "@type": "Organization", name: "Digitra", url: SITE_URL },
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
      inLanguage: locale === "en" ? "en" : "es-CO",
      keywords: article.seoKeyword || undefined,
      articleSection: newsLabel,
      mainEntityOfPage: articleUrl,
    },
  ];
  const faqItems = article.faqItems as { question: string; answer: string }[] | null;
  if (faqItems && Array.isArray(faqItems) && faqItems.length > 0) {
    const faqLocalized = locale === "en" && article.faqItemsEn
      ? (article.faqItemsEn as { question: string; answer: string }[])
      : faqItems;
    graph.push({
      "@type": "FAQPage",
      "@id": `${articleUrl}#faq`,
      mainEntity: faqLocalized.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }
  const howToData = article.dataHighlights as { name?: string; totalTime?: string; steps?: { name: string; text: string }[] } | null;
  if (howToData?.steps && Array.isArray(howToData.steps)) {
    graph.push({
      "@type": "HowTo",
      "@id": `${articleUrl}#howto`,
      name: howToData.name || displayTitle,
      description: displayExcerpt,
      totalTime: howToData.totalTime || undefined,
      step: howToData.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
    });
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/noticias" className="text-sm text-accent hover:underline">← {newsLabel}</Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <article className="lg:col-span-2">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CategoryPill name={newsLabel} color="#EF4444" />
                <span className="text-xs text-gray-400">{readingLabel}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary leading-tight">{displayTitle}</h1>
              {displaySubtitle && <p className="mt-3 text-xl text-gray-500">{displaySubtitle}</p>}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{byLabel}</span>
                  <span>·</span>
                  {article.publishedAt && (
                    <time>
                      {locale === 'en'
                        ? formatDateByLocale(new Date(article.publishedAt), 'en')
                        : format(new Date(article.publishedAt), "d MMMM yyyy", { locale: es })}
                    </time>
                  )}
                </div>
                <ShareButton url={`${SITE_URL}/noticias/${slug}`} title={displayTitle} />
              </div>
            </header>
            {article.coverImage && (
              <figure className="mb-8">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
                  <img src={article.coverImage} alt={displayAlt} className="w-full h-full object-cover" />
                </div>
              </figure>
            )}
            <div className="article-content" dangerouslySetInnerHTML={{ __html: displayContent }} />
            {article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag}`} className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full hover:bg-gray-200 transition-colors">{tag}</Link>
                ))}
              </div>
            )}
          </article>
          <aside className="space-y-6">
            <RentalsCTA variant="sidebar" articleId={article.id} />
            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-primary mb-4">{relatedLabel}</h3>
                <div className="space-y-4">
                  {related.map((rel) => (<ArticleCard key={rel.id} article={rel} variant="compact" />))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
