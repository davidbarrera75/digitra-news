import { prisma } from "@/lib/db";

type RedirectEntry = { to: string; statusCode: number };

let cache: Map<string, RedirectEntry> | null = null;
let cacheExpiry = 0;
const TTL_MS = 5 * 60 * 1000; // 5 minutes

async function loadCache(): Promise<Map<string, RedirectEntry>> {
  const all = await prisma.redirect.findMany({
    select: { fromPath: true, toPath: true, statusCode: true },
  });
  const map = new Map<string, RedirectEntry>();
  for (const r of all) {
    map.set(normalizePath(r.fromPath), { to: r.toPath, statusCode: r.statusCode });
  }
  return map;
}

function normalizePath(path: string): string {
  if (!path) return "/";
  // Strip query string and trailing slash (except root)
  const noQuery = path.split("?")[0].split("#")[0];
  if (noQuery.length > 1 && noQuery.endsWith("/")) return noQuery.slice(0, -1);
  return noQuery;
}

export async function lookupRedirect(path: string): Promise<RedirectEntry | null> {
  const now = Date.now();
  if (!cache || now > cacheExpiry) {
    try {
      cache = await loadCache();
      cacheExpiry = now + TTL_MS;
    } catch (err) {
      // On DB error, fail open: don't redirect, let the page 404 normally
      console.error("[redirects] cache load failed:", err);
      return null;
    }
  }
  return cache.get(normalizePath(path)) ?? null;
}

export function invalidateRedirectCache(): void {
  cache = null;
  cacheExpiry = 0;
}

/**
 * Best-effort hit counter. Fire-and-forget; never blocks the redirect.
 */
export function recordRedirectHit(fromPath: string): void {
  const normalized = normalizePath(fromPath);
  prisma.redirect
    .update({
      where: { fromPath: normalized },
      data: { hits: { increment: 1 }, lastHitAt: new Date() },
    })
    .catch(() => {
      // ignore — analytics best-effort
    });
}
