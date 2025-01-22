import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If the user hasn't visited the enter page and tries to access any other page
  if (!request.cookies.has('entered') && request.nextUrl.pathname !== '/enter') {
    return NextResponse.redirect(new URL('/enter', request.url))
  }

  // If the user has already entered and tries to access the enter page
  if (request.cookies.has('entered') && request.nextUrl.pathname === '/enter') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 