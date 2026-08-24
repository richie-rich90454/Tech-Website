/**
 * ============================================================================
 * CORE MODULE 10 - EJS VIEW ENGINE
 * READING ORDER: read after 04-html; this module replaces markup`` templates.
 * ============================================================================
 *
 * PURPOSE
 * Compiles every .ejs file in src/views/ at BOOT into cached render functions.
 * At request time, `render('home', { tools })` returns a finished HTML string
 * with zero disk reads and zero re-parsing.
 *
 * WHY EJS?
 * Junior developers who just learned HTML can open a .ejs file and immediately
 * see an HTML document with <%= variable %> holes. The auto-escaping means they
 * cannot accidentally create XSS bugs by forgetting to escape. This is the
 * same safety guarantee our old markup`` provided, but the authoring experience
 * is pure HTML instead of TypeScript template literals.
 *
 * LEARN: COMPILE ONCE, RENDER MANY
 * ejs.compile() parses the template text and produces a function. This parse
 * step is the expensive part (~1ms per file). By doing it once at boot for all
 * ~30 views, we pay ~30ms total at startup and then each request is just a
 * function call that concatenates strings - nanoseconds.
 */

import ejs from "ejs";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Views live beside the entry point: src/views in dev, dist/views once the
 * build has copied them. Dev prefers SOURCE so edits show up immediately;
 * production containers may not ship src/ at all, hence the fallback.
 */
const VIEWS_DIR =
    process.env.NODE_ENV === "production" ? pickDir("dist", "src") : pickDir("src", "dist");

function pickDir(first: string, second: string): string {
    const a = resolve(process.cwd(), first, "views");
    if (existsSync(a)) return a;
    const b = resolve(process.cwd(), second, "views");
    if (existsSync(b)) return b;
    return a; // let loadViews() throw the familiar "not found"
}

/** Cache of compiled template functions, keyed by filename without extension. */
const cache = new Map<string, ejs.TemplateFunction>();

/**
 * Dev convenience: when not in production, templates recompile on every
 * request so editing a .ejs file shows up on refresh (no reboot). Production
 * always uses the boot-time cache - zero disk reads per request.
 */
const HOT = process.env.NODE_ENV !== "production";

function compile(file: string): ejs.TemplateFunction {
    const templateText = readFileSync(join(VIEWS_DIR, file), "utf8");
    return ejs.compile(templateText, {
        filename: join(VIEWS_DIR, file), // enables include() partials
        escape: escapeHtml,
    });
}

/**
 * Load and compile all .ejs files from src/views/ (non-recursive).
 * Called once at boot by server.ts before listen().
 */
export function loadViews(): void {
    if (!existsSync(VIEWS_DIR)) {
        throw new Error(`Views directory not found: ${VIEWS_DIR}`);
    }
    const files = readdirSync(VIEWS_DIR).filter((f) => f.endsWith(".ejs"));
    for (const file of files) {
        cache.set(file.replace(".ejs", ""), compile(file));
    }
    console.log(JSON.stringify({ level: "info", msg: "views loaded", count: files.length }));
}

/** Escape HTML special characters (same rules as the old esc() function). */
function escapeHtml(value: unknown): string {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Per-boot cache-buster appended to css/js URLs. Asset filenames are stable
 * (globals.css, theme.js - no content hashes), so a browser that once cached
 * them with a long max-age would never see fixes. The buster changes on every
 * server start, forcing fresh fetches; combined with the no-cache policy this
 * makes staleness impossible.
 */
const BUST = Date.now().toString(36);

/**
 * Render a named view with data. Returns a safe HTML string ready for ctx.html().
 *
 * @example
 *   const html = render('home', { title: 'Tech Tools', tools });
 *   ctx.htmlRaw(html);
 */
export function render(viewName: string, data: Record<string, unknown> = {}): string {
    if (HOT) {
        const file = `${viewName}.ejs`;
        if (!existsSync(join(VIEWS_DIR, file))) {
            throw new Error(`View "${file}" not found.`);
        }
        return compile(file)({ ...data, YEN: "\u00a5", v: BUST });
    }
    const fn = cache.get(viewName);
    if (!fn) throw new Error(`View "${viewName}.ejs" not found. Did loadViews() run?`);
    // Always inject helpers available inside every .ejs template.
    return fn({ ...data, YEN: "\u00a5", v: BUST });
}

/** Check if a named view exists (used for testing / route validation). */
export function hasView(name: string): boolean {
    return cache.has(name);
}
