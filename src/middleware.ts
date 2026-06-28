import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/onboarding',
  '/forgot-password',
  '/privacy',
  '/terms',
  '/contact',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow static files and api
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next()
  }

  // Protected routes — Firebase auth is client-side, so we just allow the request
  // and let the AuthContext handle redirect on client
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
