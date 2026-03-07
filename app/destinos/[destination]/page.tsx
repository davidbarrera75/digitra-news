import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { SITE_NAME } from "@/lib/constants";
import ArticleCard from "@/components/articles/ArticleCard";

interface Props {
  params: Promise<{ destination: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination: slug } = await params;
  const dest = await prisma.destination.findUnique({ where: { slug } });
  if (!dest) return {};

  return {
    title: `${dest.name}, ${dest.country} — Guías y datos | ${SITE_NAME}`,
    description: dest.description || `Todo sobre turismo en ${dest.name}: guías, precios de Airbnb, tendencias y consejos para viajeros.`,
  };
}

export default async function DestinationPage({ params }: Props) {
  const { destination: slug } = await params;

  const dest = await prisma.destination.findUnique({
    where: { slug },
    include: {
      articles: {
        include: {
          article: {
            include: { category: true },
          },
        },
        orderBy: { article: { publishedAt: "desc" } },
      },
    },
  });

  if (!dest) notFound();

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
          <Link href="/admin/generate" className="text-accent hover:underline text-sm mt-4 inline-block">
            Generar artículo con IA →
          </Link>
        </div>
      )}
    </div>
  );
}
