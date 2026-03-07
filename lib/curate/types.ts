export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  sourceId: number;
}

export interface AISummary {
  summary: string;
  tags: string[];
  relevanceScore: number;
  suggestedCategory: string;
}

export interface CuratedItem extends RSSItem {
  aiSummary?: AISummary;
  isSelected?: boolean;
}
