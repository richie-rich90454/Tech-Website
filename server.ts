/**
 * ============================================================================
 * SERVER ENTRY POINT
 * ============================================================================
 *
 * PURPOSE
 * The only file whose job is "wire everything together and start listening".
 * Configuration (src/config/env.ts), the framework (src/core), and the
 * application's own routes/views (src/routes, src/views) meet here - and
 * nowhere else. If you are new to this codebase: read src/core/01-application
 * first, then come back here to see how little glue a well-factored app needs.
 *
 * BOOT SEQUENCE
 *   1. env.ts validates configuration (crashes loudly if secrets are missing)
 *   2. Application is assembled: guards, middlewares, routes
 *   3. HTTP listener starts; SIGTERM/SIGINT drain connections before exiting
 *
 * TODO(roadmap): Phase B/C replace the placeholder home/404/error views with
 * the real ported pages from the previous Next.js build (visual parity gates).
 */

import { env } from './src/config/env';
import { Application, pageCache } from './src/core/01-application';
import { html, renderToString } from './src/core/04-html';
import { mainDb } from './src/lib/db/main';
import { webDb } from './src/lib/db/web';

// ---------------------------------------------------------------------------
// Placeholder system views - replaced by real ports in Phase B (parity-gated).
// ---------------------------------------------------------------------------
const notFoundPage = renderToString(html`
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Not Found</title>
        </head>
        <body>
            <h1>404 - Page Not Found</h1>
        </body>
    </html>
`);

const errorPage = (ref: string): string =>
    renderToString(html`
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <title>Server Error</title>
            </head>
            <body>
                <h1>Something went wrong</h1>
                <p>Reference: ${ref}</p>
            </body>
        </html>
    `);

// ---------------------------------------------------------------------------
// Application assembly
// ---------------------------------------------------------------------------
const app = new Application({
    notFoundPage,
    errorPage,
    // Guards arrive with the route phases; the map keeps core storage-free.
    guards: {},
});

app.get('/api/health', async (ctx) => {
    await Promise.all([mainDb.submission.count(), webDb.users.count()]);
    ctx.json({ status: 'ok', time: new Date().toISOString() });
});

// Placeholder home so the pipeline is exercisable end-to-end in Phase A.
app.get('/', async (ctx) => {
    const cached = await pageCache.remember('home', async () =>
        renderToString(html`
            <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <title>Tech Tools</title>
                </head>
                <body>
                    <h1>Tech Tools - v3 skeleton</h1>
                </body>
            </html>
        `)
    );
    ctx.htmlRaw(cached);
});

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
async function boot(): Promise<void> {
    await app.listen(env.port);
    console.log(
        JSON.stringify({ level: 'info', msg: 'listening', port: env.port, prod: env.isProd })
    );

    const stop = async (): Promise<void> => {
        console.log(JSON.stringify({ level: 'info', msg: 'shutting down' }));
        await app.shutdown();
        process.exit(0);
    };
    process.on('SIGTERM', () => void stop());
    process.on('SIGINT', () => void stop());
}

boot().catch((err) => {
    console.error('Boot failed:', err);
    process.exit(1);
});
