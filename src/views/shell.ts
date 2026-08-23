/**
 * ============================================================================
 * SHARED PAGE SHELL (main public site)
 * ============================================================================
 *
 * PURPOSE
 * Every page of the public site shares one document skeleton: doctype, head
 * (charset/viewport/title/description/favicon/fonts/stylesheets) and <body>.
 * Views call shell({ title, description, body, css }) and return finished HTML.
 *
 * TYPOGRAPHY PARITY NOTE
 * The previous framework self-hosted the Inter fontface and injected a hashed
 * class on <html>. We load the SAME family + weights from Google Fonts instead;
 * the rendered glyphs are identical because globals.css references 'Inter' by
 * name through its --font-sans variable. This lives in <head>, which the
 * parity checker deliberately does not diff - but it IS a visual decision,
 * so weights below must never drift: 400 regular, 500 medium, 600 semibold,
 * 700 bold (matching every font-weight used in globals.css).
 */

import { markup, unsafe, esc, type Html } from '../core/04-html';

export interface ShellOptions {
    title: string;
    description?: string;
    /** Page content - build it with markup`` fragments. */
    body: Html;
    /** Stylesheet paths under /css/, linked in order (globals first). */
    css?: string[];
    /** Client scripts under /js/, deferred so HTML paints first. */
    scripts?: string[];
}

/** The exact font weights globals.css uses; loaded once here for all pages. */
const INTER_FONT_HREF =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

export function shell(options: ShellOptions): string {
    const cssLinks = ['globals.css', ...(options.css ?? [])].map(
        (file) => markup`<link rel="stylesheet" href="/css/${esc(file)}" />`
    );
    const scriptTags = (options.scripts ?? []).map(
        (file) => markup`<script src="/js/${esc(file)}" defer></script>`
    );
    const description = options.description ?? '';
    return renderDocument(
        markup` <!doctype html>
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>${options.title}</title>
                    ${description ? markup`<meta name="description" content="${description}" />` : ''}
                    <link rel="icon" href="/images/favicon.png" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link rel="stylesheet" href="${INTER_FONT_HREF}" />
                    ${cssLinks} ${scriptTags}
                </head>
                <body>
                    ${unsafe(options.body.value)}
                </body>
            </html>`
    );
}

/** Internal: unwrap the final document back to a plain string for the wire. */
function renderDocument(document: Html): string {
    return document.value;
}
