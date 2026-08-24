/**
 * ============================================================================
 * CORE MODULE 08 - SECURITY MIDDLEWARE
 * READING ORDER: 02-router -> 08-security (used on every single request).
 * ============================================================================
 *
 * PURPOSE
 * Three small, independent guards installed by Application BEFORE any route
 * runs. Each one is a pure function of the request, which makes them trivial
 * to reason about - and to unit-test.
 *
 *   securityHeaders()  - adds the site's defensive HTTP headers to every reply
 *   csrfOriginCheck()  - blocks cross-site state-changing requests
 *   rateLimit()        - throttles abusive request rates per client
 *
 * LEARN: DEFENSE IN DEPTH ON THE CHEAP
 * None of these guards know about your database or your routes. They sit in
 * front of everything and cost microseconds. When a new vulnerability class
 * makes headlines, this file is usually the first place a countermeasure fits.
 */

import type { Context } from "./03-context";
import type { Middleware } from "./01-application";
import { rateLimit } from "../lib/rate-limit";

/**
 * The exact header set the previous framework served (parity constraint C1 -
 * invisible changes only). CSP notes:
 * - `script-src 'self'`: after the rewrite there is exactly ONE external JS
 *   file and ZERO inline scripts, so inline script execution is banned outright.
 * - `style-src 'unsafe-inline'`: some legacy markup uses style="" attributes;
 *   banning them would BE a visual change, which is out of scope.
 */
export function applySecurityHeaders(ctx: Context): void {
    const h = ctx.res.setHeader.bind(ctx.res);
    h("X-Content-Type-Options", "nosniff");
    h("Referrer-Policy", "strict-origin-when-cross-origin");
    h("X-Frame-Options", "DENY");
    h("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    h("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    h(
        "Content-Security-Policy",
        [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
        ].join("; ")
    );
}

/**
 * CSRF guard: browsers attach an Origin header to cross-site state-changing
 * requests. If Origin is present and names ANOTHER host, refuse.
 *
 * Requests WITHOUT Origin (curl, server-to-server webhooks like Stripe's,
 * genuinely ancient browsers) pass through by design: session cookies are
 * HttpOnly+SameSite=Lax, so a forged cross-site POST cannot carry them anyway.
 * Two independent defenses, each covering the other's blind spot.
 */
export async function csrfOriginCheck(ctx: Context, next: () => Promise<void>): Promise<void> {
    const safe = ctx.method === "GET" || ctx.method === "HEAD" || ctx.method === "OPTIONS";
    if (!safe) {
        const origin = ctx.raw.headers.origin;
        if (origin) {
            try {
                if (new URL(origin).host !== ctx.raw.headers.host) {
                    ctx.text("Cross-origin request blocked", 403);
                    return;
                }
            } catch {
                ctx.text("Invalid Origin header", 403);
                return;
            }
        }
    }
    await next();
}

/**
 * Rate-limit factory. Bucket key = "name:clientIp" (call sites that authenticate
 * an API key use a different bucket name containing the key instead).
 *
 * Returns a middleware; when the limit trips it replies 429 and STOPS the chain
 * by simply not calling next() - see how the one-response rule keeps this safe.
 */
export function limitRequests(bucketName: string, max: number, windowMs: number): Middleware {
    return async (ctx, next) => {
        if (!rateLimit(`${bucketName}:${ctx.ip}`, max, windowMs)) {
            ctx.json({ error: "Rate limit exceeded." }, 429);
            return;
        }
        await next();
    };
}
