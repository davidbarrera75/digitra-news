export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      title: true,
      subtitle: true,
      excerpt: true,
      coverImage: true,
      coverImageAlt: true,
      publishedAt: true,
      updatedAt: true,
      category: { select: { slug: true, name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/${a.category?.slug || "noticias"}/${a.slug}`;
      const pubDate = a.publishedAt
        ? new Date(a.publishedAt).toUTCString()
        : new Date(a.updatedAt).toUTCString();
      const description = escapeXml(a.excerpt || a.subtitle || "");
      const imageTag = a.coverImage
        ? `<media:content url="${escapeXml(a.coverImage)}" medium="image" />`
        : "";

      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>${
        a.category ? `\n      <category>${escapeXml(a.category.name)}</category>` : ""
      }
      ${imageTag}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>es-CO</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
