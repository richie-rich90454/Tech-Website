"use strict";
(() => {
  (function() {
    "use strict";
    const top_offset = $(".sticky-menu").height() - 10;
    $(".main-menu nav ul").onePageNav({
      currentClass: "active",
      scrollOffset: top_offset
    });
    function navbarFixed() {
      if ($(".sticky-menu").length) {
        $(window).on("scroll", function() {
          const scroll = $(window).scrollTop();
          if (scroll >= 295) {
            $(".sticky-menu").addClass("navbar_fixed");
          } else {
            $(".sticky-menu").removeClass("navbar_fixed");
          }
        });
      }
    }
    $("#mobile-menu").meanmenu({
      meanMenuContainer: ".mobile-menu",
      meanScreenWidth: "991"
    });
    function counterUp() {
      if ($(".counter_area, .software_count").length) {
        $(".counter").counterUp({
          delay: 10,
          time: 400
        });
      }
    }
    function magnificPopup() {
      if ($(".popup-youtube").length) {
        $(".popup-youtube").magnificPopup({
          disableOn: 700,
          type: "iframe",
          mainClass: "mfp-fade",
          removalDelay: 160,
          preloader: false,
          fixedContentPos: false
        });
      }
    }
    function clientLogo() {
      if ($(".client_logo").length) {
        $(".client_logo").owlCarousel({
          loop: false,
          margin: 0,
          autoplay: true,
          infintite: true,
          items: 5,
          responsiveClass: true,
          responsive: {
            0: {
              items: 1
            },
            500: {
              items: 2
            },
            800: {
              items: 3
            },
            1e3: {
              items: 4
            },
            1199: {
              items: 5
            }
          }
        });
      }
    }
    function road_active() {
      if ($(".road_active").length) {
        $(".road_active").owlCarousel({
          loop: false,
          margin: 0,
          autoplay: false,
          autoplaySpeed: 2e3,
          infintite: false,
          mouseDrag: true,
          dragEndSpeed: true,
          items: 1,
          responsiveClass: true,
          responsive: {
            0: {
              items: 1
            },
            500: {
              items: 1
            },
            800: {
              items: 1
            },
            1e3: {
              items: 1
            },
            1199: {
              items: 1
            }
          }
        });
      }
    }
    $(".feat_active").owlCarousel({
      loop: true,
      margin: 10,
      infintite: true,
      nav: false,
      dots: true,
      autoplay: true,
      autoplaySpeed: 2e3,
      items: 4,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        1e3: {
          items: 4
        }
      }
    });
    function counDown() {
      if ($(".donations_details").length) {
        $(".timer").dsCountDown({
          endDate: /* @__PURE__ */ new Date("December 24, 2020 23:59:00")
        });
      }
    }
    function gallery_isotope() {
      if ($(".grid_gallery_area").length) {
        $(".grid_gallery_item_inner").imagesLoaded(function() {
          $(".grid_gallery_item_inner").isotope({
            layoutMode: "fitRows"
          });
        });
        $(".gallery_filter li").on("click", function() {
          $(".gallery_filter li").removeClass("active");
          $(this).addClass("active");
          const selector = $(this).attr("data-filter");
          $(".grid_gallery_item_inner").isotope({
            filter: selector,
            animationOptions: {
              duration: 450,
              easing: "linear",
              queue: false
            }
          });
          return false;
        });
        $(".imageGallery1 .light").simpleLightbox();
      }
    }
    if ($("#mapBox").length) {
      const $lat = $("#mapBox").data("lat");
      const $lon = $("#mapBox").data("lon");
      const $zoom = $("#mapBox").data("zoom");
      const $marker = $("#mapBox").data("marker");
      const $info = $("#mapBox").data("info");
      const $markerLat = $("#mapBox").data("mlat");
      const $markerLon = $("#mapBox").data("mlon");
      const map = new GMaps({
        el: "#mapBox",
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
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#dcdfe6"
              }
            ]
          },
          {
            featureType: "transit",
            stylers: [
              {
                color: "#808080"
              },
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
              {
                visibility: "on"
              },
              {
                color: "#dcdfe6"
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#ffffff"
              }
            ]
          },
          {
            featureType: "road.local",
            elementType: "geometry.fill",
            stylers: [
              {
                visibility: "on"
              },
              {
                color: "#ffffff"
              },
              {
                weight: 1.8
              }
            ]
          },
          {
            featureType: "road.local",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#d7d7d7"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "geometry.fill",
            stylers: [
              {
                visibility: "on"
              },
              {
                color: "#ebebeb"
              }
            ]
          },
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [
              {
                color: "#a7a7a7"
              }
            ]
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#ffffff"
              }
            ]
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#ffffff"
              }
            ]
          },
          {
            featureType: "landscape",
            elementType: "geometry.fill",
            stylers: [
              {
                visibility: "on"
              },
              {
                color: "#efefef"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#696969"
              }
            ]
          },
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [
              {
                visibility: "on"
              },
              {
                color: "#737373"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#d6d6d6"
              }
            ]
          },
          {
            featureType: "road",
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {},
          {
            featureType: "poi",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#dadada"
              }
            ]
          }
        ]
      });
      map.addMarker({
        lat: $markerLat,
        lng: $markerLon,
        icon: $marker,
        infoWindow: {
          content: $info
        }
      });
    }
    function scrollToTop() {
      if ($(".scroll-top").length) {
        $(window).on("scroll", function() {
          if ($(this).scrollTop() > 200) {
            $(".scroll-top").fadeIn();
          } else {
            $(".scroll-top").fadeOut();
          }
        });
        $(".scroll-top").on("click", function() {
          $("html, body").animate(
            {
              scrollTop: 0
            },
            1e3
          );
          return false;
        });
      }
    }
    function nice_Select() {
      if ($(".post_select").length) {
        $("select").niceSelect();
      }
    }
    function preloader() {
      if ($("#preloader").length) {
        $(window).on("load", function() {
          $("#preloader").fadeOut();
          $("#preloader").delay(500).fadeOut("slow");
        });
      }
    }
    new WOW().init();
    navbarFixed();
    scrollToTop();
    counterUp();
    magnificPopup();
    clientLogo();
    road_active();
    nice_Select();
  })();
})();
