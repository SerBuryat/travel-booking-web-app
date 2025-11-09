import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { PAGE_ROUTES } from '@/utils/routes';

const PUBLIC_PATHS = new Set([
  PAGE_ROUTES.TELEGRAM_AUTH,
  PAGE_ROUTES.NO_AUTH,
]);

async function isTokenValid(token: string, secret: string) {
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch (error) {
    console.info('JWT verification failed in middleware:', error);
    return false;
  }
}

function redirectToNoAuth(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = PAGE_ROUTES.NO_AUTH;
  url.search = '';
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // allow static assets and explicitly public pages
  if (PUBLIC_PATHS.has(pathname) || pathname.startsWith(`${PAGE_ROUTES.TELEGRAM_AUTH}/`) || pathname.startsWith(`${PAGE_ROUTES.NO_AUTH}/`)) {
    return NextResponse.next();
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.warn('JWT_SECRET is not configured. Skipping auth middleware.');
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return redirectToNoAuth(request);
  }

  const isValid = await isTokenValid(token, jwtSecret);
  if (!isValid) {
    return redirectToNoAuth(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};