// Centralized auth middleware for both apps.
// Protects:
//   - /admin, /api/admin     (main app, main session)
//   - /web/dashboard, hub, profile, tickets, affiliate, giftcards, wheel, plan
//                            (/web app, web session)
//   - /web/admin/*, /web/api/admin/*
//                            (/web app, web session with rank >= 1)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import type { MainSession } from '@/types/session';
import type { WebSession } from '@/types/session';

const mainSessionOptions = {
  password: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  cookieName: 'main-session',
};

const webSessionOptions = {
  password: process.env.SESSION_SECRET_WEB || 'web-fallback-secret-change-in-production',
  cookieName: 'web-session',
};

function redirectToLogin(req: NextRequest, target: string): NextResponse {
  const url = new URL(target, req.url);
  if (!url.searchParams.has('redirect')) {
    url.searchParams.set('redirect', req.nextUrl.pathname);
  }
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Main app admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const response = NextResponse.next();
    const session = await getIronSession<MainSession>(request, response, mainSessionOptions);
    if (!session.islogin) {
      return redirectToLogin(request, '/login');
    }
    return response;
  }

  // /web admin — admin rank required
  if (pathname.startsWith('/web/admin') || pathname.startsWith('/web/api/admin')) {
    const response = NextResponse.next();
    const session = await getIronSession<WebSession>(request, response, webSessionOptions);
    if (!session.userId) {
      return redirectToLogin(request, '/web/login');
    }
    if ((session.rank ?? 0) < 1) {
      return NextResponse.redirect(new URL('/web/dashboard', request.url));
    }
    return response;
  }

  // /web authenticated user routes
  const webUserRoute =
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
    pathname.startsWith('/web/api/profile');

  if (webUserRoute) {
    const response = NextResponse.next();
    const session = await getIronSession<WebSession>(request, response, webSessionOptions);
    if (!session.userId) {
      return redirectToLogin(request, '/web/login');
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/web/admin/:path*',
    '/web/api/admin/:path*',
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
  ],
};
