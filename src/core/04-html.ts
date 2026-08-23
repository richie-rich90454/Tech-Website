/**
 * ============================================================================
 * CORE MODULE 04 - HTML TEMPLATING
 * READING ORDER: This is the foundation every view is built on.
 * ============================================================================
 *
 * PURPOSE
 * Every page this website serves is built as an HTML string on the server
 * (Server-Side Rendering). This module provides the tiny toolbox views use:
 *
 *   html`<p>Hello ${name}</p>`   -> safe HTML, interpolations auto-escaped
 *   esc(userInput)               -> explicit escaping when you need it
 *   unsafe(alreadyTrusted)       -> opt-out escape hatch (rare, review-worthy)
 *
 * WHY THIS EXISTS (and not React/EJS/a big library)
 * A tagged template literal is plain JavaScript that ships with the language.
 * There is zero dependency, zero build step for views, and the browser receives
 * finished HTML - which is exactly what screen readers and IE-era browsers want.
 *
 * LEARN
 * A "tagged template" is a function called WITHOUT parentheses:
 *   html`<b>${x}</b>`  ===  html(["<b>", "</b>"], x)
 * The strings array is the static parts; the values are the dynamic parts.
 * Because WE receive them separately, we can escape each value before gluing.
 * That single fact is what makes injection structurally impossible here.
 *
 * PERFORMANCE
 * - Escaping is a 5-character single-pass replace over short strings: nanoseconds.
 * - No DOM diffing, no virtual tree, no hydration. The string is the product.
 * - Views stay pure functions of their props, which lets whole finished pages
 *   be cached (see core/06-cache.ts) and served straight from memory.
 */

/**
 * A string that is KNOWN to be safe HTML, wrapped as a one-field object.
 *
 * WHY A WRAPPER AND NOT JUST A STRING?
 * The first version of this type used a compile-time-only "branded string".
 * That hid a real bug: at runtime nothing distinguished escaped from raw
 * text, so unsafe() content got double-escaped. An explicit wrapper makes
 * the safety boundary PHYSICAL - you cannot have Html without the envelope,
 * and the unit tests prove the envelope travels through composition.
 */
export interface Html {
    readonly value: string;
}

/** The five characters that make text dangerous inside HTML, mapped to entities. */
const ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

/**
 * Escape a value so it is safe to place inside HTML text or an attribute.
 *
 * Example: esc('<script>') becomes "&lt;script&gt;" which the browser will
 * DISPLAY as "<script>" instead of EXECUTING. This is the single most important
 * function in the file - everything else builds on it.
 */
export function esc(value: unknown): string {
    // Fast path: most strings contain nothing dangerous. The regex below only
    // pays its cost when one of the five characters is actually present.
    const s = String(value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return /[&<>"']/.test(s as any) ? s.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]) : s;
}

/**
 * Mark a string as already-safe HTML so interpolation inserts it verbatim.
 *
 * Use this ONLY for content you fully control (constants, other rendered Html,
 * markup assembled from escaped pieces). Running user input through unsafe()
 * would reopen the hole esc() just closed - which is why the name shouts.
 */
export function unsafe(value: string): Html {
    return { value };
}

/** Runtime type guard: does this value carry the safe-HTML envelope? */
function isHtml(value: unknown): value is Html {
    return typeof value === 'object' && value !== null && typeof (value as Html).value === 'string';
}

/**
 * Values allowed between ${...} inside an html`` template.
 * falsy values (false/null/undefined) vanish entirely - this makes the common
 * conditional pattern `${isAdmin && html`<a>...</a>`}` read naturally.
 */
type Interpolatable = Html | string | number | boolean | null | undefined;
type Interpolation = Interpolatable | Interpolation[];

function flatten(value: Interpolation): string {
    if (value == null || value === false) return '';
    if (value === true) return ''; // booleans are switches, never content
    if (Array.isArray(value)) return value.map(flatten).join('');
    // The ONLY escape hatch is the Html envelope; every raw string/number is
    // escaped. This single branch is the security model of the view layer.
    return isHtml(value) ? value.value : esc(value);
}

/**
 * Build safe HTML from a tagged template. Every ${...} is escaped automatically;
 * nested html`` fragments and arrays of them (e.g. items.map(...)) compose.
 *
 * Example:
 *   const row = (n: string, v: number) => html`<tr><td>${n}</td><td>${v}</td></tr>`;
 *   const table = html`<table>${rows.map(row)}</table>`;
 */
export function markup(strings: TemplateStringsArray, ...values: Interpolation[]): Html {
    let out = '';
    for (let i = 0; i < strings.length; i += 1) {
        out += strings[i];
        if (i < values.length) out += flatten(values[i]);
    }
    return { value: out };
}

/** Extract the runtime string from an Html value (used by Context.html()). */
export function renderToString(page: Html): string {
    return page.value;
}

// TODO(roadmap): template-level fragment helper if view composition ever needs
// keyed lists; today array flattening covers every call site we have.
