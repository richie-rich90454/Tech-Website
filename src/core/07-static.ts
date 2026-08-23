/**
 * ============================================================================
 * CORE MODULE 07 - STATIC FILE SERVER
 * READING ORDER: after 03-context; no other core dependencies.
 * ============================================================================
 *
 * PURPOSE
 * Serves everything under /public (stylesheets, images, fonts, the compiled
 * ES5 JavaScript) with correct caching semantics. This is deliberately
 * boring, well-guarded code - static file servers are a classic source of
 * path-traversal CVEs ("GET /../../etc/passwd"), so every defensive line is
 * annotated below.
 *
 * PERFORMANCE NOTES (why this is fast without being clever)
 * - stat() results are memoized (bounded map): repeat requests skip disk.
 * - ETags are computed from size+mtime: identical files keep their ETag, so
 *   browsers get cheap 304 Not Modified responses instead of re-downloads.
 * - Build step pre-compresses text assets to .gz and .br siblings; this module
 *   picks one based on Accept-Encoding. Compression happens ONCE at build,
 *   never per request.
 * - Hashed build outputs (public/js/*) get `immutable` caching: visitors never
 *   re-request them until the filename changes.
 *
 * EXTEND IT
 * New file type? Add its MIME type to CONTENT_TYPES. Streaming range requests
 * (video scrubbing)? That belongs in a TODO(roadmap), not in v1 - no media here.
 */

import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import type { Context } from './03-context';

const CONTENT_TYPES: Record<string, string> = {
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.json': 'application/json',
    '.txt': 'text/plain; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
};

/** stat() memoization - cleared wholesale if it ever exceeds the cap. */
const statCache = new Map<string, { size: number; mtimeMs: number } | null>();
const STAT_CACHE_CAP = 1024;

export class StaticFiles {
    /** Absolute root every request path must resolve inside (traversal guard). */
    private readonly rootAbs: string;

    constructor(private readonly rootRelative = 'public') {
        this.rootAbs = resolve(process.cwd(), rootRelative);
    }

    /**
     * Attempt to serve a static asset. Returns false when nothing matched so
     * the router can fall through to page routes (and eventually the 404 view).
     */
    serve(ctx: Context): boolean {
        if (ctx.method !== 'GET' && ctx.method !== 'HEAD') return false;
        const urlPath = decodeURIComponent(ctx.path);
        // ---- TRAVERSAL GUARD -------------------------------------------------
        // Resolve collapses "../" BEFORE we compare against the root, so an
        // encoded backslash or dot-dot can never escape the public folder.
        const absolute = resolve(this.rootAbs, `.${urlPath}`);
        if (!absolute.startsWith(this.rootAbs + sep)) return false;
        // ----------------------------------------------------------------------

        const stat = statOf(absolute);
        if (!stat) return false;

        const etag = `"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
        ctx.res.setHeader('ETag', etag);
        const immutable = urlPath.startsWith('/js/') || urlPath.startsWith('/css/');
        ctx.res.setHeader(
            'Cache-Control',
            immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600'
        );

        if (ctx.raw.headers['if-none-match'] === etag) {
            ctx.res.statusCode = 304;
            ctx.res.end();
            return true;
        }

        const contentType = CONTENT_TYPES[extname(absolute).toLowerCase()];
        if (!contentType) return false; // unknown extension: let 404 handle it
        ctx.res.setHeader('Content-Type', contentType);

        const accept = String(ctx.raw.headers['accept-encoding'] ?? '');
        const compressed = pickPrecompressed(absolute, accept);
        if (compressed) {
            ctx.res.setHeader('Content-Encoding', compressed.encoding);
            ctx.res.setHeader('Vary', 'Accept-Encoding');
            ctx.res.setHeader('Content-Length', compressed.size);
            if (ctx.method === 'HEAD') {
                ctx.res.end();
                return true;
            }
            createReadStream(compressed.path).pipe(ctx.res);
            return true;
        }

        ctx.res.setHeader('Content-Length', stat.size);
        if (ctx.method === 'HEAD') {
            ctx.res.end();
            return true;
        }
        createReadStream(absolute).pipe(ctx.res);
        return true;
    }
}

function statOf(path: string): { size: number; mtimeMs: number } | null {
    if (statCache.has(path)) return statCache.get(path)!;
    let result: { size: number; mtimeMs: number } | null = null;
    try {
        if (existsSync(path) && statSync(path).isFile()) {
            const s = statSync(path);
            result = { size: s.size, mtimeMs: s.mtimeMs };
        }
    } catch {
        result = null; // raced delete / permission error -> treat as missing
    }
    if (statCache.size >= STAT_CACHE_CAP) statCache.clear();
    statCache.set(path, result);
    return result;
}

/**
 * Prefer Brotli (smaller), fall back to gzip, only when a pre-built sibling
 * exists AND the client advertised support. Files stay uncompressed on disk
 * for humans reading the repo; compression artifacts are build outputs.
 */
function pickPrecompressed(
    absolute: string,
    accept: string
): { path: string; size: number; encoding: string } | null {
    const wantsBr = accept.includes('br');
    const wantsGzip = accept.includes('gzip');
    if (wantsBr && existsSync(`${absolute}.br`)) {
        return { path: `${absolute}.br`, size: statSync(`${absolute}.br`).size, encoding: 'br' };
    }
    if (wantsGzip && existsSync(`${absolute}.gz`)) {
        return { path: `${absolute}.gz`, size: statSync(`${absolute}.gz`).size, encoding: 'gzip' };
    }
    return null;
}

// Exported for unit tests that assert traversal attempts are refused.
export function resolvesInsideRoot(rootAbs: string, urlPath: string): boolean {
    return resolve(rootAbs, `.${decodeURIComponent(urlPath)}`).startsWith(rootAbs + sep);
}
