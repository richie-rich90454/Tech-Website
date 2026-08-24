/**
 * IE11 POLYFILLS - loaded synchronously via a conditional comment, before
 * every deferred app script. Only IE executes this file; modern browsers
 * treat the conditional comment as an ordinary comment.
 *
 * Provides:
 *   - Element.prototype.matches (IE11 knows it as msMatchesSelector)
 *   - Element.prototype.closest
 */
(function () {
    'use strict';

    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.msMatchesSelector ||
            Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
        /**
         * @param {string} selectors
         * @return {Element | null}
         */
        Element.prototype.closest = function (selectors) {
            var el = this;
            // IE11 has no ParentNode on Document/DocumentFragment; guard it.
            if (!document.documentElement.contains(el)) return null;
            while (el && el.nodeType === 1) {
                if (el.matches(selectors)) return el;
                el = el.parentElement || el.parentNode;
            }
            return null;
        };
    }
})();
