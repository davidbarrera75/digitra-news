const UNSPLASH_BASE = "https://api.unsplash.com";

function getAccessKey(): string {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) throw new Error("UNSPLASH_ACCESS_KEY no configurado");
  return key;
}

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    links: { html: string };
  };
  links: {
    html: string;
  };
}

export interface PhotoResult {
  url: string;
  alt: string;
  credit: string;
  creditUrl: string;
  unsplashUrl: string;
}

/**
 * Search Unsplash for a photo matching the query.
 * Returns the best match with proper attribution.
 * Uses &w=1200 for optimized size.
 */
export async function searchPhoto(query: string): Promise<PhotoResult | null> {
  try {
    const params = new URLSearchParams({
      query,
      per_page: "1",
      orientation: "landscape",
      content_filter: "high",
    });

    const res = await fetch(`${UNSPLASH_BASE}/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${getAccessKey()}` },
    });

    if (!res.ok) {
      console.error(`[Unsplash] Search failed: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const photos: UnsplashPhoto[] = data.results || [];

    if (photos.length === 0) return null;

    const photo = photos[0];

    // Use regular size (~1080px wide) for cover images
    const url = `${photo.urls.raw}&w=1200&h=630&fit=crop&q=80`;

    // Trigger download event (required by Unsplash API guidelines)
    triggerDownload(photo.id).catch(() => {});

    return {
      url,
      alt: photo.alt_description || photo.description || query,
      credit: photo.user.name,
      creditUrl: photo.user.links.html,
      unsplashUrl: photo.links.html,
    };
  } catch (err) {
    console.error("[Unsplash] Error:", err);
    return null;
  }
}

/**
 * Trigger download event per Unsplash API guidelines.
 */
async function triggerDownload(photoId: string): Promise<void> {
  await fetch(`${UNSPLASH_BASE}/photos/${photoId}/download`, {
    headers: { Authorization: `Client-ID ${getAccessKey()}` },
  });
}

/**
 * Generate a search query from an article title.
 * Extracts city/destination name and key topic for better results.
 */
export function titleToSearchQuery(title: string): string {
  // Known Colombian cities
  const cities = [
    "cartagena", "medellin", "medellín", "bogota", "bogotá",
    "santa marta", "san andres", "san andrés", "cali",
    "barranquilla", "bucaramanga", "guatape", "guatapé",
  ];

  const lower = title.toLowerCase();
  const foundCity = cities.find((c) => lower.includes(c));

  // Key tourism topics
  const topics = [
    { pattern: /playa/i, term: "beach" },
    { pattern: /gastronom|comida|restaurante/i, term: "food" },
    { pattern: /cultura|teatro|museo/i, term: "culture" },
    { pattern: /aventura|naturaleza|senderismo/i, term: "nature adventure" },
    { pattern: /barrio|hospeda/i, term: "neighborhood street" },
    { pattern: /airbnb|alojamiento|hotel/i, term: "accommodation" },
    { pattern: /registro|normativ|legal|regulaci|decreto|sancion/i, term: "legal document signing" },
    { pattern: /precio|costo|econom/i, term: "city skyline" },
    { pattern: /tendencia/i, term: "travel" },
    { pattern: /vuelo|aero|avión|ruta.*aér|aerolínea/i, term: "airplane airport" },
    { pattern: /hotel|alojamiento|hospedaje/i, term: "hotel resort" },
    { pattern: /petróleo|energía|mercado/i, term: "business economy" },
    { pattern: /gobierno|política|ley/i, term: "government building" },
    { pattern: /turismo|viaj|turíst/i, term: "tourism travel" },
  ];

  const foundTopic = topics.find((t) => t.pattern.test(title));

  if (foundCity && foundTopic) {
    return `${foundCity} colombia ${foundTopic.term}`;
  }
  if (foundCity) {
    return `${foundCity} colombia tourism`;
  }
  if (foundTopic) {
    return `colombia ${foundTopic.term}`;
  }

  return "colombia travel tourism";
}
