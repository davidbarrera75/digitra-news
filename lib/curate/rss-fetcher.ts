import Parser from "rss-parser";
import { prisma } from "@/lib/db";
import { RSSItem } from "./types";

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "DigitraNews/1.0" },
});

export async function fetchRSSFeed(feedUrl: string, sourceName: string, sourceId: number): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    return (feed.items || []).slice(0, 20).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      description: (item.contentSnippet || item.content || "").substring(0, 500),
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source: sourceName,
      sourceId,
    }));
  } catch (err) {
    console.error(`[RSS] Error fetching ${sourceName}:`, err);
    return [];
  }
}

export async function fetchAllFeeds(): Promise<RSSItem[]> {
  const sources = await prisma.curatedSource.findMany({
    where: { isActive: true, rssFeedUrl: { not: null } },
  });

  const results = await Promise.allSettled(
    sources.map((s) => fetchRSSFeed(s.rssFeedUrl!, s.name, s.id))
  );

  const items: RSSItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    }
  }

  // Update lastFetchedAt
  await prisma.curatedSource.updateMany({
    where: { id: { in: sources.map((s) => s.id) } },
    data: { lastFetchedAt: new Date() },
  });

  // Sort by date descending
  return items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
