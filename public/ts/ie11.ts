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
(function () {
    'use strict';

    var proto = Element.prototype as any;

    function matchesByClass(el: Element, selector: string): boolean {
        // Supports ".class", "tag", and "tag.class" - all we use.
        var dotAt = selector.indexOf('.');
        if (dotAt === -1) {
            return el.tagName.toLowerCase() === selector.toLowerCase();
        }
        var tag = dotAt === 0 ? '' : selector.slice(0, dotAt);
        var className = selector.slice(dotAt + 1);
        var tagOk =
            tag === '' || el.tagName.toLowerCase() === tag.toLowerCase();
        return tagOk && el.classList.contains(className);
    }

    if (typeof proto.matches !== 'function') {
        proto.matches = function (selectors: string): boolean {
            var native =
                (this as any).msMatchesSelector ||
                (this as any).webkitMatchesSelector;
            if (typeof native === 'function') return native.call(this, selectors);
            return matchesByClass(this, selectors);
        };
    }

    if (typeof proto.closest !== 'function') {
        proto.closest = function (selectors: string): Element | null {
            var el: Element | null = this;
            while (el && el.nodeType === 1) {
                if (proto.matches.call(el, selectors)) return el;
                el = el.parentElement;
            }
            return null;
        };
    }
})();
