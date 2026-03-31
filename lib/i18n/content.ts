import type { Locale } from './translations'

/**
 * Pick the translated field if available for the given locale, otherwise fallback to Spanish.
 * Usage: localized(article, 'title', locale) → article.titleEn || article.title
 */
export function localized(
  record: Record<string, unknown>,
  field: string,
  locale: Locale
): string {
  if (locale === 'es') return String(record[field] ?? '')
  const enField = `${field}En`
  return String(record[enField] ?? record[field] ?? '')
}

/**
 * Get date-fns locale for formatting dates
 */
export function getDateLocale(locale: Locale) {
  if (locale === 'en') return undefined // date-fns defaults to English
  // For Spanish, import dynamically
  return undefined // Caller should handle: import { es } from 'date-fns/locale'
}

/**
 * Format date string based on locale
 */
export function formatDateByLocale(date: Date, locale: Locale): string {
  if (locale === 'en') {
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}
