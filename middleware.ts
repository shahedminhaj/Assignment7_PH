import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/profile', '/product'];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !sessionCookie) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/product/:path*'],
};