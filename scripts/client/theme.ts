// Maintainer: richie-rich90454 · June 2026

(function (): void {
  'use strict';

  //* Navbar Fixed
  const top_offset: number = $('.sticky-menu').height()! - 10;
  $('.main-menu nav ul').onePageNav({
    currentClass: 'active',
    scrollOffset: top_offset,
  });

  /**
   * Fixed navbar on scroll
   */
  function navbarFixed(): void {
    if ($('.sticky-menu').length) {
      $(window).on('scroll', function (): void {
        const scroll: number = $(window).scrollTop()!;
        if (scroll >= 295) {
          $('.sticky-menu').addClass('navbar_fixed');
        } else {
          $('.sticky-menu').removeClass('navbar_fixed');
        }
      });
    }
  }
  // meanmenu
  $('#mobile-menu').meanmenu({
    meanMenuContainer: '.mobile-menu',
    meanScreenWidth: '991',
  });
  //* Counter Js
  /**
   * Counter up animation
   */
  function counterUp(): void {
    if ($('.counter_area, .software_count').length) {
      $('.counter').counterUp({
        delay: 10,
        time: 400,
      });
    }
  }

  //* Magnificpopup js
  /**
   * Magnific popup for videos
   */
  function magnificPopup(): void {
    if ($('.popup-youtube').length) {
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
    if ($('.client_logo').length) {
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
    if ($('.road_active').length) {
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
    if ($('.donations_details').length) {
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
    if ($('.grid_gallery_area').length) {
      // Activate isotope in container
      $('.grid_gallery_item_inner').imagesLoaded(function (): void {
        $('.grid_gallery_item_inner').isotope({
          layoutMode: 'fitRows',
        });
      });

      // Add isotope click function
      $('.gallery_filter li').on('click', function (this: HTMLElement): boolean {
        $('.gallery_filter li').removeClass('active');
        $(this).addClass('active');
        const selector: string | undefined = $(this).attr('data-filter');
        $('.grid_gallery_item_inner').isotope({
          filter: selector,
          animationOptions: {
            duration: 450,
            easing: 'linear',
            queue: false,
          },
        });
        return false;
      });

      //*  Simple LightBox js
      $('.imageGallery1 .light').simpleLightbox();
    }
  }

  //*  Google map js
  if ($('#mapBox').length) {
    const $lat: number = $('#mapBox').data('lat');
    const $lon: number = $('#mapBox').data('lon');
    const $zoom: number = $('#mapBox').data('zoom');
    const $marker: string = $('#mapBox').data('marker');
    const $info: string = $('#mapBox').data('info');
    const $markerLat: number = $('#mapBox').data('mlat');
    const $markerLon: number = $('#mapBox').data('mlon');
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
    if ($('.scroll-top').length) {
      $(window).on('scroll', function (this: Window): void {
        if ($(this).scrollTop()! > 200) {
          $('.scroll-top').fadeIn();
        } else {
          $('.scroll-top').fadeOut();
        }
      });
      //Click event to scroll to top
      $('.scroll-top').on('click', function (): boolean {
        $('html, body').animate(
          {
            scrollTop: 0,
          },
          1000
        );
        return false;
      });
    }
  }

  /**
   * Nice select
   */
  function nice_Select(): void {
    if ($('.post_select').length) {
      $('select').niceSelect();
    }
  }

  /**
   * Preloader
   */
  function preloader(): void {
    if ($('#preloader').length) {
      $(window).on('load', function (): void {
        $('#preloader').fadeOut();
        $('#preloader').delay(500).fadeOut('slow');
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