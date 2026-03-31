'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { extractLocaleFromPath, getLocalePrefix } from '@/lib/i18n/locale-config'
import type { Locale } from '@/lib/i18n/translations'

const options: { code: Locale; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
]

export default function LocaleSelector() {
  const pathname = usePathname()
  const router = useRouter()
  const { locale: current } = useLocale()

  function switchLocale(newLocale: Locale) {
    if (newLocale === current) return
    const { strippedPath } = extractLocaleFromPath(pathname)
    const prefix = getLocalePrefix(newLocale)
    const target = prefix
      ? `${prefix}${strippedPath === '/' ? '' : strippedPath}` || `${prefix}`
      : strippedPath || '/'
    router.push(target)
  }

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-full px-1 py-0.5">
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => switchLocale(opt.code)}
          className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all ${
            current === opt.code
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
