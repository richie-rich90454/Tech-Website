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
   * Magnific popup for videos
   */
  function magnificPopup(): void {
    if (document.querySelector('.popup-youtube')) {
      //Video Popup
      $('.popup-youtube').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
      });
    }
  }

  //* clientLogo Js
  /**
   * Client logo carousel
   */
  function clientLogo(): void {
    if (document.querySelector('.client_logo')) {
      //client_logo
      $('.client_logo').owlCarousel({
        loop: false,
        margin: 0,
        autoplay: true,
        infintite: true,
        items: 5,
        responsiveClass: true,
        responsive: {
          0: {
            items: 1,
          },
          500: {
            items: 2,
          },
          800: {
            items: 3,
          },
          1000: {
            items: 4,
          },
          1199: {
            items: 5,
          },
        },
      });
    }
  }
  //* road_active Js
  /**
   * Road active carousel
   */
  function road_active(): void {
    if (document.querySelector('.road_active')) {
      //road_active
      $('.road_active').owlCarousel({
        loop: false,
        margin: 0,
        autoplay: false,
        autoplaySpeed: 2000,
        infintite: false,
        mouseDrag: true,
        dragEndSpeed: true,
        items: 1,
        responsiveClass: true,
        responsive: {
          0: {
            items: 1,
          },
          500: {
            items: 1,
          },
          800: {
            items: 1,
          },
          1000: {
            items: 1,
          },
          1199: {
            items: 1,
          },
        },
      });
    }
  }

  //feature
  $('.feat_active').owlCarousel({
    loop: true,
    margin: 10,
    infintite: true,
    nav: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 2000,
    items: 4,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 4,
      },
    },
  });

  //* CounDown Js
  /**
   * Countdown timer
   */
  function counDown(): void {
    if (document.querySelector('.donations_details')) {
      $('.timer').dsCountDown({
        endDate: new Date('December 24, 2020 23:59:00'),
      });
    }
  }

  //* Isotope js
  /**
   * Gallery isotope filter
   */
  function gallery_isotope(): void {
    if (document.querySelector('.grid_gallery_area')) {
      // Activate isotope in container
      $('.grid_gallery_item_inner').imagesLoaded(function (): void {
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