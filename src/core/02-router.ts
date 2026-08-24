/**
 * ============================================================================
 * CORE MODULE 02 - ROUTER
 * READING ORDER: 04-html -> 06-cache -> 03-context -> 02-ROUTER
 * ============================================================================
 *
 * PURPOSE
 * The Router answers exactly one question, millions of times a day:
 * "For this METHOD + URL, which handler runs, and what are its :parameters?"
 *
 * HOW MATCHING WORKS (and why it is fast)
 * Two structures cooperate:
 *   1. A Map keyed by "METHOD /exact/path" - O(1) hash lookup covers every
 *      static route (the overwhelming majority of requests).
 *   2. An ordered array of dynamic patterns ("/tickets/:id") whose ':params'
 *      were compiled ONCE at registration into plain segment comparisons -
 *      no regular expressions anywhere in the request hot path.
 *
 * LEARN: REGISTRATION ORDER IS MATCH ORDER
 * Like Express, the FIRST pattern that fits wins. Register specific routes
 * before general ones. This rule is old but it is predictable, and predictable
 * beats clever at 3 AM.
 *
 * EXTEND IT
 * Need wildcard segments ("/files/*path")? Add a third segment kind in
 * compilePattern() and one branch in matches(). The two existing kinds show
 * the full pattern: compile once, compare cheaply forever.
 */

import type { Context } from "./03-context";

/** What a route handler looks like. Async because data access awaits. */
export type Handler = (ctx: Context) => Promise<void> | void;

/**
 * Per-route declarative options - the security posture lives ON the route line,
 * so a reviewer can audit every endpoint by reading the route table alone.
 */
export interface RouteOptions {
    /** Auth gate applied before the handler runs (implemented in src/routes/guards.ts). */
    guard?: "mainAdmin" | "webAdmin" | "webUser";
    /** Rate limit [maxRequests, windowMs] keyed by client IP (or API key for /web/api/external). */
    limit?: readonly [max: number, windowMs: number];
    /** Rendered-page cache key; GET-only, bust via core/06-cache on admin writes. */
    cacheKey?: string;
}

interface CompiledRoute {
    method: string;
    /** Static string segments; ':' prefixed entries capture a parameter. */
    segments: string[];
    handler: Handler;
    options: RouteOptions;
}

/** What dispatch hands to Application when a route matches. */
export interface RouteMatch {
    handler: Handler;
    options: RouteOptions;
}

export class Router {
    /** Fast lane: exact "GET /health" style lookups. */
    private readonly staticRoutes = new Map<string, CompiledRoute>();
    /** Slow lane: dynamic patterns in registration order. */
    private readonly dynamicRoutes: CompiledRoute[] = [];

    get(path: string, handler: Handler, options: RouteOptions = {}): void {
        this.register("GET", path, handler, options);
    }
    post(path: string, handler: Handler, options: RouteOptions = {}): void {
        this.register("POST", path, handler, options);
    }
    put(path: string, handler: Handler, options: RouteOptions = {}): void {
        this.register("PUT", path, handler, options);
    }
    delete(path: string, handler: Handler, options: RouteOptions = {}): void {
        this.register("DELETE", path, handler, options);
    }

    register(method: string, path: string, handler: Handler, options: RouteOptions = {}): void {
        const route: CompiledRoute = { method, segments: compilePattern(path), handler, options };
        if (route.segments.some((s) => s.startsWith(":"))) {
            this.dynamicRoutes.push(route);
        } else {
            // Normalize trailing slash so "/web/tickets" and "/web/tickets/" hit
            // the same fast-lane entry instead of silently 404ing one of them.
            this.staticRoutes.set(`${method} ${normalizePath(path)}`, route);
        }
    }

    /**
     * Find the matching route. Returns null when nothing fits (caller renders
     * the 404 view via ctx.throw(404) semantics).
     */
    match(method: string, pathname: string): RouteMatch | null {
        const staticHit = this.staticRoutes.get(`${method} ${normalizePath(pathname)}`);
        if (staticHit) return { handler: staticHit.handler, options: staticHit.options };

        const parts = pathname.split("/").filter(Boolean);
        for (const route of this.dynamicRoutes) {
            if (route.method !== method) continue;
            if (tryMatch(route.segments, parts)) {
                return { handler: route.handler, options: route.options };
            }
        }
        return null;
    }

    /**
     * Same as match() but also copies captured parameters onto ctx.params.
     * Application calls ONLY this; kept separate so tests can probe matching
     * without building a Context.
     */
    dispatch(method: string, pathname: string, ctx: Context): RouteMatch | null {
        const staticHit = this.staticRoutes.get(`${method} ${normalizePath(pathname)}`);
        if (staticHit) return { handler: staticHit.handler, options: staticHit.options };

        const parts = pathname.split("/").filter(Boolean);
        for (const route of this.dynamicRoutes) {
            if (route.method !== method) continue;
            const params = tryMatch(route.segments, parts);
            if (params) {
                Object.assign(ctx.params, params);
                return { handler: route.handler, options: route.options };
            }
        }
        return null;
    }
}

/** Compile "/web/tickets/:id" into ["web", "tickets", ":id"] once, at startup. */
function compilePattern(pattern: string): string[] {
    return pattern.split("/").filter(Boolean).map(normalizeSegment);
}

function normalizeSegment(segment: string): string {
    // Trailing-slash tolerance without regex: strip one trailing '/' if present.
    return segment.length > 1 && segment.endsWith("/") ? segment.slice(0, -1) : segment;
}

function normalizePath(path: string): string {
    const trimmed = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
    return trimmed || "/";
}

/**
 * Compare compiled pattern segments against actual path segments.
 * Returns the captured {param: value} bag on success, null on mismatch.
 */
function tryMatch(segments: string[], parts: string[]): Record<string, string> | null {
    if (segments.length !== parts.length) return null;
    const params: Record<string, string> = {};
    for (let i = 0; i < segments.length; i += 1) {
        const seg = segments[i];
        if (seg.startsWith(":")) {
            params[seg.slice(1)] = decodeURIComponent(parts[i]);
        } else if (seg !== parts[i]) {
            return null;
        }
    }
    return params;
}
