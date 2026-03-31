import { headers } from 'next/headers'
import type { Locale } from './translations'
import { translations } from './translations'
import { LOCALES, DEFAULT_LOCALE } from './locale-config'

const HEADER_NAME = 'x-digitra-locale'

export async function getServerLocale(): Promise<Locale> {
  const headerStore = await headers()
  const headerLocale = headerStore.get(HEADER_NAME) as Locale | undefined
  if (headerLocale && LOCALES.includes(headerLocale)) return headerLocale
  return DEFAULT_LOCALE
}

export async function getServerT() {
  const locale = await getServerLocale()
  return function t(key: string, params?: Record<string, string | number>): string {
    let value = translations[locale]?.[key] || translations[DEFAULT_LOCALE][key] || key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v))
      }
    }
    return value
  }
}
