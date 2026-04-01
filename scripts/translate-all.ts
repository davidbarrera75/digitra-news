// Run: npx tsx scripts/translate-all.ts
import { PrismaClient } from '@prisma/client'
import { translateArticle, translateCuratedItem, translatePulseSnapshot } from '../lib/ai/translate'

const prisma = new PrismaClient()

async function main() {
  console.log('=== Translating all content to English ===\n')

  // 1. Articles
  const articles = await prisma.article.findMany({
    where: { status: 'published', titleEn: null },
    orderBy: { publishedAt: 'desc' },
  })
  console.log(`Articles to translate: ${articles.length}`)

  for (const article of articles) {
    try {
      console.log(`  Translating article: ${article.title.substring(0, 60)}...`)
      const translated = await translateArticle(article)
      await prisma.article.update({ where: { id: article.id }, data: translated })
      console.log(`    ✓ Done → ${translated.titleEn.substring(0, 60)}`)
    } catch (err) {
      console.error(`    ✗ Error: ${err}`)
    }
  }

  // 2. Curated items
  const curated = await prisma.curatedItem.findMany({
    where: { status: 'published', titleEn: null },
    orderBy: { createdAt: 'desc' },
  })
  console.log(`\nCurated items to translate: ${curated.length}`)

  for (const item of curated) {
    try {
      console.log(`  Translating: ${item.title.substring(0, 60)}...`)
      const translated = await translateCuratedItem(item)
      await prisma.curatedItem.update({ where: { id: item.id }, data: translated })
      console.log(`    ✓ Done`)
    } catch (err) {
      console.error(`    ✗ Error: ${err}`)
    }
  }

  // 3. Latest pulse per destination
  const destinations = await prisma.destination.findMany({ where: { isActive: true } })
  console.log(`\nPulse destinations to translate: ${destinations.length}`)

  for (const dest of destinations) {
    const pulse = await prisma.pulseSnapshot.findFirst({
      where: { destinationId: dest.id, aiSummaryEn: null },
      orderBy: { date: 'desc' },
    })
    if (pulse) {
      try {
        console.log(`  Translating pulse: ${dest.name}...`)
        const translated = await translatePulseSnapshot(pulse)
        await prisma.pulseSnapshot.update({ where: { id: pulse.id }, data: translated })
        console.log(`    ✓ Done`)
      } catch (err) {
        console.error(`    ✗ Error: ${err}`)
      }
    }
  }

  console.log('\n=== Translation complete ===')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
