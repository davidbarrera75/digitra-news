/**
 * Import 301 redirects in bulk.
 *
 * Usage:
 *   npx tsx scripts/import-redirects.ts <file>
 *
 * File format (one mapping per line):
 *   /old/path -> /new/path
 *   /old/path,/new/path
 *   /old/path,/new/path,302       # optional status code (default 301)
 *
 * Lines starting with # are ignored. Existing fromPath rows are updated.
 */
import { readFileSync } from "fs";
import { prisma } from "../lib/db";

type Row = { from: string; to: string; statusCode: number; notes?: string };

function parseFile(path: string): Row[] {
  const text = readFileSync(path, "utf8");
  const rows: Row[] = [];
  let lineno = 0;
  for (const raw of text.split(/\r?\n/)) {
    lineno++;
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    let from = "";
    let to = "";
    let statusCode = 301;

    if (line.includes("->")) {
      const [a, b] = line.split("->").map((s) => s.trim());
      from = a;
      to = b;
    } else if (line.includes(",")) {
      const parts = line.split(",").map((s) => s.trim());
      from = parts[0];
      to = parts[1];
      if (parts[2]) statusCode = parseInt(parts[2], 10);
    } else {
      console.warn(`[line ${lineno}] skipped (unrecognized format): ${line}`);
      continue;
    }

    if (!from || !to) {
      console.warn(`[line ${lineno}] skipped (missing from or to): ${line}`);
      continue;
    }
    if (!from.startsWith("/")) from = "/" + from;
    if (!to.startsWith("/") && !to.startsWith("http")) to = "/" + to;

    rows.push({ from, to, statusCode });
  }
  return rows;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: tsx scripts/import-redirects.ts <file>");
    process.exit(1);
  }
  const rows = parseFile(file);
  console.log(`Parsed ${rows.length} redirect mappings from ${file}`);

  let created = 0;
  let updated = 0;
  for (const row of rows) {
    const existing = await prisma.redirect.findUnique({ where: { fromPath: row.from } });
    if (existing) {
      await prisma.redirect.update({
        where: { fromPath: row.from },
        data: { toPath: row.to, statusCode: row.statusCode },
      });
      updated++;
    } else {
      await prisma.redirect.create({
        data: { fromPath: row.from, toPath: row.to, statusCode: row.statusCode },
      });
      created++;
    }
  }

  console.log(`Done. Created: ${created}, updated: ${updated}.`);
  console.log("Note: in-memory cache TTL is 5 min — new redirects take effect on the next cache refresh.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
