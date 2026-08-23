/**
 * ============================================================================
 * SEARCH PAGE - /search?query=...
 * ============================================================================
 *
 * BEHAVIOR NOTES
 * The legacy build searched with client-side Fuse.js fuzzy matching. v3 does
 * the lookup SERVER-SIDE: a case-insensitive substring pass over name, the
 * four TL descriptions and the display text. Same inputs as before, but now
 * every result set is a shareable URL that works without JavaScript at all.
 *
 * Tag pills deep-link into the matching TL page anchor; only five show, with
 * an "and N more..." overflow - identical presentation to the original.
 */

import { markup, unsafe, type Html } from '../core/04-html';
import { shell } from './shell';
import { getAcceptedSubmissions } from '../server/queries/submissions';
import { mainDb } from '../lib/db/main';

/** Reusable empty fragment so ternaries stay type-clean (Html, not string). */
const EMPTY: Html = unsafe('');

interface SearchItem {
    id: number;
    techname: string;
    tl1_desc: string;
    tl2_desc: string;
    tl3_desc: string;
    tl4_desc: string;
    link: string;
    displaytext: string;
}

/** Pill metadata in the fixed display order inherited from the legacy page. */
const DOM_TAGS: ReadonlyArray<{ col: string; label: string; tl: string; css: string }> = [
    { col: 'R', label: 'Relationships', tl: 'tl1', css: 'n1' },
    { col: 'TP', label: 'Teacher Planning', tl: 'tl1', css: 'n2' },
    { col: 'MT', label: 'Modify Teaching', tl: 'tl1', css: 'n3' },
    { col: 'AR', label: 'Achieve Readiness', tl: 'tl1', css: 'n4' },
    { col: 'U', label: 'Understanding', tl: 'tl2', css: 'n1' },
    { col: 'MDL', label: 'Multi-dimensional', tl: 'tl2', css: 'n2' },
    { col: 'RA', label: 'Reasoned Arguments', tl: 'tl2', css: 'n3' },
    { col: 'RoTech', label: 'Repertoire', tl: 'tl2', css: 'n4' },
    { col: 'LS', label: 'Learning Spaces', tl: 'tl2', css: 'n5' },
    { col: 'RoThink', label: 'Reflect on Thinking', tl: 'tl3', css: 'n1' },
    { col: 'EoST', label: 'Evidence of Learning', tl: 'tl3', css: 'n2' },
    { col: 'EF', label: 'Employ Feedback', tl: 'tl3', css: 'n3' },
    { col: 'RTE', label: 'Risk-taking', tl: 'tl4', css: 'n1' },
    { col: 'DLoI', label: 'Deepening Inquiry', tl: 'tl4', css: 'n2' },
    { col: 'RaAoC', label: 'Responsibility', tl: 'tl4', css: 'n3' },
];

async function searchTools(query: string): Promise<SearchItem[]> {
    const all = await getAcceptedSubmissions();
    if (!query) return [];
    const needle = query.toLowerCase();
    // 23 rows: an in-memory substring pass beats any query machinery.
    return all.filter((s) =>
        [s.techname, s.tl1_desc, s.tl2_desc, s.tl3_desc, s.tl4_desc, s.displaytext].some((f) =>
            f.toLowerCase().includes(needle)
        )
    );
}

function navbar(): Html {
    const links = [
        ['/#front', 'Home'],
        ['/tl1', 'Knowing (TL1)'],
        ['/tl2', 'Strategies (TL2)'],
        ['/tl3', 'Evidence (TL3)'],
        ['/tl4', 'Crafting (TL4)'],
        ['/search', 'Search'],
    ];
    return markup`<div id="cover"><div id="topbar"><h1>BIBS·C Tech Tools</h1></div><nav id="navbar" aria-label="Primary"><ul id="nav">${links.map(
        ([href, label]) =>
            markup`<li><a href="${href}"><span>${label}</span><span class="nav-underline" aria-hidden="true"></span></a></li>`
    )}</ul></nav></div>`;
}

