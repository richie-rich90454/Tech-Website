(function (): void {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // ==============================================================
    // Auto select left navbar
    // ==============================================================
    const url: string = window.location + '';
    const path: string = url.replace(
      window.location.protocol + '//' + window.location.host + '/',
      ''
    );
    const allAnchors = document.querySelectorAll<HTMLAnchorElement>('ul#sidebarnav a');
    const elementArr = Array.from(allAnchors).filter(function (anchor): boolean {
      return anchor.href === url || anchor.href === path;
    });

    // parentsUntil('.sidebar-nav') — walk ancestors up to but not including .sidebar-nav
    const parents: HTMLElement[] = [];
    elementArr.forEach(function (el): void {
      let current = el.parentElement;
      while (current && !current.matches('.sidebar-nav')) {
        parents.push(current);
        current = current.parentElement;
      }
    });

    parents.forEach(function (el: HTMLElement): void {
      if (el.tagName === 'LI' && el.querySelector('a') !== null) {
        const anchor = el.querySelector('a') as HTMLAnchorElement;
        anchor.classList.add('active');
        if (!el.parentElement?.matches('ul#sidebarnav')) {
          el.classList.add('active');
        } else {
          el.classList.add('selected');
        }
      } else if (el.tagName !== 'UL' && el.querySelector('a') === null) {
        el.classList.add('selected');
      } else if (el.tagName === 'UL') {
        el.classList.add('in');
      }
    });

    elementArr.forEach(function (el): void {
      el.classList.add('active');
    });

    document.querySelectorAll('#sidebarnav a').forEach(function (el: Element): void {
      (el as HTMLElement).addEventListener('click', function (this: HTMLElement, e: MouseEvent): void {
        if (!this.classList.contains('active')) {
          // hide any open menus and remove all other classes
          const parentUl = this.closest('ul');
          if (parentUl) {
            parentUl.querySelectorAll('ul').forEach(function (ul): void {
              ul.classList.remove('in');
            });
            parentUl.querySelectorAll('a').forEach(function (a): void {
              a.classList.remove('active');
            });
          }

          // open our new menu and add the open class
          const nextEl = this.nextElementSibling;
          if (nextEl && nextEl.tagName === 'UL') {
            nextEl.classList.add('in');
          }
          this.classList.add('active');
        } else if (this.classList.contains('active')) {
          this.classList.remove('active');
          const parentUl = this.closest('ul');
          if (parentUl) {
            parentUl.classList.remove('active');
          }
          const nextEl = this.nextElementSibling;
          if (nextEl && nextEl.tagName === 'UL') {
            nextEl.classList.remove('in');
          }
        }
      });
    });

    document.querySelectorAll('#sidebarnav >li >a.has-arrow').forEach(function (el: Element): void {
      (el as HTMLElement).addEventListener('click', function (this: HTMLElement, e: MouseEvent): void {
        e.preventDefault();
      });
    });
  });
})();