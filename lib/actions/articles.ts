"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPublishedArticles(limit = 10) {
  return prisma.article.findMany({
    where: { status: "published" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getArticlesByCategory(categorySlug: string, limit = 20) {
  return prisma.article.findMany({
    where: {
      status: "published",
      category: { slug: categorySlug },
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      destinations: { include: { destination: true } },
    },
  });
}

export async function getFeaturedArticle() {
  return prisma.article.findFirst({
    where: { status: "published", isFeatured: true },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getAllArticlesAdmin() {
  return prisma.article.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createArticle(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categoryId?: number;
  subcategory?: string;
  sourceType?: string;
  sourceUrl?: string;
  sourceName?: string;
  metaTitle?: string;
  metaDescription?: string;
  seoKeyword?: string;
  tags?: string[];
  coverImage?: string;
  coverImageAlt?: string;
  readingTime?: number;
  status?: string;
  isFeatured?: boolean;
  dataHighlights?: string;
  faqItems?: string;
}) {
  const article = await prisma.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || null,
      categoryId: data.categoryId || null,
      subcategory: data.subcategory || null,
      sourceType: data.sourceType || "original",
      sourceUrl: data.sourceUrl || null,
      sourceName: data.sourceName || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      seoKeyword: data.seoKeyword || null,
      tags: data.tags || [],
      coverImage: data.coverImage || null,
      coverImageAlt: data.coverImageAlt || null,
      readingTime: data.readingTime || 5,
      status: data.status || "draft",
      isFeatured: data.isFeatured || false,
      dataHighlights: data.dataHighlights ? JSON.parse(data.dataHighlights) : undefined,
      faqItems: data.faqItems ? JSON.parse(data.faqItems) : undefined,
      publishedAt: data.status === "published" ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/articles");
  if (article.categoryId) {
    const cat = await prisma.category.findUnique({ where: { id: article.categoryId } });
    if (cat) revalidatePath(`/${cat.slug}`);
  }

  return article;
}

export async function updateArticle(id: number, data: Partial<Parameters<typeof createArticle>[0]>) {
  const article = await prisma.article.update({
    where: { id },
    data: {
      ...data,
      publishedAt: data.status === "published" ? new Date() : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/articles");

  return article;
}

export async function deleteArticle(id: number) {
  await prisma.article.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/articles");
}

export async function getArticleStats() {
  const [total, published, drafts] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "published" } }),
    prisma.article.count({ where: { status: "draft" } }),
  ]);
  return { total, published, drafts };
}
