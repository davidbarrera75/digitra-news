import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { extractLocaleFromPath, NON_LOCALE_PATHS, DEFAULT_LOCALE } from '@/lib/i18n/locale-config'

function isNonLocalePath(pathname: string): boolean {
  return NON_LOCALE_PATHS.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // --- Locale prefix detection ---
  const { locale: urlLocale, strippedPath } = extractLocaleFromPath(pathname)
  const hasLocalePrefix = urlLocale !== DEFAULT_LOCALE

  // If locale prefix on non-public path, redirect without prefix
  if (hasLocalePrefix && isNonLocalePath(strippedPath)) {
    const url = request.nextUrl.clone()
    url.pathname = strippedPath
    return NextResponse.redirect(url)
  }

  // --- Admin auth protection (on stripped path) ---
  const checkPath = hasLocalePrefix ? strippedPath : pathname
  if (checkPath.startsWith('/admin') && !checkPath.startsWith('/admin/login')) {
    const token = await getToken({ req: request })
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // --- Locale-prefixed public pages: rewrite ---
  if (hasLocalePrefix) {
    const url = request.nextUrl.clone()
    url.pathname = strippedPath
    const response = NextResponse.rewrite(url)
    response.headers.set('x-digitra-locale', urlLocale)
    response.headers.set('x-digitra-pathname', strippedPath)
    return response
  }

  // --- No prefix: default Spanish ---
  const response = NextResponse.next()
  response.headers.set('x-digitra-locale', DEFAULT_LOCALE)
  response.headers.set('x-digitra-pathname', pathname)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|xml|ico)$).*)',
  ],
}
