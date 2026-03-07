import Link from "next/link";
import Image from "next/image";
import CategoryPill from "@/components/ui/CategoryPill";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ArticleCardProps {
  article: {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    coverImageAlt: string | null;
    publishedAt: Date | null;
    readingTime: number;
    sourceType: string;
    category: {
      name: string;
      slug: string;
      color: string | null;
    } | null;
  };
  variant?: "default" | "hero" | "compact";
}

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const href = article.category
    ? `/${article.category.slug}/${article.slug}`
    : `/${article.slug}`;

  if (variant === "hero") {
    return (
      <Link href={href} className="group block">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-secondary/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {article.category && (
              <CategoryPill name={article.category.name} color={article.category.color || "#0EA5E9"} />
            )}
            <h2 className="mt-3 text-2xl md:text-3xl font-display font-bold text-white leading-tight">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="mt-2 text-gray-200 text-sm line-clamp-2">{article.excerpt}</p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex gap-4 items-start">
        {article.coverImage && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.coverImageAlt || article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-display font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.publishedAt && (
            <time className="text-xs text-gray-400 mt-1 block">
              {format(new Date(article.publishedAt), "d MMM yyyy", { locale: es })}
            </time>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.coverImageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/10 to-secondary/10" />
        )}
        {article.sourceType === "curated" && (
          <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
            Curado
          </span>
        )}
      </div>
      <div>
        {article.category && (
          <CategoryPill name={article.category.name} color={article.category.color || "#0EA5E9"} />
        )}
        <h3 className="mt-2 text-lg font-display font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          {article.publishedAt && (
            <time>{format(new Date(article.publishedAt), "d MMM yyyy", { locale: es })}</time>
          )}
          <span>{article.readingTime} min lectura</span>
        </div>
      </div>
    </Link>
  );
}
