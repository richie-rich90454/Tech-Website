/**
 * THEME - applies the saved (or OS-preferred) theme and wires the toggle
 * button that lives in the markup (partials/navbar.ejs). This file creates
 * NO elements; it only flips [data-theme] on <html> and persists the choice.
 * The emitted ES5 targets Chrome 49+/IE11.
 */

const THEME_KEY = "theme";

function themeApply(theme: string): void {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-pressed", String(theme === "dark"));
}

function themeCurrent(): string {
    return document.documentElement.getAttribute("data-theme") || "light";
}

function themeFlip(): void {
    const next = themeCurrent() === "dark" ? "light" : "dark";
    themeApply(next);
    // Persist via cookie: the SERVER reads this on the next request and
    // server-renders data-theme on <html> (see Context.withServerTheme).
    // localStorage mirrors it for redundancy on static-only views.
    document.cookie = THEME_KEY + "=" + next + ";path=/;max-age=31536000;samesite=lax";
    try {
        localStorage.setItem(THEME_KEY, next);
    } catch (e) {
        /* toggle still works for this page view without persistence */
    }
}

function themeReady(): void {
    // Saved choice wins; first visit follows the OS preference.
    let saved: string | null = null;
    try {
        saved = localStorage.getItem(THEME_KEY);
    } catch (e) {
        /* storage blocked - fall through to OS preference */
    }
    if (!saved && window.matchMedia) {
        saved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    themeApply(saved === "dark" ? "dark" : "light");

    const btn = document.getElementById("theme-toggle");
    if (btn) btn.addEventListener("click", themeFlip);

    // Keyboard shortcuts: Alt+T toggles theme, Alt+S focuses search.
    document.addEventListener("keydown", function (ev: KeyboardEvent) {
        if (!ev.altKey || ev.ctrlKey || ev.metaKey) return;
        const k = String.fromCharCode(ev.keyCode);
        if (k === "T" || k === "t") {
            ev.preventDefault();
            themeFlip();
        } else if (k === "S" || k === "s") {
            const input = document.getElementById("search-input");
            if (input) {
                ev.preventDefault();
                input.focus();
            }
        }
    });
}

if (document.readyState !== "loading") themeReady();
else document.addEventListener("DOMContentLoaded", themeReady);
