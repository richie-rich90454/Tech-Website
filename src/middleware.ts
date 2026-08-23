import { NextRequest, NextResponse } from 'next/server';

// CSRF defense: state-changing requests must originate from this site.
// Browsers always attach Origin on cross-site POSTs; same-site fetches/forms
// include it too. Requests without Origin (curl, payment webhooks, old
// browsers) pass through — cookie theft is separately mitigated by
// httpOnly + SameSite=Lax session cookies.
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function middleware(req: NextRequest) {
    if (SAFE_METHODS.has(req.method)) return NextResponse.next();

    const origin = req.headers.get('origin');
    if (!origin) return NextResponse.next();

    try {
        if (new URL(origin).host !== req.headers.get('host')) {
            return new NextResponse('Cross-origin request blocked', { status: 403 });
        }
    } catch {
        return new NextResponse('Invalid Origin header', { status: 403 });
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
};
