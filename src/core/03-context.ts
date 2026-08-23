/**
 * ============================================================================
 * CORE MODULE 03 - REQUEST CONTEXT
 * READING ORDER: 04-html -> 06-cache -> 03-context -> 02-router
 * ============================================================================
 *
 * PURPOSE
 * A Context ("ctx") is one visitor's single request, wrapped in a friendly,
 * fully-typed object. Every route handler receives exactly one argument - the
 * ctx - and everything it might need hangs off of it:
 *
 *   app.get('/hello/:name', async (ctx) => {
 *       const name = ctx.params.name;          // URL parameter
 *       const page  = ctx.query.get('page');   // ?page=2
 *       const form  = await ctx.body(schema);  // parsed + validated POST data
 *       ctx.html(renderSomething());
 *   });
 *
 * DESIGN NOTE FOR REVIEWERS
 * Node gives us a raw IncomingMessage/ServerResponse pair. Raw pairs are
 * error-prone (easy to forget headers, easy to double-send bodies), so we wrap
 * them once here. This is the ONLY file that touches the raw objects; every
 * other module works on Context, which keeps code testable and portable.
 *
 * LEARN: THE ONE-RESPONSE RULE
 * A HTTP response must be ended exactly once. Every send method below guards
 * with `this.finished` so calling ctx.json() twice can never corrupt a reply -
 * the second call is ignored. Defensive, cheap, and eliminates a whole bug
 * class juniors hit constantly in raw-Node code.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ZodType } from 'zod';
import { renderToString, type Html } from './04-html';
import { HttpError } from './09-errors';

/** Hard ceiling on any request body. Blocks memory-exhaustion DoS attempts. */
const MAX_BODY_BYTES = 1_000_000; // 1 MB - forms here are tiny; uploads use /api/submission's own path

export class Context {
    /** Route parameters filled in by the Router, e.g. /tickets/:id -> ctx.params.id */
    public readonly params: Record<string, string> = {};

    readonly url: URL;
    private readonly cookieBag = new Map<string, string>();
    private finished = false;
    private cachedBody: unknown;

    constructor(
        public readonly raw: IncomingMessage,
        public readonly res: ServerResponse
    ) {
        // Host comes from our own trusted proxy front (nginx); pathname+query
        // are parsed once here and reused by every accessor below.
        this.url = new URL(this.raw.url ?? '/', `http://${this.raw.headers.host ?? 'localhost'}`);
        const rawCookie = this.raw.headers.cookie;
        if (rawCookie) {
            for (const pair of rawCookie.split(';')) {
                const eq = pair.indexOf('=');
                if (eq === -1) continue;
                this.cookieBag.set(pair.slice(0, eq).trim(), safeDecode(pair.slice(eq + 1).trim()));
            }
        }
    }

    get method(): string {
        return this.raw.method ?? 'GET';
    }

    /** Pathname without query string, e.g. "/web/tickets". */
    get path(): string {
        return this.url.pathname;
    }

    /** Query parameters as a standard URLSearchParams (?a=1&b=2). */
    get query(): URLSearchParams {
        return this.url.searchParams;
    }

