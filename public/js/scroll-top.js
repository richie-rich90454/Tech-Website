'use strict';
(function () {
    var o = document.getElementById('topbutton'),
        t = document.getElementById('bar');
    !o ||
        !t ||
        (window.addEventListener('scroll', function () {
            var e = document.body.scrollTop || document.documentElement.scrollTop;
            o.style.display = e > t.offsetTop ? 'block' : 'none';
        }),
        o.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }));
})();
