/**
 * IE11 POLYFILLS - loaded synchronously via a conditional comment, before
 * every deferred app script. Only IE executes this file; modern browsers
 * treat the conditional comment as an ordinary comment.
 *
 * Provides Element.prototype.matches / .closest when missing.
 * The app only ever queries CLASS selectors through closest(), so the last
 * resort matcher below handles classes and plain tag names - plenty for this
 * codebase, and honest about its scope.
 */

const ie11Proto = Element.prototype as any;

function ie11MatchesByClass(el: Element, selector: string): boolean {
    // Supports ".class", "tag", and "tag.class" - all we use.
    const dotAt = selector.indexOf(".");
    if (dotAt === -1) {
        return el.tagName.toLowerCase() === selector.toLowerCase();
    }
    const tag = dotAt === 0 ? "" : selector.slice(0, dotAt);
    const className = selector.slice(dotAt + 1);
    const tagOk = tag === "" || el.tagName.toLowerCase() === tag.toLowerCase();
    return tagOk && el.classList.contains(className);
}

if (typeof ie11Proto.matches !== "function") {
    ie11Proto.matches = function (selectors: string): boolean {
        const native = this.msMatchesSelector || this.webkitMatchesSelector;
        if (typeof native === "function") return native.call(this, selectors);
        return ie11MatchesByClass(this, selectors);
    };
}

if (typeof ie11Proto.closest !== "function") {
    ie11Proto.closest = function (this: Element, selectors: string): Element | null {
        // Walk up the tree; the this-value is rebound per call, so the
        // alias below is the loop cursor.
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let el: Element | null = this;
        while (el && el.nodeType === 1) {
            if (ie11Proto.matches.call(el, selectors)) return el;
            el = el.parentElement;
        }
        return null;
    };
}

// querySelectorAll results lack forEach in IE11 - borrow the Array one so
// no future call site can crash on it.
const nodeListCtor = window.NodeList as unknown as {
    prototype: Record<string, unknown>;
};
if (nodeListCtor && typeof nodeListCtor.prototype.forEach !== "function") {
    nodeListCtor.prototype.forEach = Array.prototype.forEach;
}
