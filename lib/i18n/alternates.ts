import { headers } from 'next/headers'
import { LOCALES, getLocalePrefix } from './locale-config'
import { SITE_URL } from '@/lib/constants'

export async function getAlternates(overridePath?: string) {
  const pathname = overridePath || await getCurrentPathname()
  return buildAlternates(pathname)
}

export function buildAlternates(pathname: string) {
  const cleanPath = pathname === '/' ? '' : pathname
  const languages: Record<string, string> = {}
  for (const locale of LOCALES) {
    const prefix = getLocalePrefix(locale)
    languages[locale] = `${SITE_URL}${prefix}${cleanPath}`
  }
  languages['x-default'] = `${SITE_URL}${cleanPath}`
  return { canonical: `${SITE_URL}${cleanPath}`, languages }
}

async function getCurrentPathname(): Promise<string> {
  const headerStore = await headers()
  return headerStore.get('x-digitra-pathname') || '/'
}
