'use strict';
// Scroll-to-top button show/hide + smooth scroll.
(function () {
    var btn = document.getElementById('topbutton');
    var bar = document.getElementById('bar');
    if (!btn || !bar) return;
    var topButton = btn;
    var marker = bar;

    window.addEventListener('scroll', function () {
        var y =
            document.body.scrollTop ||
            (document.documentElement.scrollTop || 0);
        topButton.style.display = y > marker.offsetTop ? 'block' : 'none';
    });
    topButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
