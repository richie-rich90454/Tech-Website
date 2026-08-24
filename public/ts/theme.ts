/**
 * THEME - applies the saved (or OS-preferred) theme and wires the toggle
 * button that lives in the markup (partials/navbar.ejs). This file creates
 * NO elements; it only flips [data-theme] on <html> and persists the choice.
 * Plain ES5 for Chrome 49+/IE11.
 */
(function () {
    'use strict';

    var KEY = 'theme';

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var btn = document.getElementById('theme-toggle');
        if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    function current() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }

    // Saved choice wins; first visit follows the OS preference.
    var saved = null;
    try {
        saved = localStorage.getItem(KEY);
    } catch (e) {
        /* storage blocked - fall through to OS preference */
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
            /* toggle still works for this page view without persistence */
        }
    }

    function ready() {
        var btn = document.getElementById('theme-toggle');
        if (btn) btn.addEventListener('click', flip);

        // Keyboard shortcuts: Alt+T toggles theme, Alt+S focuses search.
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