    /** Best-effort client IP: nginx sets X-Forwarded-For; fall back to the socket. */
    get ip(): string {
        return (
            (this.raw.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ||
            this.raw.socket.remoteAddress ||
            'unknown'
        );
    }

    cookie(name: string): string | undefined {
        return this.cookieBag.get(name);
    }

    /** Queue a Set-Cookie header. Options mirror the security posture we run site-wide. */
    setCookie(
        name: string,
        value: string,
        opts: {
            httpOnly?: boolean;
            secure?: boolean;
            sameSite?: 'Lax' | 'Strict';
            maxAge?: number;
        } = {}
    ): void {
        let c = `${name}=${value}; Path=/`;
        if (opts.httpOnly) c += '; HttpOnly';
        if (opts.secure) c += '; Secure';
        if (opts.sameSite) c += `; SameSite=${opts.sameSite}`;
        if (opts.maxAge !== undefined) c += `; Max-Age=${Math.floor(opts.maxAge)}`;
        this.res.setHeader('Set-Cookie', [...normalize(this.res.getHeader('Set-Cookie')), c]);
    }

    /**
     * Read and validate the request body ONCE (results are memoized).
     * Without a schema you get the raw object; WITH a zod schema you get typed,
     * validated data or an automatic 400 - callers never hand-write validation ifs.
     */
    async body<T>(schema?: ZodType<T>): Promise<T> {
        if (this.cachedBody !== undefined) return this.cachedBody as T;
        const chunks: Buffer[] = [];
        let size = 0;
        for await (const chunk of this.raw) {
            size += (chunk as Buffer).length;
            if (size > MAX_BODY_BYTES) throw new HttpError(413, 'Request body too large.');
            chunks.push(chunk as Buffer);
        }
        const rawText = Buffer.concat(chunks).toString('utf8');
        const contentType = String(this.raw.headers['content-type'] ?? '');
        let parsed: unknown;
        if (contentType.includes('application/json')) {
            try {
                parsed = JSON.parse(rawText || '{}');
            } catch {
                throw new HttpError(400, 'Malformed JSON body.');
            }
        } else {
            parsed = Object.fromEntries(new URLSearchParams(rawText));
        }
        if (!schema) return (this.cachedBody = parsed) as T;
        const result = schema.safeParse(parsed);
        if (!result.success) {
            throw new HttpError(400, result.error.issues[0]?.message ?? 'Validation failed.');
        }
        return (this.cachedBody = result.data) as T;
    }

    /** Convenience for classic HTML <form> posts (urlencoded fields as strings). */
    async form(): Promise<Record<string, string>> {
        return (await this.body()) as Record<string, string>;
    }

    /** Send a rendered page. Content-Type + charset are fixed for the whole site. */
    html(page: Html, status = 200): void {
        this.send(renderToString(page), status, 'text/html; charset=utf-8');
    }

    /**
     * Low-level HTML sender for infrastructure modules (the error boundary)
     * that assemble pages as plain strings. Application views should prefer
     * the typed html() above so unescaped strings cannot sneak into responses.
     */
    htmlRaw(body: string, status = 200): void {
        this.send(body, status, 'text/html; charset=utf-8');
    }

    /** Send a JSON payload (API routes). */
    json(data: unknown, status = 200): void {
        this.send(JSON.stringify(data), status, 'application/json; charset=utf-8');
    }

    /** Plain-text reply (tiny utilities, health checks). */
    text(body: string, status = 200): void {
        this.send(body, status, 'text/plain; charset=utf-8');
    }

    /**
     * Redirect. Default 307 preserves the verb exactly like the previous
     * framework did (POST-login -> dashboard stayed POST through the hop);
     * pass 303 See Other when a completed form should land on a clean GET.
     */
    redirect(location: string, status = 307): void {
        if (this.finished) return;
        this.finished = true;
        this.res.statusCode = status;
        this.res.setHeader('Location', location);
        this.res.end();
    }

    /** Throw inside handlers to short-circuit with an HTTP status. */
    throw(status: number, message?: string): never {
        throw new HttpError(status, message);
    }

    /**
     * Stage a one-shot success/info message shown after a redirect
     * (POST -> redirect -> GET reads and clears it - the classic PRG pattern).
     * Safety note: the value is escaped by html`` at render time and can only
     * ever be read back by the SAME browser that set it, so an unsigned cookie
     * is sufficient here; no server state required.
     */
    flash(message: string): void {
        this.setCookie('flash', encodeURIComponent(message), { httpOnly: true });
    }

    /** Read-and-clear the pending flash message, if any. */
    takeFlash(): string | undefined {
        const value = this.cookie('flash');
        if (value === undefined) return undefined;
        this.setCookie('flash', '', { maxAge: 0 });
        const decoded = safeDecode(value);
        return decoded.length > 0 ? decoded : undefined;
    }

    private send(text: string, status: number, contentType: string): void {
        if (this.finished) return; // one-response rule: see class docs
        this.finished = true;
        this.res.statusCode = status;
        this.res.setHeader('Content-Type', contentType);
        this.res.end(text);
    }
}

function safeDecode(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value; // malformed escape sequences stay literal instead of throwing
    }
}

function normalize(existing: number | string | string[] | undefined): string[] {
    if (!existing) return [];
    return Array.isArray(existing) ? existing : [String(existing)];
}
