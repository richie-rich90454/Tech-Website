// Maintainer: richie-rich90454 · June 2026

(function (): void {
  'use strict';

  //* Nav scroll spy with IntersectionObserver
  const stickyMenuEl: HTMLElement | null = document.querySelector('.sticky-menu');
  const top_offset: number = stickyMenuEl ? stickyMenuEl.offsetHeight - 10 : 0;
  const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.main-menu nav ul li a');
  const sectionElements: HTMLElement[] = [];
  const sectionMap: Map<string, boolean> = new Map();
  navLinks.forEach(function (a: HTMLAnchorElement): void {
    const href: string = a.getAttribute('href') || '';
    if (href.startsWith('#') && href.length > 1) {
      const el: HTMLElement | null = document.getElementById(href.substring(1));
      if (el) {
        sectionMap.set(el.id, false);
        sectionElements.push(el);
      }
    }
  });
  let activeId: string = '';
  const scrollObserver: IntersectionObserver = new IntersectionObserver(
    function (entries: IntersectionObserverEntry[]): void {
      entries.forEach(function (entry: IntersectionObserverEntry): void {
        sectionMap.set(entry.target.id, entry.isIntersecting);
        if (entry.isIntersecting) {
          activeId = entry.target.id;
        }
      });
      navLinks.forEach(function (a: HTMLAnchorElement): void {
        const li: HTMLElement | null = a.parentElement;
        if (li) {
          if (a.getAttribute('href') === '#' + activeId) {
            li.classList.add('active');
          } else {
            li.classList.remove('active');
          }
        }
      });
    },
    { rootMargin: '-' + top_offset + 'px 0px -50% 0px' }
  );
  sectionElements.forEach(function (sec: HTMLElement): void {
    scrollObserver.observe(sec);
  });

  /**
   * Fixed navbar on scroll
   */
  function navbarFixed(): void {
    if (document.querySelector('.sticky-menu')) {
      window.addEventListener('scroll', function (): void {
        const scroll: number = window.scrollY || document.documentElement.scrollTop;
        const stickyMenu = document.querySelector('.sticky-menu') as HTMLElement;
        if (stickyMenu) {
          if (scroll >= 295) {
            stickyMenu.classList.add('navbar_fixed');
          } else {
            stickyMenu.classList.remove('navbar_fixed');
          }
        }
      });
    }
  }
  //* Mobile menu toggle (replaces meanmenu)
  const mobileMenuBtn: HTMLElement | null = document.querySelector('#mobile-menu');
  const mainMenuNav: HTMLElement | null = document.querySelector('.main-menu nav ul');
  if (mobileMenuBtn && mainMenuNav) {
    mobileMenuBtn.addEventListener('click', function (): void {
      mainMenuNav.classList.toggle('open');
      mobileMenuBtn.classList.toggle('open');
    });
    const mql: MediaQueryList = window.matchMedia('(min-width: 992px)');
    function handleMqlChange(e: MediaQueryListEvent | MediaQueryList): void {
      if (e.matches) {
        mainMenuNav!.classList.remove('open');
        mobileMenuBtn!.classList.remove('open');
      }
    }
    mql.addEventListener('change', handleMqlChange);
    handleMqlChange(mql);
  }
  //* Counter Js
  /**
   * Counter up animation with IntersectionObserver
   */
  function counterUp(): void {
    const counters: NodeListOf<HTMLElement> = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    const counterObserver: IntersectionObserver = new IntersectionObserver(
      function (entries: IntersectionObserverEntry[]): void {
        entries.forEach(function (entry: IntersectionObserverEntry): void {
          if (entry.isIntersecting) {
            const el: HTMLElement = entry.target as HTMLElement;
            const target: number = parseFloat(el.textContent || '0');
            const duration: number = 400;
            const delay: number = 10;
            const steps: number = Math.floor(duration / delay);
            let current: number = 0;
            const increment: number = target / steps;
            const timer: ReturnType<typeof setInterval> = setInterval(function (): void {
              current += increment;
              if (current >= target) {
                el.textContent = String(Math.floor(target));
                clearInterval(timer);
              } else {
                el.textContent = String(Math.floor(current));
              }
            }, delay);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach(function (el: HTMLElement): void {
      counterObserver.observe(el);
    });
  }

  //* Magnificpopup js
  /**
   * Custom iframe modal (replaces magnificPopup)
   */
  function magnificPopup(): void {
    const popupLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.popup-youtube');
    if (popupLinks.length === 0) return;
    let modalOverlay: HTMLElement | null = null;
    function createModal(href: string): void {
      removeModal();
      modalOverlay = document.createElement('div');
      modalOverlay.className = 'custom-modal-overlay';
      modalOverlay.addEventListener('click', function (e: Event): void {
        if (e.target === modalOverlay) removeModal();
      });
      const modalContent: HTMLDivElement = document.createElement('div');
      modalContent.className = 'custom-modal-content';
      const closeBtn: HTMLButtonElement = document.createElement('button');
      closeBtn.className = 'custom-modal-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', removeModal);
      const iframe: HTMLIFrameElement = document.createElement('iframe');
      iframe.src = href;
      iframe.className = 'custom-modal-iframe';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'autoplay');
      modalContent.appendChild(closeBtn);
      modalContent.appendChild(iframe);
      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    function removeModal(): void {
      if (modalOverlay) {
        document.body.removeChild(modalOverlay);
        modalOverlay = null;
        document.body.style.overflow = '';
      }
    }
    popupLinks.forEach(function (link: HTMLAnchorElement): void {
      link.addEventListener('click', function (e: Event): void {
        e.preventDefault();
        if (window.innerWidth >= 700) {
          createModal(link.href);
        }
      });
    });
  }

  //* Carousel helper (replaces owlCarousel)
  /**
   * Initialize CSS scroll-snap carousel
   */
  function initCarousel(
    containerSelector: string,
    opts: {
      items?: number;
      responsive?: Record<number, { items: number }>;
      autoplay?: boolean;
      autoplaySpeed?: number;
      margin?: number;
    }
  ): void {
    const container: HTMLElement | null = document.querySelector(containerSelector);
    if (!container) return;
    // Build track wrapper
    let track: HTMLElement | null = container.querySelector('.carousel-track');
    if (!track) {
      track = document.createElement('div');
      track.className = 'carousel-track';
      while (container.firstChild) track.appendChild(container.firstChild);
      container.appendChild(track);
    }
    // Container styles
    container.style.position = 'relative';
    // Track styles
    track.style.display = 'flex';
    track.style.overflowX = 'auto';
    track.style.scrollSnapType = 'x mandatory';
    track.style.scrollBehavior = 'smooth';
    track.style.scrollbarWidth = 'none';
    (track.style as any).msOverflowStyle = 'none';
    // Hide webkit scrollbar
    const styleId: string = 'cs-' + containerSelector.replace(/[.#\s]/g, '-');
    if (!document.getElementById(styleId)) {
      const s: HTMLStyleElement = document.createElement('style');
      s.id = styleId;
      s.textContent = containerSelector + ' .carousel-track::-webkit-scrollbar { display:none; }';
      document.head.appendChild(s);
    }
    const margin: number = opts.margin || 0;
    function applyLayout(): void {
      const w: number = window.innerWidth;
      let show: number = opts.items || 1;
      if (opts.responsive) {
        const bps: number[] = Object.keys(opts.responsive).map(Number).sort(function (a: number, b: number): number { return a - b; });
        for (let i: number = bps.length - 1; i >= 0; i--) {
          if (w >= bps[i]) { show = opts.responsive[bps[i]].items; break; }
        }
      }
      const pct: number = 100 / show;
      Array.from(track!.children).forEach(function (child: Element, idx: number): void {
        const el: HTMLElement = child as HTMLElement;
        el.style.flex = '0 0 calc(' + pct + '% - ' + (margin * (show - 1) / show) + 'px)';
        el.style.marginRight = (idx < track!.children.length - 1 ? margin : 0) + 'px';
        el.style.scrollSnapAlign = 'start';
        el.style.boxSizing = 'border-box';
      });
    }
    applyLayout();
    window.addEventListener('resize', applyLayout);
    // Prev / Next buttons
    const prevBtn: HTMLButtonElement = document.createElement('button');
    prevBtn.className = 'carousel-prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.style.cssText = 'position:absolute;top:50%;left:0;transform:translateY(-50%);z-index:2;background:rgba(0,0,0,0.3);color:#fff;border:none;padding:8px 14px;font-size:18px;cursor:pointer;line-height:1;';
    const nextBtn: HTMLButtonElement = document.createElement('button');
    nextBtn.className = 'carousel-next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.style.cssText = 'position:absolute;top:50%;right:0;transform:translateY(-50%);z-index:2;background:rgba(0,0,0,0.3);color:#fff;border:none;padding:8px 14px;font-size:18px;cursor:pointer;line-height:1;';
    prevBtn.addEventListener('click', function (): void { track!.scrollBy({ left: -track!.clientWidth, behavior: 'smooth' }); });
    nextBtn.addEventListener('click', function (): void { track!.scrollBy({ left: track!.clientWidth, behavior: 'smooth' }); });
    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
    // Autoplay
    if (opts.autoplay) {
      const speed: number = opts.autoplaySpeed || 3000;
      let timer: ReturnType<typeof setInterval> | undefined;
      function startAutoplay(): void {
        timer = setInterval(function (): void {
          const max: number = track!.scrollWidth - track!.clientWidth;
          if (track!.scrollLeft >= max) {
            track!.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            track!.scrollBy({ left: track!.clientWidth, behavior: 'smooth' });
          }
        }, speed);
      }
      function stopAutoplay(): void { if (timer) { clearInterval(timer); timer = undefined; } }
      startAutoplay();
      container.addEventListener('mouseenter', stopAutoplay);
      container.addEventListener('mouseleave', startAutoplay);
    }
  }

  //* clientLogo Js
  function clientLogo(): void {
    initCarousel('.client_logo', {
      items: 5,
      margin: 0,
      autoplay: true,
      responsive: { 0: { items: 1 }, 500: { items: 2 }, 800: { items: 3 }, 1000: { items: 4 }, 1199: { items: 5 } },
    });
  }
  //* road_active Js
  function road_active(): void {
    initCarousel('.road_active', {
      items: 1,
      margin: 0,
      autoplay: false,
      responsive: { 0: { items: 1 }, 500: { items: 1 }, 800: { items: 1 }, 1000: { items: 1 }, 1199: { items: 1 } },
    });
  }
  //* feat_active Js
  initCarousel('.feat_active', {
    items: 4,
    margin: 10,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 4 } },
  });

  //* CounDown Js
  /**
   * Countdown timer (replaces dsCountDown)
   */
  function counDown(): void {
    const timerEls: NodeListOf<HTMLElement> = document.querySelectorAll('.timer');
    if (timerEls.length === 0) return;
    const endDate: Date = new Date('December 24, 2020 23:59:00');
    function updateTimers(): void {
      const now: Date = new Date();
      const diff: number = endDate.getTime() - now.getTime();
      if (diff <= 0) {
        timerEls.forEach(function (el: HTMLElement): void { el.innerHTML = '0'; });
        return;
      }
      const days: number = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours: number = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes: number = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds: number = Math.floor((diff % (1000 * 60)) / 1000);
      timerEls.forEach(function (el: HTMLElement): void {
        el.innerHTML = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
      });
    }
    updateTimers();
    setInterval(updateTimers, 1000);
  }

  //* Isotope js
  /**
   * Gallery isotope filter
   */
  function gallery_isotope(): void {
    if (document.querySelector('.grid_gallery_area')) {
      // Activate isotope in container (wait for images)
      const images: HTMLImageElement[] = Array.from(document.querySelectorAll('.grid_gallery_item_inner img'));
      const imagePromises: Promise<void>[] = images.map(function (img: HTMLImageElement): Promise<void> {
        if (img.complete) return Promise.resolve();
        return new Promise(function (resolve: () => void): void {
          img.addEventListener('load', function (): void { resolve(); });
          img.addEventListener('error', function (): void { resolve(); });
        });
      });
      Promise.all(imagePromises).then(function (): void {
        $('.grid_gallery_item_inner').isotope({
          layoutMode: 'fitRows',
        });
      });

      // Add isotope click function
      const filterLis = document.querySelectorAll('.gallery_filter li');
      filterLis.forEach(function (li: Element): void {
        li.addEventListener('click', function (e: Event): void {
          filterLis.forEach(function (l: Element): void {
            l.classList.remove('active');
          });
          li.classList.add('active');
          const selector: string | undefined =
            (li as HTMLElement).dataset.filter || (li as HTMLElement).getAttribute('data-filter') || undefined;
          $('.grid_gallery_item_inner').isotope({
            filter: selector,
            animationOptions: {
              duration: 450,
              easing: 'linear',
              queue: false,
            },
          });
          e.preventDefault();
        });
      });

      //*  Simple LightBox js
      $('.imageGallery1 .light').simpleLightbox();
    }
  }

  //*  Google map js
  const mapBoxEl: HTMLElement | null = document.querySelector('#mapBox');
  if (mapBoxEl) {
    const $lat: number = parseFloat(mapBoxEl.dataset.lat || '0');
    const $lon: number = parseFloat(mapBoxEl.dataset.lon || '0');
    const $zoom: number = parseInt(mapBoxEl.dataset.zoom || '0', 10);
    const $marker: string = mapBoxEl.dataset.marker || '';
    const $info: string = mapBoxEl.dataset.info || '';
    const $markerLat: number = parseFloat(mapBoxEl.dataset.mlat || '0');
    const $markerLon: number = parseFloat(mapBoxEl.dataset.mlon || '0');
    const map = new GMaps({
      el: '#mapBox',
      lat: $lat,
      lng: $lon,
      scrollwheel: false,
      scaleControl: true,
      streetViewControl: false,
      panControl: true,
      disableDoubleClickZoom: true,
      mapTypeControl: false,
      zoom: $zoom,
      styles: [
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#dcdfe6',
            },
          ],
        },
        {
          featureType: 'transit',
          stylers: [
            {
              color: '#808080',
            },
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            {
              visibility: 'on',
            },
            {
              color: '#dcdfe6',
            },
          ],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#ffffff',
            },
          ],
        },
        {
          featureType: 'road.local',
          elementType: 'geometry.fill',
          stylers: [
            {
              visibility: 'on',
            },
            {
              color: '#ffffff',
            },
            {
              weight: 1.8,
            },
          ],
        },
        {
          featureType: 'road.local',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#d7d7d7',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'geometry.fill',
          stylers: [
            {
              visibility: 'on',
            },
            {
              color: '#ebebeb',
            },
          ],
        },
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [
            {
              color: '#a7a7a7',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#ffffff',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#ffffff',
            },
          ],
        },
        {
          featureType: 'landscape',
          elementType: 'geometry.fill',
          stylers: [
            {
              visibility: 'on',
            },
            {
              color: '#efefef',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#696969',
            },
          ],
        },
        {
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [
            {
              visibility: 'on',
            },
            {
              color: '#737373',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#d6d6d6',
            },
          ],
        },
        {
          featureType: 'road',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
        {},
        {
          featureType: 'poi',
          elementType: 'geometry.fill',
          stylers: [
            {
              color: '#dadada',
            },
          ],
        },
      ],
    });

    map.addMarker({
      lat: $markerLat,
      lng: $markerLon,
      icon: $marker,
      infoWindow: {
        content: $info,
      },
    });
  }

  /**
   * Scroll to top button
   */
  function scrollToTop(): void {
    const scrollTopEl: HTMLElement | null = document.querySelector('.scroll-top');
    if (scrollTopEl) {
      window.addEventListener('scroll', function (): void {
        const scroll: number = window.scrollY || document.documentElement.scrollTop;
        if (scroll > 200) {
          scrollTopEl.style.display = 'block';
        } else {
          scrollTopEl.style.display = 'none';
        }
      });
      //Click event to scroll to top
      scrollTopEl.addEventListener('click', function (e: Event): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        e.preventDefault();
      });
    }
  }

  /**
   * Nice select
   */
  function nice_Select(): void {
    if (document.querySelector('.post_select')) {
      $('select').niceSelect();
    }
  }

  /**
   * Preloader
   */
  function preloader(): void {
    const preloaderEl: HTMLElement | null = document.querySelector('#preloader');
    if (preloaderEl) {
      window.addEventListener('load', function (): void {
        preloaderEl.style.display = 'none';
      });
    }
  }

  /*Function Calls*/
  new WOW().init();
  navbarFixed();
  scrollToTop();
  counterUp();
  magnificPopup();
  clientLogo();
  road_active();
  nice_Select();
})();