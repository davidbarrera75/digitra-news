'use client'

import { createContext, useContext } from 'react'
import { translations, type Locale } from './translations'
import { DEFAULT_LOCALE, getLocalePrefix } from './locale-config'

interface LocaleContextValue {
  locale: Locale
  t: (key: string, params?: Record<string, string | number>) => string
  prefix: string
  localePath: (path: string) => string
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  t: (key) => key,
  prefix: '',
  localePath: (path) => path,
})

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const prefix = getLocalePrefix(locale)

  function t(key: string, params?: Record<string, string | number>): string {
    let value = translations[locale]?.[key] || translations[DEFAULT_LOCALE][key] || key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v))
      }
    }
    return value
  }

  function lp(path: string): string {
    const clean = path.startsWith('/') ? path : `/${path}`
    return prefix ? `${prefix}${clean}` : clean
  }

  return (
    <LocaleContext.Provider value={{ locale, t, prefix, localePath: lp }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
