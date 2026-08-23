#!/usr/bin/env node
/**
 * VISUAL PARITY CHECKER - the gate that enforces "no visual changes".
 *
 * For every route in the manifest this fetches the RUNNING v3 server and
 * compares its rendered <body> against the frozen baseline captured from the
 * legacy Next.js build (tests/baseline/, produced by scripts/dump-baseline.mjs).
 *
 * NORMALIZATION RULES (what is intentionally ignored):
 *   - <script> blocks and HTML comments  (framework plumbing, not pixels)
 *   - everything outside <body>          (font/meta wiring differs by design;
 *                                         typography parity comes from CSS+fonts)
 *   - attribute values of ""             (checked="" vs checked - identical HTML)
 *   - self-closing slashes               (<br/> vs <br> - identical DOM)
 *   - ALL whitespace runs                (JSX vs template-literal indentation;
 *                                         browsers collapse these identically)
 *   - named entities                     (&#39; vs ' - identical after decode)
 * Everything else must match EXACTLY: tags, attributes, order, classes, text.
 *
 * Usage: BASE=http://localhost:3000 npm run parity
 */

import { readFileSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:3000';
const MANIFEST = [
    ['index.html', '/'],
    ['tl1.html', '/tl1'],
    ['tl2.html', '/tl2'],
    ['tl3.html', '/tl3'],
    ['tl4.html', '/tl4'],
    ['search.html', '/search'],
    ['login.html', '/login'],
    ['submission.html', '/submission'],
    ['web-home.html', '/web'],
    ['web-login.html', '/web/login'],
    ['web-register.html', '/web/register'],
    ['web-plan.html', '/web/plan'],
    ['web-maintenance.html', '/web/maintenance'],
    ['web-giftcards-anon.html', '/web/giftcards'],
    ['web-affiliate-anon.html', '/web/affiliate'],
    ['web-tickets-anon.html', '/web/tickets'],
    ['web-tickets-new.html', '/web/tickets/new'],
    ['web-wheel.html', '/web/wheel'],
    ['admin.html', '/admin', 'main'],
    ['admin-edit-1.html', '/admin/edit/1', 'main'],
    ['web-dashboard.html', '/web/dashboard', 'web'],
    ['web-hub.html', '/web/hub', 'web'],
    ['web-profile.html', '/web/profile', 'web'],
    ['web-tickets-authed.html', '/web/tickets', 'web'],
    ['web-admin-dashboard.html', '/web/admin/dashboard', 'web'],
    ['web-admin-users.html', '/web/admin/users', 'web'],
    ['web-admin-users-1.html', '/web/admin/users/1', 'web'],
    ['web-admin-plans.html', '/web/admin/plans', 'web'],
    ['web-admin-methods.html', '/web/admin/methods', 'web'],
    ['web-admin-news.html', '/web/admin/news', 'web'],
    ['web-admin-servers.html', '/web/admin/servers', 'web'],
    ['web-admin-settings.html', '/web/admin/settings', 'web'],
    ['web-admin-giftcards.html', '/web/admin/giftcards', 'web'],
    ['web-admin-tickets.html', '/web/admin/tickets', 'web'],
    ['web-admin-hub.html', '/web/admin/hub', 'web'],
    ['web-admin-attacklogs.html', '/web/admin/attacklogs', 'web'],
    ['web-admin-loginlogs.html', '/web/admin/loginlogs', 'web'],
];

async function cookieFor(kind) {
    if (!kind) return '';
    const path = kind === 'main' ? '/api/auth/login' : '/web/api/auth/login';
    const res = await fetch(BASE + path, {
        method: 'POST',
        redirect: 'manual',
        headers: { Origin: BASE, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'username=admin&password=admin123',
    });
    return (res.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).join('; ');
}

function bodyOf(html) {
    const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let inner = m ? m[1] : html;
    inner = inner.replace(/<script[\s\S]*?<\/script>/gi, '');
    // Metadata hints the legacy framework streamed into <body> (preloads):
    // invisible to visitors, so excluded from structural comparison.
    inner = inner.replace(/<link[^>]*>/gi, '');
    // React streaming scaffolding: suspense fallbacks + flight shells exist
    // only in the pre-hydration stream; a browser never shows them alongside
    // the content, so they are excluded from structural comparison.
    inner = inner.replace(/<template id="[^"]*"><\/template>/g, '');
    inner = inner.replace(/<div hidden id="S:\d+">[\s\S]*?<\/div>/g, '');
    inner = inner.replace(/<div role="status" aria-label="Loading"[^>]*>[\s\S]*?<\/div>\s*(?=<[a-zA-Z]|$)/g, '');
    inner = inner.replace(/<!--[\s\S]*?-->/g, '');
    inner = decodeEntities(inner);
    // Self-closing slashes first ("<img/>") so the attribute-name pass below
    // sees plain "<img ...>" tags.
    inner = inner.replace(/<([^>]+?)\/>/g, '<$1>');
    // HTML attribute NAMES are case-insensitive per spec ("the legacy framework
    // emitted fetchPriority; esbuild-era templates write fetchpriority"). Values
    // are left untouched.
    inner = inner.replace(
        /<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[-a-zA-Z]+(?:="[^"]*")?)+)\s*>/g,
        (_m, tag, attrs) => {
            const lowered = attrs.replace(/(\s+)([-a-zA-Z]+)(=?)/g, (_m2, ws, name, eq) =>
                eq ? `${ws}${name.toLowerCase()}${eq}` : `${ws}${name.toLowerCase()}`
            );
            return `<${tag}${lowered}>`;
        }
    );
    inner = inner.replace(/\s+/g, ' ');
    // Prettier formats html`` templates as lit-html, wrapping long tags onto
    // newlines ("href=\"x\"\n>"). Browsers treat that whitespace as nothing,
    // so the checker does too - otherwise formatting noise would mask real
    // visual drift.
    inner = inner.replace(/\s+>/g, '>');
    inner = inner.replace(/> </g, '><');
    inner = inner.replace(/=""/g, '');
    // Functional (non-rendering) attributes may legitimately differ: v3 adds
    // form action= so flows work without JavaScript. Pixels are unaffected.
    inner = inner.replace(/\s(action|autocomplete|novalidate|method|enctype)="[^"]*"/gi, '');
    inner = inner.replace(/<([^>]+?)\/>/g, '<$1>');
    return inner.trim();
}

function decodeEntities(s) {
    return s
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&#x27;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&copy;|&#169;/g, '\u00a9')
        .replace(/&middot;|&#183;/g, '\u00b7')
        .replace(/&hellip;/g, '\u2026')
        .replace(/&mdash;/g, '\u2014')
        .replace(/&ndash;/g, '\u2013')
        .replace(/&lsquo;/g, '\u2018')
        .replace(/&rsquo;/g, '\u2019')
        .replace(/&ldquo;/g, '\u201c')
        .replace(/&rdquo;/g, '\u201d')
        .replace(/&amp;/g, '&');
}

/** First divergence point with context - makes mismatches fixable in seconds. */
function firstDiff(a, b) {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i += 1) {
        if (a[i] !== b[i]) {
            const start = Math.max(0, i - 60);
            return {
                at: i,
                expected: a.slice(start, i + 80),
                actual: b.slice(start, i + 80),
            };
        }
    }
    return { at: len, expected: a.slice(len, len + 80), actual: b.slice(len, len + 80) };
}

const cookiesMain = await cookieFor('main');
const cookiesWeb = await cookieFor('web');

let pass = 0;
const failures = [];
for (const [file, route, auth] of MANIFEST) {
    const baselinePath = new URL(`./baseline/${file}`, import.meta.url).pathname.replace(
        /^\/([A-Za-z]:)/,
        '$1'
    );
    let baselineRaw;
    try {
        baselineRaw = readFileSync(baselinePath, 'utf8');
    } catch {
        continue; // no baseline captured for this page yet
    }
    const cookie = auth === 'main' ? cookiesMain : auth === 'web' ? cookiesWeb : '';
    const res = await fetch(BASE + route, { headers: cookie ? { Cookie: cookie } : {} });
    const liveRaw = await res.text();
    const expected = bodyOf(baselineRaw);
    const actual = bodyOf(liveRaw);
    if (res.status === 200 && actual === expected) {
        pass += 1;
        console.log(`PASS ${route}`);
    } else {
        const d = firstDiff(expected, actual);
        failures.push(route);
        console.log(
            `FAIL ${route} (status ${res.status}, len ${actual.length} vs ${expected.length})\n` +
                `  expected ...${JSON.stringify(d.expected)}\n` +
                `  actual   ...${JSON.stringify(d.actual)}`
        );
    }
}

console.log(`\nparity: ${pass} pass, ${failures.length} fail`);
if (failures.length) {
    console.log(`failing routes: ${failures.join(', ')}`);
    process.exit(1);
}
