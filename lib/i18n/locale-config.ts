import type { Locale } from './translations'

export const LOCALES: Locale[] = ['es', 'en']
export const DEFAULT_LOCALE: Locale = 'es'

export const NON_LOCALE_PATHS = [
  '/api/',
  '/admin',
  '/feed.xml',
  '/newsletter',
  '/_next/',
  '/favicon.ico',
]

export function getLocalePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`
}

export function localePath(path: string, locale: Locale): string {
  const prefix = getLocalePrefix(locale)
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${prefix}${cleanPath}`
}

export function extractLocaleFromPath(pathname: string): { locale: Locale; strippedPath: string } {
  const match = pathname.match(/^\/(en)(\/|$)(.*)/)
  if (match) {
    const locale = match[1] as Locale
    const rest = match[3] ? `/${match[3]}` : '/'
    return { locale, strippedPath: rest }
  }
  return { locale: DEFAULT_LOCALE, strippedPath: pathname }
}
