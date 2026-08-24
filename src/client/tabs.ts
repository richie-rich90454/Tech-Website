'use strict';
// FAQ tab switcher (web landing page).
(function () {
    const tabs = document.querySelectorAll<HTMLElement>('[data-faq-tab]');
    const panels = document.querySelectorAll<HTMLElement>('[data-faq-panel]');
    if (!tabs.length || !panels.length) return;

    Array.prototype.forEach.call(tabs, function (tab: HTMLElement) {
        tab.addEventListener('click', function (e: Event) {
            e.preventDefault();
            const target = tab.getAttribute('data-faq-tab');
            Array.prototype.forEach.call(tabs, function (t: HTMLElement) {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            Array.prototype.forEach.call(panels, function (p: HTMLElement) {
                p.style.display =
                    p.getAttribute('data-faq-panel') === target ? '' : 'none';
            });
        });
    });
})();
