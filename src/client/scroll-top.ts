'use strict';
// Scroll-to-top button show/hide + smooth scroll.
(function () {
    const btn = document.getElementById('topbutton');
    const bar = document.getElementById('bar');
    if (!btn || !bar) return;
    const topButton = btn;
    const marker = bar;

    window.addEventListener('scroll', function () {
        const y =
            document.body.scrollTop ||
            (document.documentElement.scrollTop || 0);
        topButton.style.display = y > marker.offsetTop ? 'block' : 'none';
    });
    topButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
