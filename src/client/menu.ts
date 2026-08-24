'use strict';
// Mobile sidebar toggle + dropdown behaviour (dashboard chrome).
(function () {
    var toggler = document.querySelector('.nav-toggler');
    var sidebar = document.querySelector('.left-sidebar');

    if (toggler && sidebar) {
        var toggleBtn = toggler;
        var sidePanel = sidebar;
        toggleBtn.addEventListener('click', function (e: Event) {
            e.preventDefault();
            sidePanel.classList.toggle('open');
        });
    }

    var links = document.querySelectorAll('.sidebar-link');
    Array.prototype.forEach.call(links, function (link: Element) {
        link.addEventListener('click', function () {
            if (window.innerWidth < 880 && sidebar) sidebar.classList.remove('open');
        });
    });

    var togglers = document.querySelectorAll('[data-toggle="dropdown"]');
    Array.prototype.forEach.call(togglers, function (el: Element) {
        el.addEventListener('click', function (e: Event) {
            e.preventDefault();
            const parent = el.closest('.dropdown');
            if (!parent) return;
            const menu = parent.querySelector<HTMLElement>('.dropdown-menu');
            if (!menu) return;
            var open = menu.style.display === 'block';
            menu.style.display = open ? 'none' : 'block';
            if (!open) {
                // Pass the nodes as args: IE11-safe setTimeout + no re-narrow.
                setTimeout(registerOutsideClose, 0, parent, menu);
            }
        });
    });

    function registerOutsideClose(dropdown: Element, panel: HTMLElement): void {
        function close(ev: Event): void {
            if (!dropdown.contains(ev.target as Node)) {
                panel.style.display = 'none';
                document.removeEventListener('click', close);
            }
        }
        document.addEventListener('click', close);
    }
})();
