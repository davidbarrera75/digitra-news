import { marked } from "marked";

interface ParsedArticle {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  seoKeyword: string;
  keywords: string[];
  excerpt: string;
  content: string;
  faqItems: { question: string; answer: string }[];
  readingTime: number;
}

/**
 * Parses a markdown article file with SEO metadata in HTML comments.
 *
 * Expected format:
 * # Title
 * <!-- SEO META -->
 * <!-- Title tag sugerido: ... -->
 * <!-- Meta description (N chars): ... -->
 * <!-- Slug: ... -->
 * <!-- Keywords primarios: ... -->
 * <!-- Keywords secundarios: ... -->
 * ---
 * Content in markdown...
 * ## Preguntas frecuentes
 * **Question?**
 * Answer text...
 */
export function parseMdArticle(markdown: string): ParsedArticle {
  // Check for YAML frontmatter (starts with ---)
  const frontmatter = extractFrontmatter(markdown);
  let bodyAfterFrontmatter = markdown;

  if (frontmatter) {
    // Remove the entire frontmatter block from content
    bodyAfterFrontmatter = markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
  }

  const lines = bodyAfterFrontmatter.split("\n");

  // Extract title from frontmatter or first H1
  let title = (frontmatter?.title as string) || "";
  if (!title) {
    for (const line of lines) {
      if (line.startsWith("# ")) {
        title = line.replace(/^#\s+/, "").trim();
        break;
      }
    }
  }

  // Extract SEO metadata from frontmatter first, then fall back to HTML comments
  const metaTitle =
    (frontmatter?.og_title as string) ||
    (frontmatter?.title as string) ||
    extractComment(markdown, "Title tag sugerido") ||
    title;
  const metaDescription =
    (frontmatter?.description as string) ||
    (frontmatter?.og_description as string) ||
    extractComment(markdown, "Meta description");
  const slug =
    (frontmatter?.slug as string) ||
    extractComment(markdown, "Slug") ||
    slugify(title);
  const primaryKeywords = extractComment(markdown, "Keywords primarios");
  const secondaryKeywords = extractComment(markdown, "Keywords secundarios");

  // Combine keywords from frontmatter tags or HTML comments
  let keywords: string[] = [];
  if (frontmatter?.tags && Array.isArray(frontmatter.tags)) {
    keywords = frontmatter.tags;
  } else {
    keywords = [
      ...splitKeywords(primaryKeywords),
      ...splitKeywords(secondaryKeywords),
    ];
  }

  // Get the first SEO keyword
  const seoKeyword = keywords[0] || splitKeywords(primaryKeywords)[0] || "";

  // Extract FAQ items
  const faqItems = extractFaq(bodyAfterFrontmatter);

  // Remove the H1, SEO comments, and first separator to get body content
  let bodyMd = bodyAfterFrontmatter;
  // Remove H1 line
  bodyMd = bodyMd.replace(/^#\s+.+\n/, "");
  // Remove all HTML comments
  bodyMd = bodyMd.replace(/<!--[\s\S]*?-->\n?/g, "");
  // Remove leading separator
  bodyMd = bodyMd.replace(/^\s*---\s*\n/, "");

  // Convert markdown to HTML
  const content = marked.parse(bodyMd, { async: false }) as string;

  // Generate excerpt from first paragraph
  const excerpt = extractExcerpt(bodyMd);

  // Estimate reading time (200 words per minute)
  const wordCount = bodyMd.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    title,
    slug,
    metaTitle,
    metaDescription,
    seoKeyword,
    keywords,
    excerpt,
    content,
    faqItems,
    readingTime,
  };
}

function extractComment(text: string, prefix: string): string {
  // Match <!-- Prefix: value --> or <!-- Prefix (anything): value -->
  const regex = new RegExp(`<!--\\s*${prefix}[^:]*:\\s*(.+?)\\s*-->`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function splitKeywords(text: string): string[] {
  if (!text) return [];
  return text
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

function extractFaq(markdown: string): { question: string; answer: string }[] {
  const faqItems: { question: string; answer: string }[] = [];

  // Find the FAQ section
  const faqMatch = markdown.match(
    /##\s*Preguntas\s+frecuentes\s*\n([\s\S]*?)(?=\n##\s[^#]|\n---\s*$|$)/i
  );
  if (!faqMatch) return faqItems;

  const faqSection = faqMatch[1];
  // Match **Question?**\nAnswer pattern
  const qaRegex = /\*\*(.+?\?)\*\*\s*\n([\s\S]*?)(?=\n\*\*|$)/g;
  let match;
  while ((match = qaRegex.exec(faqSection)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();
    if (question && answer) {
      faqItems.push({ question, answer });
    }
  }

  return faqItems;
}

function extractExcerpt(markdown: string): string {
  // Get first real paragraph (skip headings, separators, empty lines)
  const lines = markdown.split("\n");
  let paragraph = "";
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed === "---" ||
      trimmed.startsWith("<!--")
    ) {
      continue;
    }
    paragraph = trimmed;
    break;
  }

  // Strip markdown formatting
  paragraph = paragraph
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`(.+?)`/g, "$1");

  return paragraph.substring(0, 500);
}

function extractFrontmatter(
  markdown: string
): Record<string, string | string[]> | null {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const yaml = match[1];
  const data: Record<string, string | string[]> = {};

  for (const line of yaml.split("\n")) {
    // Skip array items (handled below) and empty lines
    if (line.startsWith("  -") || line.startsWith("- ") || !line.trim())
      continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.substring(0, colonIdx).trim();
    let value = line.substring(colonIdx + 1).trim();

    // Remove surrounding quotes
    value = value.replace(/^["'](.*)["']$/, "$1");

    data[key] = value;
  }

  // Parse tags array: tags: ["a", "b", "c"]
  const tagsMatch = yaml.match(/tags:\s*\[([\s\S]*?)\]/);
  if (tagsMatch) {
    data.tags = tagsMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  return Object.keys(data).length > 0 ? data : null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 250);
}
