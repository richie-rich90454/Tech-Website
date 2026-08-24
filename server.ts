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

import { env } from "./src/config/env";
import { loadViews, render } from "./src/core/views";
import { Application, pageCache } from "./src/core/01-application";
import { guards } from "./src/routes/guards";
import { tlConfigs } from "./src/lib/tl-config";
import { registerMainSiteRoutes } from "./src/routes/main-site";
import { registerAdminRoutes } from "./src/routes/admin";
import { registerWebRoutes } from "./src/routes/web";
import { registerWebAdminRoutes } from "./src/routes/web-admin";
import { registerPaymentRoutes } from "./src/routes/payments";
import { getAcceptedSubmissions, getDomainsByColumns } from "./src/server/queries/submissions";
import { mainDb } from "./src/lib/db/main";
import { webDb } from "./src/lib/db/web";

// ---------------------------------------------------------------------------
// Page data assembly - the DB/fetch part of each dynamic page, feeding render().
// ---------------------------------------------------------------------------

/** Tag-pill metadata in the fixed display order inherited from the legacy page. */
const DOM_TAGS: ReadonlyArray<{ col: string; label: string; tl: string; css: string }> = [
    { col: "R", label: "Relationships", tl: "tl1", css: "n1" },
    { col: "TP", label: "Teacher Planning", tl: "tl1", css: "n2" },
    { col: "MT", label: "Modify Teaching", tl: "tl1", css: "n3" },
    { col: "AR", label: "Achieve Readiness", tl: "tl1", css: "n4" },
    { col: "U", label: "Understanding", tl: "tl2", css: "n1" },
    { col: "MDL", label: "Multi-dimensional", tl: "tl2", css: "n2" },
    { col: "RA", label: "Reasoned Arguments", tl: "tl2", css: "n3" },
    { col: "RoTech", label: "Repertoire", tl: "tl2", css: "n4" },
    { col: "LS", label: "Learning Spaces", tl: "tl2", css: "n5" },
    { col: "RoThink", label: "Reflect on Thinking", tl: "tl3", css: "n1" },
    { col: "EoST", label: "Evidence of Learning", tl: "tl3", css: "n2" },
    { col: "EF", label: "Employ Feedback", tl: "tl3", css: "n3" },
    { col: "RTE", label: "Risk-taking", tl: "tl4", css: "n1" },
    { col: "DLoI", label: "Deepening Inquiry", tl: "tl4", css: "n2" },
    { col: "RaAoC", label: "Responsibility", tl: "tl4", css: "n3" },
];

/**
 * Tools whose legacy description rendered WITHOUT the surrounding whitespace
 * every other card has (source formatting variance in the old build). Frozen
 * from tests/baseline - do not edit by hand.
 */
const TIGHT_DESC = new Set(["tl2:14", "tl2:21", "tl3:20", "tl3:21"]);

async function searchRender(query: string): Promise<string> {
    const q = query.trim();
    const all = await getAcceptedSubmissions();
    const needle = q.toLowerCase();
    const results = q
        ? all.filter((s) =>
              [s.techname, s.tl1_desc, s.tl2_desc, s.tl3_desc, s.tl4_desc, s.displaytext].some(
                  (f) => String(f).toLowerCase().includes(needle)
              )
          )
        : [];

    const domainTags = new Map<number, Record<string, boolean>>();
    if (results.length > 0) {
        for (const d of await mainDb.domains.findMany()) {
            const { id, ...tags } = d as unknown as { id: number } & Record<string, boolean>;
            domainTags.set(id, tags);
        }
    }

    return render("search", {
        heading: q ? `Results for: ${q}` : "Search Tech Tools",
        q,
        resultCount: results.length,
        results: results.map((item) => ({
            ...item,
            activeTags: DOM_TAGS.filter((dt) => (domainTags.get(item.id) ?? {})[dt.col]),
        })),
    });
}

