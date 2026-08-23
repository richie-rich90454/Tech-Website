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
import { loadViews } from './src/core/views';
import { Application, pageCache } from './src/core/01-application';
import { markup, renderToString } from './src/core/04-html';
import { guards } from './src/routes/guards';
import { homeView } from './src/views/home';
import { tlView } from './src/views/tl';
import { tlConfigs } from './src/lib/tl-config';
import { searchView } from './src/views/search';
import { registerMainSiteRoutes } from './src/routes/main-site';
import { registerAdminRoutes } from './src/routes/admin';
import { webLoginView, webRegisterView } from './src/views/web-public';
import { webLandingView } from './src/views/web-landing';
import { registerWebRoutes } from './src/routes/web';
import { registerWebAdminRoutes } from './src/routes/web-admin';
import { registerPaymentRoutes } from './src/routes/payments';
import { maintenanceView } from './src/views/web-pages';
import {
    planView,
    ticketsView,
    ticketNewView,
    giftcardsView,
    affiliateView,
    wheelView,
} from './src/views/web-user';
import { mainDb } from './src/lib/db/main';
import { webDb } from './src/lib/db/web';

// ---------------------------------------------------------------------------
// Placeholder system views - replaced by real ports in Phase B (parity-gated).
// ---------------------------------------------------------------------------
const notFoundPage = renderToString(markup`
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
    renderToString(markup`
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
    isProd: env.isProd,
    // Names referenced by route options {guard:'...'} resolve here.
    guards,
});

app.get('/api/health', async (ctx) => {
    await Promise.all([mainDb.submission.count(), webDb.users.count()]);
    ctx.json({ status: 'ok', time: new Date().toISOString() });
});

// Home page: cached as finished HTML; bust via pageCache.bust(['home']) on
// admin writes (see server/queries/submissions.ts invalidateToolPages).
app.get('/', async (ctx) => {
    const cached = await pageCache.remember('home', async () => homeView());
    ctx.htmlRaw(cached);
});

registerMainSiteRoutes(app);
registerAdminRoutes(app);
registerWebRoutes(app);
registerWebAdminRoutes(app);
registerPaymentRoutes(app);
// Web public pages.
// Maintenance gate: reads settings.maintaince flag.
// Web user pages.
app.get('/web/plan', async (ctx) => {
    const plans = await webDb.plans.findMany({ orderBy: { price: 'asc' } });
    ctx.htmlRaw(planView(plans as never[]));
});
app.get('/web/tickets', async (ctx) => {
    ctx.htmlRaw(ticketsView());
});
app.get('/web/tickets/new', async (ctx) => {
    ctx.htmlRaw(ticketNewView());
});
app.get('/web/giftcards', async (ctx) => {
    ctx.htmlRaw(giftcardsView());
});
app.get('/web/affiliate', async (ctx) => {
    ctx.htmlRaw(affiliateView());
});
app.get('/web/wheel', async (ctx) => {
    ctx.htmlRaw(wheelView());
});
app.get('/web/maintenance', async (ctx) => {
    const settings = await webDb.settings.findFirst({ select: { description: true } });
    ctx.htmlRaw(maintenanceView(settings?.description ?? 'Premium IP stress testing service'));
});
app.get('/web', async (ctx) => {
    const body =
        pageCache.get('web-home') ??
        (pageCache.set('web-home', webLandingView()), pageCache.get('web-home'));
    ctx.htmlRaw(body!);
});
app.get('/web/login', async (ctx) => {
    ctx.htmlRaw(webLoginView());
});
app.get('/web/register', async (ctx) => {
    ctx.htmlRaw(webRegisterView());
});

// Search: dynamic per query - never cached (result sets are personal to input).
app.get('/search', async (ctx) => {
    const body = await searchView(ctx.query.get('query') ?? '');
    ctx.htmlRaw(body);
});
// TL listing pages: cache key includes the filter state (every combination of
// checked strands is its own shareable URL). Admin writes bust 'tl:*'.
app.get('/:tl', async (ctx) => {
    const query: Record<string, string> = {};
    ctx.query.forEach((value, key) => {
        query[key] = value;
    });
    // Cache key includes the checked/unchecked bit pattern of every strand.
    let bits = 'x';
    const config = tlConfigs[ctx.params.tl];
    if (config)
        bits = config.strands.map((s) => (query[s.checkboxName] !== '0' ? '1' : '0')).join('');
    const cacheKey = `tl:${ctx.params.tl}:${bits}`;
    let body: string | undefined = pageCache.get(cacheKey);
    if (body === undefined) {
        const rendered = await tlView({ tl: ctx.params.tl, query });
        if (rendered === null) {
            ctx.throw(404, 'Page not found.');
            return; // unreachable - throw() ends the request; kept for type flow
        }
        body = rendered;
        pageCache.set(cacheKey, body);
    }
    ctx.htmlRaw(body);
});

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
loadViews();
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
