import { headers } from 'next/headers'
import { LOCALES, getLocalePrefix } from './locale-config'
import { SITE_URL } from '@/lib/constants'

/**
 * Build alternates for a page.
 *
 * Pass `withLanguages: true` ONLY for pages that actually have a real
 * translation in every supported locale (e.g. articles where titleEn is
 * populated). Otherwise we'd be telling Google "/en/X is the English version
 * of /X" while serving the same Spanish content — which causes the
 * "alternate page with proper canonical tag" reports in GSC and wastes
 * crawl budget.
 */
export async function getAlternates(overridePath?: string, withLanguages: boolean = false) {
  const pathname = overridePath || await getCurrentPathname()
  return buildAlternates(pathname, withLanguages)
}

export function buildAlternates(pathname: string, withLanguages: boolean = false) {
  const cleanPath = pathname === '/' ? '' : pathname
  const canonical = `${SITE_URL}${cleanPath}`

  if (!withLanguages) {
    return { canonical, languages: {} as Record<string, string> }
  }

  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    const prefix = getLocalePrefix(locale)
    languages[locale] = `${SITE_URL}${prefix}${cleanPath}`
  }
  languages['x-default'] = `${SITE_URL}${cleanPath}`
  return { canonical, languages }
}

async function getCurrentPathname(): Promise<string> {
  const headerStore = await headers()
  return headerStore.get('x-digitra-pathname') || '/'
}
