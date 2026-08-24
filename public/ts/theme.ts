/**
 * THEME TOGGLE - dark/light via CSS variable swap only.
 * Persists choice in localStorage; first visit follows the OS preference.
 * The button is injected at runtime into #topbar (keeps server HTML
 * byte-identical to the frozen baselines). Plain ES5 for Chrome 49+/IE11.
 */
(function () {
    'use strict';

    var KEY = 'theme';

    var SUN =
        '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"></line><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"></line><line x1="17.7" y1="6.3" x2="19.8" y2="4.2"></line></svg>';
    var MOON =
        '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg>';

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var btn = document.getElementById('theme-toggle');
        if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
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
        // Skip-link: keyboard users jump straight to the content.
        if (!document.getElementById('skip-link')) {
            var skip = document.createElement('a');
            skip.id = 'skip-link';
            skip.className = 'skip-link';
            skip.href = '#all';
            skip.text = 'Skip to content';
            document.body.insertBefore(skip, document.body.firstChild);
        }

        // Theme toggle inside #topbar (right end), styled by globals.css.
        var topbar = document.getElementById('topbar');
        if (topbar && !document.getElementById('theme-toggle')) {
            var btn = document.createElement('button');
            btn.id = 'theme-toggle';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Toggle dark mode');
            btn.title = 'Toggle dark mode (Alt+T)';
            btn.innerHTML = SUN + MOON;
            btn.addEventListener('click', flip);
            topbar.appendChild(btn);
            apply(current());
        }

        // Keyboard shortcuts:
        //   Alt+T -> toggle theme
        //   Alt+S -> focus the search box when one is on screen
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
