/**
 * ============================================================================
 * CORE MODULE 01 - APPLICATION
 * READING ORDER: START HERE, then 02-router -> 03-context -> 04-html -> ...
 * ============================================================================
 *
 * PURPOSE
 * Application is the conductor. It owns the Router, the global middleware
 * chain, the HTTP server itself, and the fixed order every request flows
 * through:
 *
 *   socket -> Context -> security headers -> static files? -> CSRF guard
 *          -> your app.use(...) middlewares -> route match
 *          -> {guard} -> {rate limit} -> handler -> response
 *
 * Everything above the arrow line happens identically for every request,
 * which is why this file exists: policy written ONCE cannot be forgotten
 * on ONE route (that is exactly how the old site's unauthenticated admin
 * APIs happened - each route had to REMEMBER to check auth).
 *
 * LEARN: THE MIDDLEWARE CHAIN IN NINE LINES
 * runPipeline() builds a recursive runner: middleware #1 calls next(), which
 * is "run everything after me". A middleware that never calls next() stops the
 * chain - that is how CSRF replies 403 without any special signal. Read
 * runPipeline() slowly; this pattern powers Express, Fastify, Koa and us.
 *
 * EXTEND IT
 * New cross-cutting concern (compression? request ids?) becomes a function
 * (ctx, next) => {...} registered in server.ts via app.use(...). Nothing in
 * this file needs to change - that is the extension seam working as designed.
 */

import { createServer, type Server } from 'node:http';
import { Context } from './03-context';
import { Router, type Handler, type RouteOptions } from './02-router';
import { pageCache } from './06-cache'; // re-exported for route modules' convenience
import { StaticFiles } from './07-static';
import { applySecurityHeaders, csrfOriginCheck } from './08-security';
import { rateLimit as rateLimitCheck } from '../lib/rate-limit';
import { HttpError, logEvent, withErrorBoundary } from './09-errors';

export type { Handler, RouteOptions };
export type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;

/** Requests slower than this log a warning even in production (perf sentinel). */
export const PAGE_BUDGET_MS = 250;

export type GuardFn = (ctx: Context) => Promise<void>;

/**
 * Guards live OUTSIDE core (src/routes/guards.ts) because they touch the
 * database. Application only knows their NAMES via this map - core stays
 * storage-free, which keeps it portable and unit-testable.
 */
export type GuardMap = Record<string, GuardFn>;

interface AppOptions {
    staticRoot?: string;
    guards?: GuardMap;
    notFoundPage: string | ((url: string) => string);
    errorPage: (ref: string) => string;
    /** True in production: disables dev-only headers/behaviors. Defaults from NODE_ENV. */
    isProd?: boolean;
}

export class Application {
    public readonly router = new Router();
    private readonly statics: StaticFiles;
    private readonly guards: GuardMap;
    private readonly middlewares: Middleware[] = [];
    private readonly isProd: boolean;
    private server?: Server;

    constructor(private readonly options: AppOptions) {
        this.statics = new StaticFiles(options.staticRoot ?? 'dist/public');
        this.guards = options.guards ?? {};
        this.isProd = options.isProd ?? process.env.NODE_ENV === 'production';
    }

    /** Register a global middleware (runs after CSRF, before routing). */
    use(mw: Middleware): this {
        this.middlewares.push(mw);
        return this;
    }

    get(path: string, handler: Handler, options: RouteOptions = {}): void {
        this.router.get(path, handler, options);
    }
    post(path: string, handler: Handler, options: RouteOptions = {}): void {
        this.router.post(path, handler, options);
    }
    put(path: string, handler: Handler, options: RouteOptions = {}): void {
        this.router.put(path, handler, options);
    }
    delete(path: string, handler: Handler, options: RouteOptions = {}): void {
        this.router.delete(path, handler, options);
    }

