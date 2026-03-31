'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { NON_LOCALE_PATHS } from '@/lib/i18n/locale-config'

type LinkProps = ComponentProps<typeof Link>

export default function LocalizedLink({ href, ...props }: LinkProps) {
  const { prefix } = useLocale()

  let localizedHref = href
  if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
    const isNonLocale = NON_LOCALE_PATHS.some((p) => href.startsWith(p))
    if (!isNonLocale && prefix) {
      localizedHref = `${prefix}${href}`
    }
  }

  return <Link href={localizedHref} {...props} />
}
