'use strict';
// Mobile sidebar toggle + dropdown close (dashboard chrome).
(function () {
    var toggler = document.querySelector('.nav-toggler');
    var sidebar = document.querySelector('.left-sidebar');
    if (toggler && sidebar) {
        toggler.addEventListener('click', function (e) {
            e.preventDefault();
            sidebar.classList.toggle('open');
        });
    }
    document.querySelectorAll('.sidebar-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.innerWidth < 880 && sidebar) sidebar.classList.remove('open');
        });
    });
    document.querySelectorAll('[data-toggle="dropdown"]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            var parent = el.closest('.dropdown');
            if (!parent) return;
            var menu = parent.querySelector('.dropdown-menu');
            if (!menu) return;
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            if (menu.style.display === 'block') {
                setTimeout(function () {
                    function close(ev) {
                        if (!parent.contains(ev.target)) {
                            menu.style.display = 'none';
                            document.removeEventListener('click', close);
                        }
                    }
                    document.addEventListener('click', close);
                }, 0);
            }
        });
    });
})();
