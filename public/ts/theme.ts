/**
 * THEME TOGGLE - dark/light via CSS variable swap only.
 * Persists choice in localStorage; first visit follows the OS preference.
 * Plain ES5 so it runs in Chrome 49+/IE11 like every other client script.
 */
(function () {
    'use strict';

    var KEY = 'theme';

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    function current() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }

    // Initial theme: saved choice wins, otherwise the OS setting.
    var saved = null;
    try {
        saved = localStorage.getItem(KEY);
    } catch (e) {
        /* private mode - just use OS preference */
    }
    if (!saved && window.matchMedia) {
        saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    apply(saved === 'dark' ? 'dark' : 'light');

    function flip() {
        var next = current() === 'dark' ? 'light' : 'dark';
        apply(next);
        try {
            localStorage.setItem(KEY, next);
        } catch (e) {
            /* storage unavailable - toggle still works for this page view */
        }
    }

    function ready() {
        // Inject the skip link + theme toggle at runtime: keeps server HTML
        // byte-identical to the frozen baselines while browsers get both.
        if (!document.getElementById('skip-link')) {
            var skip = document.createElement('a');
            skip.id = 'skip-link';
            skip.className = 'skip-link';
            skip.href = '#all';
            skip.text = 'Skip to content';
            document.body.insertBefore(skip, document.body.firstChild);
        }
        var topbar = document.getElementById('topbar');
        if (topbar && !document.getElementById('theme-toggle')) {
            var btn = document.createElement('button');
            btn.id = 'theme-toggle';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Toggle dark mode');
            btn.title = 'Toggle dark mode (Alt+T)';
            btn.innerHTML = '&#9789;';
            btn.addEventListener('click', flip);
            topbar.appendChild(btn);
        }

        // Keyboard shortcuts (Alt+key works across browsers without stealing
        // plain-key combos):
        //   Alt+T -> toggle theme
        //   Alt+S -> jump focus to the search box when one is on screen
        document.addEventListener('keydown', function (ev) {
            if (!ev.altKey || ev.ctrlKey || ev.metaKey) return;
            var k = String.fromCharCode(ev.keyCode);
            if (k === 'T' || k === 't') {
                ev.preventDefault();
                flip();
            } else if (k === 'S' || k === 's') {
                var input = document.getElementById('search-input');
                if (input) {
                    ev.preventDefault();
                    input.focus();
                }
            }
        });
    }

    if (document.readyState !== 'loading') ready();
    else document.addEventListener('DOMContentLoaded', ready);
})();
