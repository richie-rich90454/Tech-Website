import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { MainSession } from '@/lib/auth/main';
import { WebSession } from '@/lib/auth/web';

const mainSessionOptions = {
  password: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  cookieName: 'main-session',
};

const webSessionOptions = {
  password: process.env.SESSION_SECRET_WEB || 'web-fallback-secret-change-in-production',
  cookieName: 'web-session',
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin and /api/admin routes (main app)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const response = NextResponse.next();
    const session = await getIronSession<MainSession>(request, response, mainSessionOptions);

    if (!session.islogin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  }

  // Protect /web/dashboard and other protected web routes
  if (
    pathname.startsWith('/web/dashboard') ||
    pathname.startsWith('/web/hub') ||
    pathname.startsWith('/web/tickets') ||
    pathname.startsWith('/web/giftcards') ||
    pathname.startsWith('/web/affiliate') ||
    pathname.startsWith('/web/wheel') ||
    pathname.startsWith('/web/profile') ||
    pathname.startsWith('/web/plan') ||
    pathname.startsWith('/web/api/tickets') ||
    pathname.startsWith('/web/api/giftcards') ||
    pathname.startsWith('/web/api/affiliate') ||
    pathname.startsWith('/web/api/wheel') ||
    pathname.startsWith('/web/api/hub') ||
    pathname.startsWith('/web/api/profile') ||
    pathname.startsWith('/web/api/protected')
  ) {
    const response = NextResponse.next();
    const session = await getIronSession<WebSession>(request, response, webSessionOptions);

    if (!session.userId) {
      const loginUrl = new URL('/web/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/web/dashboard/:path*',
    '/web/hub/:path*',
    '/web/tickets/:path*',
    '/web/giftcards/:path*',
    '/web/affiliate/:path*',
    '/web/wheel/:path*',
    '/web/profile/:path*',
    '/web/plan/:path*',
    '/web/api/tickets/:path*',
    '/web/api/giftcards/:path*',
    '/web/api/affiliate/:path*',
    '/web/api/wheel/:path*',
    '/web/api/hub/:path*',
    '/web/api/profile/:path*',
    '/web/api/protected/:path*',
  ],
};