/** Absence or "1" means checked; explicit "0" means unchecked (legacy rule). */
async function tlRender(tl: string, query: Record<string, string>): Promise<string | null> {
    const config = tlConfigs[tl];
    if (!config) return null;

    const checked = config.strands.map((s) => query[s.checkboxName] !== "0");
    const [subs, domains] = await Promise.all([
        getAcceptedSubmissions(),
        getDomainsByColumns(config.domainColumns),
    ]);
    const domainById = new Map<number, Record<string, unknown>>(
        domains.map((d) => [d.id, d as unknown as Record<string, unknown>])
    );

    const filtered = subs
        .filter((sub) => {
            const entry = domainById.get(sub.id);
            if (!entry) return false;
            return config.strands.some(
                (strand, i) => checked[i] && entry[strand.domainColumn] === true
            );
        })
        .map((sub) => ({
            id: sub.id,
            techname: sub.techname,
            link: sub.link,
            displaytext: sub.displaytext,
            desc: (sub as unknown as Record<string, string>)[`${tl}_desc`] ?? "",
            tight: TIGHT_DESC.has(`${tl}:${sub.id}`),
            tags: Object.fromEntries(
                config.strands.map((s) => [
                    s.domainColumn,
                    (domainById.get(sub.id)?.[s.domainColumn] as boolean) === true,
                ])
            ),
        }));

    return render("tl", {
        tl,
        config,
        checked,
        filtered,
    });
}

// ---------------------------------------------------------------------------
// System views. The 404 page is "smart": tools whose names share words with
// the missed URL are suggested. Suggestions come from a snapshot of accepted
// submissions, refreshed lazily (first seconds after boot show a plain 404).
// ---------------------------------------------------------------------------
let toolIndex: Array<{ id: number; techname: string }> = [];

function refreshToolIndex(): void {
    void getAcceptedSubmissions().then((subs) => {
        toolIndex = subs.map((s) => ({ id: s.id, techname: s.techname }));
    });
}

const notFoundPage = (url: string): string => {
    const words = url
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(" ")
        .filter((w) => w.length >= 4);
    const suggestions = words
        .map((w) => toolIndex.find((t) => t.techname.toLowerCase().includes(w)))
        .filter((t): t is { id: number; techname: string } => Boolean(t))
        .slice(0, 5);
    return render("not-found", { suggestions });
};

const errorPage = (ref: string): string =>
    [
        '<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>Server Error</title></head>',
        `<body><h1>Something went wrong</h1><p>Reference: ${ref}</p></body></html>`,
    ].join("");

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

app.get("/api/health", async (ctx) => {
    await Promise.all([mainDb.submission.count(), webDb.users.count()]);
    ctx.json({ status: "ok", time: new Date().toISOString() });
});

// Home page: cached as finished HTML in production (bust via
// pageCache.bust(['home']) on admin writes). In development the cache is
// bypassed entirely so every template save is visible on refresh - this is
// what makes `npm run dev` behave like a hot-reloading bundler.
const HTML_CACHE = env.isProd;

