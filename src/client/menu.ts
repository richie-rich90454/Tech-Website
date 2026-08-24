'use strict';
// Mobile sidebar toggle + dropdown behaviour (dashboard chrome).
(function () {
    const toggler = document.querySelector('.nav-toggler');
    const sidebar = document.querySelector('.left-sidebar');

    if (toggler && sidebar) {
        const toggleBtn = toggler;
        const sidePanel = sidebar;
        toggleBtn.addEventListener('click', function (e: Event) {
            e.preventDefault();
            sidePanel.classList.toggle('open');
        });
    }

    const links = document.querySelectorAll('.sidebar-link');
    Array.prototype.forEach.call(links, function (link: Element) {
        link.addEventListener('click', function () {
            if (window.innerWidth < 880 && sidebar) sidebar.classList.remove('open');
        });
    });

    const togglers = document.querySelectorAll('[data-toggle="dropdown"]');
    Array.prototype.forEach.call(togglers, function (el: Element) {
        el.addEventListener('click', function (e: Event) {
            e.preventDefault();
            const parent = el.closest('.dropdown');
            if (!parent) return;
            const menu = parent.querySelector<HTMLElement>('.dropdown-menu');
            if (!menu) return;
            const open = menu.style.display === 'block';
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