    /** Boot the HTTP listener. Resolves once bound; rejects with a readable
     *  message when binding fails (port busy, no permission) instead of
     *  leaking an unhandled 'error' event stack. */
    listen(port: number): Promise<void> {
        return new Promise((resolveListen, rejectListen) => {
            this.server = createServer((req, res) => void this.handle(req, res));
            // nginx's default idle timeout is 60s; ours MUST be higher or the
            // proxy occasionally races the socket and serves random 502s.
            this.server.keepAliveTimeout = 65_000;
            this.server.headersTimeout = 66_000;
            // One-shot: a listen failure must reject THIS promise, not crash
            // the process from a stray 'error' event after we resolved.
            const onError = (err: Error & { code?: string }): void => {
                if (err.code === 'EADDRINUSE') {
                    rejectListen(
                        new Error(
                            `Port ${port} is already in use. Stop the other process ` +
                                `(or set PORT in .env) and try again.`
                        )
                    );
                } else {
                    rejectListen(err);
                }
            };
            this.server.once('error', onError);
            this.server.listen(port, () => {
                this.server!.removeListener('error', onError);
                resolveListen();
            });
        });
    }

    /** Finish in-flight requests, then release the port (systemd stop/start). */
    async shutdown(): Promise<void> {
        if (!this.server) return;
        await new Promise<void>((done) => this.server!.close(() => done()));
    }

    /** Entry point wired to node:http. Split from listen() so tests can call it. */
    async handle(
        raw: import('node:http').IncomingMessage,
        res: import('node:http').ServerResponse
    ): Promise<void> {
        const startedAt = performance.now();
        const ctx = new Context(raw, res);
        applySecurityHeaders(ctx);

        // Dev-only response-time header. HTTP offers NO "just before headers go
        // out" hook, so this is core's single deliberate monkey-patch: wrap
        // end() to stamp elapsed time while headers are still writable. NEVER
        // setHeader inside 'finish' - headers are already on the wire there and
        // attempting it throws ERR_HTTP_HEADERS_SENT, crashing the process.
        if (!this.isProd) {
            const originalEnd = res.end.bind(res) as (...a: unknown[]) => unknown;
            (res as unknown as { end: (...a: unknown[]) => unknown }).end = (
                ...args: unknown[]
            ): unknown => {
                if (!res.headersSent) {
                    res.setHeader(
                        'X-Response-Time-Ms',
                        String(Math.round(performance.now() - startedAt))
                    );
                }
                return originalEnd(...args);
            };
        }

        // Slow-request sentinel: pure logging AFTER the response completes.
        res.on('finish', () => {
            const ms = Math.round(performance.now() - startedAt);
            if (ms > PAGE_BUDGET_MS)
                logEvent('warn', { slow: true, ms, path: ctx.path, method: ctx.method });
        });

        await withErrorBoundary(ctx, () => this.runPipeline(ctx), {
            notFoundPage: this.options.notFoundPage,
            errorPage: this.options.errorPage,
        });
    }

    /**
     * The recursive middleware runner - see the LEARN block up top.
     * Built-ins first (CSRF is non-negotiable), then developer middlewares,
     * then route dispatch as the terminal "middleware".
     */
    private async runPipeline(ctx: Context): Promise<void> {
        const chain: Middleware[] = [csrfOriginCheck, ...this.middlewares];
        let index = -1;
        const runner = async (): Promise<void> => {
            index += 1;
            if (index < chain.length) return chain[index](ctx, runner);
            await this.dispatchRoute(ctx);
        };
        await runner();
    }

    private async dispatchRoute(ctx: Context): Promise<void> {
        if (this.statics.serve(ctx)) return; // assets short-circuit everything

        const match = this.router.dispatch(ctx.method, ctx.path, ctx);
        if (!match) throw new HttpError(404, 'Page not found.');

        const { handler, options } = match;
        if (options.guard) {
            const guard = this.guards[options.guard];
            if (!guard) throw new HttpError(500, `Guard "${options.guard}" is not installed.`);
            await guard(ctx); // throws HttpError(401|403) when unauthorized
        }
        if (options.limit) {
            const [max, windowMs] = options.limit;
            if (!rateLimitCheck(`${ctx.method} ${ctx.path}:${ctx.ip}`, max, windowMs)) {
                ctx.json({ error: 'Rate limit exceeded.' }, 429);
                return;
            }
        }
        await handler(ctx);
    }
}

// Re-exported so route modules import ONE module path for shared primitives.
export { pageCache };