function footer(): Html {
    return markup`<footer id="footer" data-built-by="richie-rich90454"><p id="footer-nav"><a href="/tl1">Knowing (TL1)</a> · <a href="/tl2">Strategies (TL2)</a> · <a href="/tl3">Evidence (TL3)</a> · <a href="/tl4">Crafting (TL4)</a> · <a href="/search">Search</a></p><p id="footer-copy"><b>&copy; 2026 BIBS&middot;C Tech Tips</b></p></footer>`;
}

function descPara(label: string, text: string): Html {
    if (!text) return EMPTY;
    return markup`<p><b>${label}:</b> ${text}</p>`;
}

function resultCard(
    item: SearchItem,
    activeTags: ReadonlyArray<{ col: string; label: string; tl: string; css: string }>
): Html {
    const display = activeTags.slice(0, 5);
    const hidden = activeTags.slice(5);
    return markup`<div class="techtip" id="tool-${item.id}"><div class="line" id="line-${item.id}"></div><h3 class="name">${item.techname}</h3><div class="tags">${display.map(
        (t) => markup`<a href="/${t.tl}#${t.col}"><span class="${t.css}">${t.label}</span></a>`
    )}${hidden.length > 0 ? markup`<span class="tags-more">and ${hidden.length} more&hellip;</span>` : EMPTY}</div><div class="info"><div class="img"><img src="/testuploads/${item.id}.png" alt="${item.techname}"/></div><div class="desc">${descPara(
        'TL1',
        item.tl1_desc
    )}${descPara('TL2', item.tl2_desc)}${descPara('TL3', item.tl3_desc)}${descPara(
        'TL4',
        item.tl4_desc
    )}<div class="link"><ul><li><a href="${item.link}" target="_blank" rel="noreferrer">${item.displaytext}</a></li></ul></div></div></div></div>`;
}

export async function searchView(query: string): Promise<string> {
    const q = query.trim();
    const results = await searchTools(q);

    const domainTags = new Map<number, Record<string, boolean>>();
    if (results.length > 0) {
        const allDomains = await mainDb.domains.findMany();
        for (const d of allDomains as unknown as Array<{ id: number } & Record<string, boolean>>) {
            const { id, ...tags } = d;
            domainTags.set(id, tags);
        }
    }

    const heading = q ? `Results for: ${q}` : 'Search Tech Tools';

    let jumpSpans = EMPTY;
    if (q && results.length > 0) {
        jumpSpans = markup`${results
            .slice(0, 5)
            .map(
                (item, i) =>
                    markup`<span>${i > 0 ? ' · ' : ''}<a href="#tool-${item.id}">${item.techname}</a></span>`
            )}`;
    }

    let metaLine = EMPTY;
    if (q) {
        metaLine = markup`<p class="search-meta">${results.length} ${
            results.length === 1 ? 'result' : 'results'
        }</p>`;
    }

    let resultArea: Html;
    if (!q) {
        resultArea = markup`<div><h4>Type a search term above to look up a tool.</h4></div>`;
    } else if (results.length === 0) {
        resultArea = markup`<div><h4>No tools match &ldquo;${q}&rdquo;.</h4></div>`;
    } else {
        resultArea = markup`${results.map((item) => {
            const tags = DOM_TAGS.filter((dt) => (domainTags.get(item.id) ?? {})[dt.col]);
            return resultCard(item, tags);
        })}`;
    }

    const body = markup`${navbar()}<div id="search"></div><div id="subhead"><h1 id="search-results">${heading}</h1><form id="search-form" class="search-form" action="/search" method="get"><input type="text" id="search-input" placeholder="Search tech tools by name, description, or tag…" aria-label="Search tech tools" name="query" value="${q}"/><button type="submit" id="search-submit">Search</button></form>${metaLine}<p class="jump-menu">Jump to: <a href="#search-results">Results</a>${jumpSpans} · <a href="/#front">Home</a></p></div><div id="bar">&nbsp;</div><div id="all"><div class="techtip-wrap" id="results">${resultArea}</div></div><button id="topbutton" title="Go to top">Top</button>${footer()}`;

    return shell({
        title: `${heading} · BIBS·C Tech Tools`,
        description: 'Search tech tools by name, description, or strand tag.',
        body,
    });
}
