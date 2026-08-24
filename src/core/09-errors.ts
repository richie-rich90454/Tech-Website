/**
 * ============================================================================
 * CORE MODULE 09 - ERRORS & THE ERROR BOUNDARY
 * READING ORDER: read after 03-context; this module wraps the whole pipeline.
 * ============================================================================
 *
 * PURPOSE
 * Route handlers should read like happy paths: fetch data, render, respond.
 * When anything goes wrong they simply `throw`, and ONE piece of middleware -
 * the error boundary installed by Application - turns that throw into either a
 * friendly error page or a JSON error, logs it with a correlation ID, and moves
 * on. No handler in this codebase ever writes try/catch boilerplate for HTTP
 * failures; that is the entire point of centralizing it here.
 *
 * LEARN: CORRELATION IDS
 * When something breaks in production you get an email/screen full of noise.
 * We hand the visitor a short random "ref" (e.g. "c3a91f04") shown on the error
 * page AND written into the server log. Matching visitor complaint to exact
 * stack trace becomes a one-word grep. This pattern is used unchanged at every
 * serious backend shop - learn it once, reuse it forever.
 */

import { randomBytes } from "node:crypto";
import type { Context } from "./03-context";

/** Thrown anywhere via ctx.throw(status, message). Carries an HTTP status. */
export class HttpError extends Error {
    constructor(
        public readonly status: number,
        message = "Request failed."
    ) {
        super(message);
        this.name = "HttpError";
    }
}

/** One structured log line to stdout - journald picks it up verbatim. */
export function logEvent(level: "info" | "warn" | "error", fields: Record<string, unknown>): void {
    console[level === "info" ? "log" : level](
        JSON.stringify({ level, time: new Date().toISOString(), ...fields })
    );
}

/**
 * Wrap a request pipeline so ANY throw becomes a controlled response.
 *
 * `wantsJson` lets API routes receive machine-readable errors while pages get
 * the human error view. Both branches expose the same ref id.
 */
export async function withErrorBoundary(
    ctx: Context,
    run: () => Promise<void>,
    views: { notFoundPage: string | ((url: string) => string); errorPage: (ref: string) => string }
): Promise<void> {
    try {
        await run();
    } catch (err) {
        if (ctx.res.headersSent) {
            // Body already streaming - nothing sane left but to cut the socket.
            ctx.res.destroy();
            return;
        }
        const status = err instanceof HttpError ? err.status : 500;
        const ref = randomBytes(4).toString("hex");
        const isApi = ctx.path.startsWith("/api/") || ctx.path.startsWith("/web/api/");
        if (status >= 500) {
            logEvent("error", {
                ref,
                path: ctx.path,
                method: ctx.method,
                stack: err instanceof Error ? err.stack : String(err),
            });
        } else {
            logEvent("warn", {
                ref,
                status,
                path: ctx.path,
                message: err instanceof Error ? err.message : String(err),
            });
        }
        if (isApi) {
            ctx.json(
                { error: status === 404 ? "Not found." : "Something went wrong.", ref },
                status
            );
            return;
        }
        if (status === 404) {
            const page =
                typeof views.notFoundPage === "function"
                    ? views.notFoundPage(ctx.path)
                    : views.notFoundPage;
            ctx.htmlRaw(page, 404);
            return;
        }
        // 4xx keeps its honest status; 5xx hides internals behind the ref id
        // so stack traces and SQL details never leak to visitors.
        ctx.htmlRaw(views.errorPage(ref), status >= 500 ? 500 : status);
    }
}
