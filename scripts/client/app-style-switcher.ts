(function (): void {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    function handlelogobg(): void {
      document.querySelectorAll<HTMLElement>('.theme-color .theme-item .theme-link').forEach(function (el: HTMLElement): void {
        el.addEventListener('click', function (this: HTMLElement): void {
          const logobgskin: string | undefined = this.getAttribute('data-logobg') ?? undefined;
          document.querySelector<HTMLElement>('.topbar .top-navbar .navbar-header')?.setAttribute('data-logobg', logobgskin ?? '');
        });
      });
    }
    handlelogobg();

    //****************************
    /* Top navbar Theme Change function Start */
    //****************************
    function handlenavbarbg(): void {
      if (document.querySelector<HTMLElement>('#main-wrapper')?.getAttribute('data-navbarbg') == 'skin6') {
        // do this
        document.querySelector<HTMLElement>('.topbar .navbar')?.classList.add('navbar-light');
        document.querySelector<HTMLElement>('.topbar .navbar')?.classList.remove('navbar-dark');
      } else {
        // do that
      }
      document.querySelectorAll<HTMLElement>('.theme-color .theme-item .theme-link').forEach(function (el: HTMLElement): void {
        el.addEventListener('click', function (this: HTMLElement): void {
          const navbarbgskin: string | undefined = this.getAttribute('data-navbarbg') ?? undefined;
          document.querySelector<HTMLElement>('#main-wrapper')?.setAttribute('data-navbarbg', navbarbgskin ?? '');
          document.querySelector<HTMLElement>('.topbar .navbar-collapse')?.setAttribute('data-navbarbg', navbarbgskin ?? '');
          if (document.querySelector<HTMLElement>('#main-wrapper')?.getAttribute('data-navbarbg') == 'skin6') {
            // do this
            document.querySelector<HTMLElement>('.topbar .navbar')?.classList.add('navbar-light');
            document.querySelector<HTMLElement>('.topbar .navbar')?.classList.remove('navbar-dark');
          } else {
            // do that
            document.querySelector<HTMLElement>('.topbar .navbar')?.classList.remove('navbar-light');
            document.querySelector<HTMLElement>('.topbar .navbar')?.classList.add('navbar-dark');
          }
        });
      });
    }
    handlenavbarbg();

    //****************************
    /* Manage sidebar bg color */
    //****************************
    function handlesidebarbg(): void {
      document.querySelectorAll<HTMLElement>('.theme-color .theme-item .theme-link').forEach(function (el: HTMLElement): void {
        el.addEventListener('click', function (this: HTMLElement): void {
          const sidebarbgskin: string | undefined = this.getAttribute('data-sidebarbg') ?? undefined;
          document.querySelector<HTMLElement>('.left-sidebar')?.setAttribute('data-sidebarbg', sidebarbgskin ?? '');
          document.querySelector<HTMLElement>('.scroll-sidebar')?.setAttribute('data-sidebarbg', sidebarbgskin ?? '');
        });
      });
    }
    handlesidebarbg();

    //****************************
    /* sidebar position */
    //****************************
    function handlesidebarposition(): void {
      document.querySelector<HTMLInputElement>('#sidebar-position')?.addEventListener('change', function (this: HTMLElement): void {
        if ((this as HTMLInputElement).checked) {
          document.querySelector<HTMLElement>('#main-wrapper')?.setAttribute('data-sidebar-position', 'fixed');
          document.querySelector<HTMLElement>('.topbar .top-navbar .navbar-header')?.setAttribute('data-navheader', 'fixed');
        } else {
          document.querySelector<HTMLElement>('#main-wrapper')?.setAttribute('data-sidebar-position', 'absolute');
          document.querySelector<HTMLElement>('.topbar .top-navbar .navbar-header')?.setAttribute('data-navheader', 'relative');
        }
      });
    }
    handlesidebarposition();

    //****************************
    /* Header position */
    //****************************
    function handleheaderposition(): void {
      document.querySelector<HTMLInputElement>('#header-position')?.addEventListener('change', function (this: HTMLElement): void {
        if ((this as HTMLInputElement).checked) {
          document.querySelector<HTMLElement>('#main-wrapper')?.setAttribute('data-header-position', 'fixed');
        } else {
          document.querySelector<HTMLElement>('#main-wrapper')?.setAttribute('data-header-position', 'relative');
        }
      });
    }
    handleheaderposition();

    //****************************
    /* sidebar position */
    //****************************
    function handleboxedlayout(): void {
      document.querySelector<HTMLInputElement>('#boxed-layout')?.addEventListener('change', function (this: HTMLElement): void {
        if ((this as HTMLInputElement).checked) {
          document.querySelector<HTMLElement>('#main-wrapper')?.setAttribute('data-boxed-layout', 'boxed');
        } else {
          document.querySelector<HTMLElement>('#main-wrapper')?.setAttribute('data-boxed-layout', 'full');
        }
      });
    }
    handleboxedlayout();

    //****************************
    /* Header position */
    //****************************
    function handlethemeview(): void {
      document.querySelector<HTMLInputElement>('#theme-view')?.addEventListener('change', function (this: HTMLElement): void {
        if ((this as HTMLInputElement).checked) {
          document.body.setAttribute('data-theme', 'dark');
        } else {
          document.body.setAttribute('data-theme', 'light');
        }
      });
    }
    handlethemeview();

    const setsidebartype = function (): void {
      const width = window.innerWidth > 0 ? window.innerWidth : window.screen.width;
      if (width < 1170) {
        document.querySelector<HTMLElement>('#main-wrapper')?.setAttribute('data-sidebartype', 'mini-sidebar');
        document.querySelector<HTMLElement>('#main-wrapper')?.classList.add('mini-sidebar');
      } else {
        document.querySelector<HTMLElement>('#main-wrapper')?.setAttribute('data-sidebartype', 'full');
        document.querySelector<HTMLElement>('#main-wrapper')?.classList.remove('mini-sidebar');
      }
    };
    setsidebartype();
    window.addEventListener('resize', setsidebartype);
  });
})();