const TL_CARDS = Object.entries(tlConfigs).map(([id, c]) => ({
    id,
    href: "/" + id,
    title: c.title,
    strands: c.strands.map((s) => s.label),
}));
app.get("/", async (ctx) => {
    const cached = HTML_CACHE
        ? await pageCache.remember("home", async () => render("home", { cards: TL_CARDS }))
        : render("home", { cards: TL_CARDS });
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
app.get("/web/plan", async (ctx) => {
    const plans = await webDb.plans.findMany({ orderBy: { price: "asc" } });
    ctx.htmlRaw(render("web-plan", { plans }));
});
app.get("/web/tickets", async (ctx) => {
    ctx.htmlRaw(render("web-tickets", {}));
});
app.get("/web/tickets/new", async (ctx) => {
    ctx.htmlRaw(render("web-tickets-new", {}));
});
app.get("/web/giftcards", async (ctx) => {
    ctx.htmlRaw(render("web-giftcards", {}));
});
app.get("/web/affiliate", async (ctx) => {
    ctx.htmlRaw(render("web-affiliate", {}));
});
app.get("/web/wheel", async (ctx) => {
    ctx.htmlRaw(render("web-wheel", {}));
});
app.get("/web/maintenance", async (ctx) => {
    const settings = await webDb.settings.findFirst({ select: { description: true } });
    ctx.htmlRaw(
        render("web-maintenance", {
            description: settings?.description ?? "Premium IP stress testing service",
        })
    );
});
app.get("/web", async (ctx) => {
    const body = HTML_CACHE
        ? (pageCache.get("web-home") ??
          (pageCache.set("web-home", render("web-landing", {})), pageCache.get("web-home")))
        : render("web-landing", {});
    ctx.htmlRaw(body!);
});
app.get("/web/login", async (ctx) => {
    ctx.htmlRaw(render("web-login", {}));
});
app.get("/web/register", async (ctx) => {
    ctx.htmlRaw(render("web-register", {}));
});

// Tool detail page: every TL strategy description for one tool, stacked.
app.get("/docs", async (ctx) => {
    ctx.htmlRaw(render("docs", {}));
});
app.get("/tool/:id", async (ctx) => {
    const id = Number(ctx.params.id);
    if (!Number.isFinite(id)) ctx.throw(404, "Not found");
    const [subs, domains] = await Promise.all([
        getAcceptedSubmissions(),
        getDomainsByColumns(DOM_TAGS.map((t) => t.col)),
    ]);
    const tool = subs.find((s) => s.id === id);
    if (!tool) {
        ctx.throw(404, "Tool not found.");
        return;
    }
    const flags = (domains.find((d) => d.id === id) ?? {}) as unknown as Record<string, boolean>;
    const strands = DOM_TAGS.filter((t) => flags[t.col]);
    refreshToolIndex();
    ctx.htmlRaw(render("tool", { tool, strands }));
});

// Search: dynamic per query - never cached (result sets are personal to input).
app.get("/search", async (ctx) => {
    const q = ctx.query.get("query") ?? "";
    ctx.htmlRaw(await searchRender(q));
});
// TL listing pages: cache key includes the filter state (every combination of
// checked strands is its own shareable URL). Admin writes bust 'tl:*'.
app.get("/:tl", async (ctx) => {
    const query: Record<string, string> = {};
    ctx.query.forEach((value, key) => {
        query[key] = value;
    });
    // Cache key includes the checked/unchecked bit pattern of every strand.
    let bits = "x";
    const config = tlConfigs[ctx.params.tl];
    if (config)
        bits = config.strands.map((s) => (query[s.checkboxName] !== "0" ? "1" : "0")).join("");
    const cacheKey = `tl:${ctx.params.tl}:${bits}`;
    let body: string | undefined = HTML_CACHE ? pageCache.get(cacheKey) : undefined;
    if (body === undefined) {
        const rendered = await tlRender(ctx.params.tl, query);
        if (rendered === null) {
            ctx.throw(404, "Page not found.");
            return; // unreachable - throw() ends the request; kept for type flow
        }
        body = rendered;
        if (HTML_CACHE) pageCache.set(cacheKey, body);
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
        JSON.stringify({ level: "info", msg: "listening", port: env.port, prod: env.isProd })
    );

    const stop = async (): Promise<void> => {
        console.log(JSON.stringify({ level: "info", msg: "shutting down" }));
        await app.shutdown();
        process.exit(0);
    };
    process.on("SIGTERM", () => void stop());
    process.on("SIGINT", () => void stop());
}

boot().catch((err: Error) => {
    // Listen failures (port busy) arrive here with a human-readable message.
    console.error(JSON.stringify({ level: "error", msg: "boot failed", reason: err.message }));
    process.exit(1);
});
refreshToolIndex();
