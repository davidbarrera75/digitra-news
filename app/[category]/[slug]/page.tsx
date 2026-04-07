export const revalidate = 3600;

import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
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
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const locale = await getServerLocale();
  const title = localized(article, 'metaTitle', locale) || localized(article, 'title', locale);
  const description = localized(article, 'metaDescription', locale) || localized(article, 'excerpt', locale) || undefined;
  const alternates = article.titleEn
    ? await getAlternates(`/${category}/${slug}`)
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      images: article.ogImage || article.coverImage ? [{ url: article.ogImage || article.coverImage! }] : undefined,
    },
    alternates: {
      canonical: article.canonicalUrl || `${SITE_URL}/${article.category?.slug}/${article.slug}`,
      ...(alternates ? { languages: alternates.languages } : {}),
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || (article.category && article.category.slug !== category)) {
    notFound();
  }

  const locale = await getServerLocale();

  const related = article.category
    ? (await getArticlesByCategory(article.category.slug, 4)).filter((a) => a.id !== article.id).slice(0, 3)
    : [];

  const displayTitle = localized(article, 'title', locale);
  const displaySubtitle = localized(article, 'subtitle', locale);
  const displayContent = localized(article, 'content', locale);
  const displayExcerpt = localized(article, 'excerpt', locale);
  const displayAlt = localized(article, 'coverImageAlt', locale) || displayTitle;
  const cat = article.category;
  const categoryName = cat
    ? (locale === 'en' && cat.nameEn ? cat.nameEn : cat.name)
    : category;

  // Build rich schema: BlogPosting + FAQPage + HowTo (if available)
  const articleUrl = `${SITE_URL}/${category}/${slug}`;
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
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
      },
      inLanguage: locale === "en" ? "en" : "es-CO",
      keywords: article.seoKeyword || undefined,
      articleSection: categoryName,
      mainEntityOfPage: articleUrl,
    },
  ];

  // FAQPage schema from faqItems
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

  // HowTo schema from dataHighlights (if structured as HowTo)
  const howToData = article.dataHighlights as { name?: string; totalTime?: string; steps?: { name: string; text: string }[] } | null;
  if (howToData?.steps && Array.isArray(howToData.steps)) {
    graph.push({
      "@type": "HowTo",
      "@id": `${articleUrl}#howto`,
      name: howToData.name || displayTitle,
      description: displayExcerpt,
      totalTime: howToData.totalTime || undefined,
      step: howToData.steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    });
  }

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  const readingTimeLabel = locale === 'en'
    ? `${article.readingTime} min read`
    : `${article.readingTime} min lectura`;

  const publishedLabel = locale === 'en' ? 'By David Barrera' : 'Por David Barrera';
  const sourceLabel = locale === 'en' ? 'Original source:' : 'Fuente original:';
  const relatedLabel = locale === 'en' ? 'Related articles' : 'Artículos relacionados';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href={`/${category}`} className="text-sm text-accent hover:underline">
            ← {categoryName}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <article className="lg:col-span-2">
            <header className="mb-8">
              {article.category && (
                <div className="flex items-center gap-3 mb-4">
                  <CategoryPill name={categoryName} color={article.category.color || "#0EA5E9"} />
                  <span className="text-xs text-gray-400">{readingTimeLabel}</span>
                </div>
              )}
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary leading-tight">
                {displayTitle}
              </h1>
              {displaySubtitle && (
                <p className="mt-3 text-xl text-gray-500">{displaySubtitle}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{publishedLabel}</span>
                  <span>·</span>
                  {article.publishedAt && (
                    <time>
                      {locale === 'en'
                        ? formatDateByLocale(new Date(article.publishedAt), 'en')
                        : format(new Date(article.publishedAt), "d MMMM yyyy", { locale: es })}
                    </time>
                  )}
                </div>
                <ShareButton
                  url={`${SITE_URL}/${category}/${slug}`}
                  title={displayTitle}
                />
              </div>
            </header>

            {article.coverImage && (
              <figure className="mb-8">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={article.coverImage}
                    alt={displayAlt}
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
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />

            {article.sourceType === "curated" && article.sourceUrl && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-border">
                <p className="text-sm text-gray-500">
                  {sourceLabel}{" "}
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
                <h3 className="text-sm font-semibold text-primary mb-4">{relatedLabel}</h3>
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
