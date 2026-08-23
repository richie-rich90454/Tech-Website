/**
 * ============================================================================
 * TL PAGES - /tl1 /tl2 /tl3 /tl4 (filtered tech-tool listings)
 * ============================================================================
 *
 * BEHAVIOR CONTRACT (ported 1:1 from the legacy client component):
 *   - Each strand renders a checkbox that submits its form on change (GET).
 *   - "checked" state comes ENTIRELY from the URL (?s1=0 unchecks strand 1);
 *     absence means checked. That makes every filter state a shareable link.
 *   - A tool is listed when ANY checked strand's tag is true for it.
 *   - The description shown is tool[`{tl}_desc`] - the text written for THIS
 *     teaching-and-learning strategy.
 *
 * CACHING: finished HTML cached per (page,filter-combination); admin writes
 * bust with the 'tl:*' wildcard so every variant invalidates together.
 */

import { markup, esc, type Html } from '../core/04-html';
import { shell } from './shell';
import { tlConfigs, type TLConfig, type StrandConfig } from '../lib/tl-config';
import { getAcceptedSubmissions, getDomainsByColumns } from '../server/queries/submissions';
import type { SubmissionRow, DomainRow } from '../types/db';

interface ToolWithTags extends SubmissionRow {
    tags: Record<string, boolean>;
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

/** One filter checkbox row; hidden twin input guarantees a "0" when unchecked. */
function strandFilter(strand: StrandConfig, index: number, checked: boolean): Html {
    return markup`<div class="label" id="${strand.domainColumn}"><input type="hidden" name="${strand.checkboxName}" value="0"/><span class="${strand.cssClass}">${strand.label} <input type="checkbox" class="checkf" name="${strand.checkboxName}"${checked ? unsafeChecked() : ''} value="1"/></span><div class="overlay">${strand.tooltip}</div></div>`;
}

// React emitted checked="" for true checkboxes; emit exactly that token.
function unsafeChecked(): string {
    return ' checked=""';
}

function jumpMenu(config: TLConfig): Html {
    return markup`<p class="jump-menu">Jump to: <a href="#tl-title">Top</a> · <a href="#filter">Filter</a>${config.strands.map(
        (s) => markup`<span> · <a href="#${s.domainColumn}">${s.label}</a></span>`
    )} · <a href="/#front">Home</a> · <a href="/search">Search</a></p>`;
}

function toolCard(tool: ToolWithTags, config: TLConfig, tl: string): Html {
    const desc = (tool as unknown as Record<string, string>)[`${tl}_desc`] ?? '';
    return markup`<div class="techtip" id="tool-${tool.id}"><div class="line" id="line-${tool.id}"></div><h3 class="name">${tool.techname}</h3><div class="tags">${config.strands.map(
        (strand) =>
            tool.tags[strand.domainColumn]
                ? markup`<span class="${strand.cssClass}">${strand.label}</span>`
                : ''
    )}</div><div class="info"><div class="img"><img src="/testuploads/${tool.id}.png" alt="${tool.techname}"/></div><div class="desc">${desc}</div><div class="link"><ul><li><a href="${tool.link}" target="_blank" rel="noreferrer">${tool.displaytext}</a></li></ul></div></div></div>`;
}

function footer(): Html {
    return markup`<footer id="footer" data-built-by="richie-rich90454"><p id="footer-nav"><a href="/tl1">Knowing (TL1)</a> · <a href="/tl2">Strategies (TL2)</a> · <a href="/tl3">Evidence (TL3)</a> · <a href="/tl4">Crafting (TL4)</a> · <a href="/search">Search</a></p><p id="footer-copy"><b>&copy; 2026 BIBS&middot;C Tech Tips</b></p></footer>`;
}

export interface TlPageParams {
    tl: string;
    /** Raw query entries: presence of `${checkboxName}=0` means UNchecked. */
    query: Record<string, string>;
}

export async function tlView(params: TlPageParams): Promise<string | null> {
    const config: TLConfig | undefined = tlConfigs[params.tl];
    if (!config) return null;
    const tl = params.tl;

    // Absence or "1" means checked; explicit "0" means unchecked (legacy rule).
    const checked = config.strands.map((s) => params.query[s.checkboxName] !== '0');

    const [subs, domains] = await Promise.all([
        getAcceptedSubmissions(),
        getDomainsByColumns(config.domainColumns),
    ]);
    const domainById = new Map<number, DomainRow>(domains.map((d) => [d.id, d]));

    const toolsWithTags: ToolWithTags[] = [];
    for (const sub of subs) {
        const entry = domainById.get(sub.id);
        if (!entry) continue;
        // The row id equals the submission id we keyed by; strip before use.
        const { id: _drop, ...tagBooleans } = entry as unknown as {
            id: number;
        } & Record<string, boolean>;
        void _drop;
        toolsWithTags.push({ ...sub, tags: tagBooleans });
    }

    // Show a tool when ANY checked strand applies to it (legacy semantics).
    const filtered = toolsWithTags.filter((tool) =>
        config.strands.some((strand, i) => checked[i] && tool.tags[strand.domainColumn] === true)
    );

    const body = markup`${navbar()}<div id="subhead"><h1 id="tl-title">${config.title}</h1><h3 id="filter">Filter by strand:</h3><form class="filters" action="/${tl}" method="get">${config.strands.map(
        (strand, i) => strandFilter(strand, i, checked[i])
    )}</form></div><div id="bar">&nbsp;</div><div id="all"><div class="techtip-wrap" id="results">${jumpMenu(
        config
    )}${
        filtered.length === 0
            ? markup`<div><h4>No results here match your filters.</h4></div>`
            : markup`${filtered.map((t) => toolCard(t, config, tl))}`
    }</div></div><button id="topbutton" title="Go to top">Top</button>${footer()}`;

    return shell({
        title: `${config.title} · BIBS·C Tech Tools`,
        description: `Filter and explore tech tools aligned with ${config.title} strands.`,
        body,
    });
}

// Re-exported for the route module's param validation.
export { esc };
