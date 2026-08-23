/**
 * MAIN SITE VIEWS - home page.
 *
 * The markup below is a faithful transcription of the frozen baseline
 * (tests/baseline/index.html). Rules for future edits:
 *   1. Never "improve" structure/classes here without a matching visual
 *      decision - tests/parity.mjs will (and must) fail otherwise.
 *   2. Templates are authored as single-line strings on purpose: whitespace
 *      between tags/text is VISIBLE in HTML, so indentation inside these
 *      literals would change rendering. The tag is named `markup` (not
 *      `html`) precisely so formatters never reflow template contents.
 *   3. Dynamic data flows in as typed props; every ${} hole is auto-escaped.
 */

import { markup, type Html } from '../core/04-html';
import { shell } from './shell';

interface TlCard {
    id: string;
    href: string;
    title: string;
    strands: string[];
}

/** Card data mirrors tl-config ordering; strands text matches the original. */
const TL_CARDS: TlCard[] = [
    {
        id: 'tl1',
        href: '/tl1',
        title: 'TL1: Knowing Our Students',
        strands: [
            'Relationships',
            'Teacher planning',
            'Modify their teaching',
            'Achieve readiness',
        ],
    },
    {
        id: 'tl2',
        href: '/tl2',
        title: 'TL2: Strategies for Learning',
        strands: [
            'Understanding',
            'Multi-dimensional learning',
            'Reasoned arguments',
            'Repertoire of techniques',
            'Learning spaces',
        ],
    },
    {
        id: 'tl3',
        href: '/tl3',
        title: 'TL3: Evidence for Learning',
        strands: ['Reflect on thinking', 'Evidence of student learning', 'Employ feedback'],
    },
    {
        id: 'tl4',
        href: '/tl4',
        title: 'TL4: Crafting the Curriculum',
        strands: [
            'Risk-taking environment',
            'Deepening lines of inquiry',
            'Responsibility and aspects of citizenship',
        ],
    },
];

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

function heroSection(): Html {
    // Attribute shape is copied verbatim from the legacy image pipeline's
    // output so the parity checker sees an identical element.
    return markup`<div id="front" data-built-by="richie-rich90454"><img alt="Abstract hand-drawn welcome illustration" fetchpriority="high" decoding="async" data-nimg="fill" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;object-fit:cover;color:transparent;z-index:0" src="/images/hero.svg"/><div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(13,15,45,0.35) 0%, rgba(13,15,45,0.55) 100%);z-index:1"></div><h1>Welcome to BASIS International and Bilingual Schools·China Tech Tools</h1></div>`;
}

function basicInfo(): Html {
    return markup`<div id="all" style="padding:0px 0px"><div id="basicinfo"><h2 id="about" class="section-anchor">About this site</h2><p>Before you start using this site, you&#39;ll want to take a moment to understand how it is organized. </p><p>This website presents technological tools you can use to aid your instruction. These <b>Tech Tools</b> are sorted into four <b>domains</b> based on their function (see below). Within each domain, Tech Tools are then sorted into <b>strands</b> based on how they help you accomplish each step in implementing the broader educational strategy. On this site, there will be a separate page for domain, where you will then be able to apply an interactive filter to find tools specific to each strand.</p><h1 id="strategies">The 4 Strategies for Teaching and Learning (TL):</h1><p id="jump-menu" class="jump-menu">Jump to: <a href="/#tl1">TL1: Knowing</a> · <a href="/#tl2">TL2: Strategies</a> · <a href="/#tl3">TL3: Evidence</a> · <a href="/#tl4">TL4: Crafting</a> · <a href="/#submit-cta">Submit a Tool</a> · <a href="/#footer">Footer</a></p></div></div>`;
}

function card(cardDef: TlCard): Html {
    return markup`<a class="tlx" id="${cardDef.id}" style="scroll-margin-top:var(--nav-offset)" href="${cardDef.href}"><div class="tlhead">${cardDef.title}</div><div class="tlx__strands-label">Includes the strands</div><ul class="tlx__strands">${cardDef.strands.map(
        (s) => markup`<li>${s}</li>`
    )}</ul></a>`;
}

function tlCardGrid(): Html {
    // Static wrapper tags are literal template text - only ${} holes are escaped.
    return markup`<div class="tl-section" id="domains" style="scroll-margin-top:var(--nav-offset)">${TL_CARDS.map(
        card
    )}</div><p class="tl-submit-cta" id="submit-cta" style="scroll-margin-top:var(--nav-offset)">In addition, if you know of any tech tools not already on this site, you may submit them here: <a href="/submission"><button class="submit-link">Submit New Tech Tool</button></a></p>`;
}

function footer(): Html {
    return markup`<footer id="footer" data-built-by="richie-rich90454"><p id="footer-nav"><a href="/tl1">Knowing (TL1)</a> · <a href="/tl2">Strategies (TL2)</a> · <a href="/tl3">Evidence (TL3)</a> · <a href="/tl4">Crafting (TL4)</a> · <a href="/search">Search</a></p><p id="footer-copy"><b>&copy; 2026 BIBS&middot;C Tech Tips</b></p></footer>`;
}

export function homeView(): string {
    return shell({
        title: 'BIBS·C Tech Tools',
        description: 'Tech tools and resources for BASIS International and Bilingual Schools·China',
        body: markup`${navbar()}${heroSection()}<div id="bar">&nbsp;</div>${basicInfo()}${tlCardGrid()}${footer()}`,
    });
}
