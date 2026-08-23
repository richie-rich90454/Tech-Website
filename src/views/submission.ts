/**
 * MAIN SITE VIEW MODULE - login + submission pages.
 * Markup transcribed from frozen baselines; see views/home.ts for the rules.
 */

import { markup, unsafe, type Html } from '../core/04-html';
import { shell } from './shell';

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

export function loginView(flashError?: string): string {
    const errorLine = flashError
        ? markup`<p class="login-error" role="alert">${flashError}</p>`
        : '';
    return shell({
        title: 'Login · BIBS·C Tech Tools',
        body: markup`${navbar()}<div id="main"><div id="big"><h1 id="login-heading">Login</h1><div id="login"><h2 id="login-info">You have reached an admin-only access site.<br/>If you&#39;re an admin, log in with your credentials.</h2>${errorLine}<form id="login-form" method="post" action="/api/auth/login"><p><input type="text" placeholder="Username" required name="username"/></p><p><input type="password" placeholder="Password" required name="password"/></p><button type="submit">Login</button></form></div></div></div>`,
        css: ['login.css'],
    });
}

interface DomainGroup {
    heading: string;
    headingId?: string;
    checkboxes: Array<{ name: string; label: string }>;
}

const DOMAIN_GROUPS: DomainGroup[] = [
    {
        heading: 'TL1 Domains:',
        headingId: 'domains',
        checkboxes: [
            { name: 'R', label: 'Relationships' },
            { name: 'TP', label: 'Teacher Planning' },
            { name: 'MT', label: 'Modify their Teaching' },
            { name: 'AR', label: 'Achieve Readiness' },
        ],
    },
    {
        heading: 'TL2 Domains:',
        checkboxes: [
            { name: 'U', label: 'Understanding' },
            { name: 'MDL', label: 'Multi-dimensional Learning' },
            { name: 'RA', label: 'Reasoned Arguments' },
            { name: 'RoTech', label: 'Lifelong Learning*' },
            { name: 'LS', label: 'Learning Spaces' },
        ],
    },
    {
        heading: 'TL3 Domains:',
        checkboxes: [
            { name: 'RoThink', label: 'Reflect on Thinking' },
            { name: 'EoST', label: 'Evidence of Student Learning' },
            { name: 'EF', label: 'Employ Feedback' },
        ],
    },
    {
        heading: 'TL4 Domains:',
        checkboxes: [
            { name: 'RTE', label: 'Risk-taking Environment' },
            { name: 'DLoI', label: 'Deepening Lines of Inquiry' },
            { name: 'RaAoC', label: 'Responsibility &amp; Aspects of Citizenship' },
        ],
    },
];

export function submissionView(): string {
    const descBlock = (n: number, title: string): Html => {
        // Only the FIRST description carries the anchor id (baseline parity).
        const idAttr = n === 1 ? markup` id="descriptions"` : '';
        return markup`<h2${idAttr}>TL${n}: ${title} Description:</h2><textarea name="tl${n}_desc" class="l" form="form" placeholder="TL${n} Description..."></textarea>`;
    };
    return shell({
        title: 'Submit A New Tech Tool · BIBS·C Tech Tools',
        body: markup`${navbar()}<div id="subhead"><h1 id="submission-heading">Submit A New Tech Tool</h1><p class="jump-menu">Jump to: <a href="#tool-name">Tool Name</a> · <a href="#tool-link">Link</a> · <a href="#descriptions">Descriptions</a> · <a href="#domains">Domains</a> · <a href="#screenshot">Screenshot</a> · <a href="/#front">Home</a></p></div><div id="bar">&nbsp;</div><div id="all"><form id="form" action="/api/submission" enctype="multipart/form-data" method="post"><h2 id="tool-name">Tool Name:</h2><input type="text" class="l" placeholder="Name of Tool" name="techname"/><h2 id="tool-link">Link:</h2><input type="text" class="l" placeholder="Link" name="link"/><h2>Display Text for Link:</h2><input type="text" class="l" placeholder="Display Text" name="displaytext"/>${descBlock(
            1,
            'Knowing Our Students'
        )}${descBlock(2, 'Strategies for Learning')}${descBlock(
            3,
            'Evidence for Learning'
        )}${descBlock(4, 'Crafting the Curriculum')}${DOMAIN_GROUPS.map(
            (g) =>
                markup`<h2${g.headingId ? markup` id="${g.headingId}"` : ''}>${
                    // &amp; inside the RaAoC label must reach the browser as an
                    // ENTITY (it is authored HTML, not user text) - unsafe() on
                    // purpose; every other string here is a constant too.
                    unsafe(g.heading)
                }</h2><div class="domains">${g.checkboxes.map(
                    (c) =>
                        markup`<label><input type="checkbox" name="${c.name}" value="true"/>${c.label}</label>`
                )}</div>`
        )}<h2>Your Name (optional):</h2><input type="text" class="l" placeholder="Your Name" name="username"/><h2>Contact Email (optional):</h2><input type="text" class="l" placeholder="Contact Email" name="contact"/><h2 id="screenshot">Upload screenshot:</h2><input type="file" accept="image/*" name="screenshot"/><input type="submit" class="submit-btn" value="Submit"/></form></div>${footer()}`,
        css: ['form.css'],
    });
}
