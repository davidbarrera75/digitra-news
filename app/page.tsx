export const dynamic = "force-dynamic";

import Link from "next/link";
import DataCard from "@/components/data/DataCard";
import RentalsCTA from "@/components/cta/RentalsCTA";
import NewsletterCTA from "@/components/cta/NewsletterCTA";
import CategoryPill from "@/components/ui/CategoryPill";
import PulseToday from "@/components/home/PulseToday";
import SectorNews from "@/components/home/SectorNews";
import { getPublishedArticles, getFeaturedArticle } from "@/lib/actions/articles";
import { getDestinations } from "@/lib/actions/destinations";
import { getCategories } from "@/lib/actions/categories";
import { getLatestPulses } from "@/lib/actions/pulse";
import { getLatestCuratedItems, getTopCuratedItem } from "@/lib/actions/curated";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function HomePage() {
  const [articles, featured, destinations, categories, pulses, curatedItems, topCurated] = await Promise.all([
    getPublishedArticles(10),
    getFeaturedArticle(),
    getDestinations(),
    getCategories(),
    getLatestPulses(),
    getLatestCuratedItems(4),
    getTopCuratedItem(),
  ]);

  // Use curated item as hero if the latest article is not from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const latestArticle = featured || articles[0];
  const articleIsFromToday = latestArticle?.publishedAt && new Date(latestArticle.publishedAt) >= today;

  const curatedHero = !articleIsFromToday && topCurated
    ? {
        id: `curated-${topCurated.id}`,
        title: topCurated.aiSummary || topCurated.title,
        excerpt: topCurated.title,
        slug: topCurated.slug,
        coverImage: null as string | null,
        coverImageAlt: null as string | null,
        category: topCurated.category || { name: "Noticias", slug: "noticias", color: "#EF4444" },
        publishedAt: topCurated.createdAt,
        readingTime: 3,
        _isCurated: true,
      }
    : null;

  const hero = curatedHero || latestArticle;
  const secondary = articles.filter((a) => a.id !== latestArticle?.id).slice(0, 4);
  const hasContent = articles.length > 0 || !!curatedHero;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-8 md:py-12">
        {hasContent && hero ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Link
                href={'_isCurated' in hero && hero.slug ? `/noticias/${hero.slug}` : hero.category ? `/${hero.category.slug}/${hero.slug}` : `/${hero.slug}`}
                className="group block"
              >
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-secondary/20 mb-4">
                  {hero.coverImage && (
                    <img
                      src={hero.coverImage}
                      alt={hero.coverImageAlt || hero.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    {hero.category && (
                      <CategoryPill name={hero.category.name} color={hero.category.color || "#0EA5E9"} />
                    )}
                    <h1 className="mt-3 text-2xl md:text-4xl font-display font-bold text-white leading-tight">
                      {hero.title}
                    </h1>
                    {hero.excerpt && (
                      <p className="mt-2 text-gray-200 text-sm md:text-base line-clamp-2 max-w-2xl">
                        {hero.excerpt}
                      </p>
                    )}
                    {hero.publishedAt && (
                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-300">
                        <time>{format(new Date(hero.publishedAt), "d MMM yyyy", { locale: es })}</time>
                        <span>{hero.readingTime} min lectura</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
            <div className="space-y-4">
              {secondary.map((article) => (
                <Link
                  key={article.id}
                  href={article.category ? `/${article.category.slug}/${article.slug}` : `/${article.slug}`}
                  className="group block p-4 rounded-xl border border-border hover:border-accent/30 hover:shadow-sm transition-all"
                >
                  {article.category && (
                    <CategoryPill name={article.category.name} color={article.category.color || "#0EA5E9"} />
                  )}
                  <h3 className="mt-2 text-sm font-display font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.publishedAt && (
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                      <time>{format(new Date(article.publishedAt), "d MMM yyyy", { locale: es })}</time>
                      <span>{article.readingTime} min</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Digitra News
            </h1>
            <p className="text-xl text-gray-500 mb-2">El primer medio turístico basado en datos de LATAM</p>
            <p className="text-gray-400 mb-8">
              Próximamente: artículos sobre destinos, precios de Airbnb, tendencias y más.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/admin"
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors"
              >
                Ir al Admin
              </Link>
              <Link
                href="/newsletter"
                className="px-6 py-3 border border-border hover:bg-white text-primary font-medium rounded-lg transition-colors"
              >
                Suscribirme
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Pulse Hoy */}
      <PulseToday
        cities={pulses.map((p) => ({
          name: p.destination.name,
          slug: p.destination.slug,
          score: p.score,
          scoreLabel: p.scoreLabel,
        }))}
        date={format(new Date(), "d MMM yyyy", { locale: es })}
      />

      {/* Data Turismo Section */}
      <section className="py-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-display font-bold text-primary">Data Turismo</h2>
            <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-medium uppercase tracking-wider rounded-full">
              Basado en datos
            </span>
          </div>
          <Link href="/datos" className="text-sm text-accent hover:underline">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DataCard label="Precio promedio Airbnb" value="$136 USD" trend={0} sublabel="Medellín · Marzo 2026 · 5,959 listings" />
          <DataCard label="Mediana por noche" value="$72 USD" trend={0} sublabel="Medellín · 50% de propiedades bajo este precio" />
          <DataCard label="Rango budget" value="$44 USD" trend={0} sublabel="Medellín · Cuartil más económico (Q1)" />
        </div>
      </section>

      {/* Noticias del Sector */}
      <SectorNews items={curatedItems.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug ?? null,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        aiSummary: item.aiSummary,
        createdAt: item.createdAt,
      }))} />

      {/* Destinations Section */}
      {destinations.length > 0 && (
        <section className="py-8 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-primary">Destinos Populares</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {destinations.slice(0, 5).map((dest) => (
              <Link
                key={dest.id}
                href={`/destinos/${dest.slug}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary/80 to-accent/60"
              >
                {dest.coverImage && (
                  <img
                    src={dest.coverImage}
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display font-bold text-white text-lg">{dest.name}</h3>
                  <p className="text-gray-200 text-xs">{dest.articleCount} artículos</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && hasContent && (
        <section className="py-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.slice(0, 2).map((cat) => {
              const catArticles = articles.filter((a) => a.categoryId === cat.id).slice(0, 3);
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-display font-bold text-primary">{cat.name}</h2>
                    <Link href={`/${cat.slug}`} className="text-sm text-accent hover:underline">Ver más →</Link>
                  </div>
                  {catArticles.length > 0 ? (
                    <div className="space-y-3">
                      {catArticles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/${cat.slug}/${article.slug}`}
                          className="group block p-3 rounded-lg hover:bg-white transition-colors"
                        >
                          <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors line-clamp-1">
                            {article.title}
                          </h3>
                          {article.publishedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {format(new Date(article.publishedAt), "d MMM yyyy", { locale: es })} · {article.readingTime} min
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 py-4">Próximamente</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-8">
        <RentalsCTA variant="banner" />
      </section>

      {/* Newsletter */}
      <section className="py-8 pb-16">
        <NewsletterCTA />
      </section>
    </div>
  );
}
