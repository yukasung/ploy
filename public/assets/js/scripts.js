$(document).ready(function () {
    'use strict';
    theme.init();
});

$(window).resize(function () {
    theme.resizeEvent();
});

var theme = {
    init: function () {
        theme.setPostNavigationPosition();
        theme.initIsoTope();
        theme.initNavbar();
        theme.initGoogleMap();
        theme.initProgressBar();
        theme.initNavbarPopup();
        theme.initLightGallery();
        theme.initCounter();
        theme.initCheckboxCollapse();
        theme.initCardLinkShare();
        theme.initWOW();
        theme.initOwlCarousel();
        theme.initParallax();
    },
    resizeEvent: function () {
        theme.setPostNavigationPosition();
    },
    parallaxUpdate: function (evt, obj) {
        var vw = $(window).width();
        var vh = $(window).height();
        var st = $(window).scrollTop();
        var sl = $(window).scrollLeft();
        var pos = $(obj).offset();
        var ot = pos.top;
        var ol = pos.left;
        var ow = $(obj).innerWidth();
        var oh = $(obj).innerHeight();

        // Check if element is in viewport
        if (st + vh < ot) return;
        if (st > ot + oh) return;

        var iw = parseInt($(obj).attr('data-parallax-img-width'));
        var ih = parseInt($(obj).attr('data-parallax-img-height'));
        var parallax_ratio = parseFloat($(obj).attr('data-parallax-ratio'));
        parallax_ratio = (isNaN(parallax_ratio)) ? 1 : parallax_ratio;
        var expand_ratio = parseFloat($(obj).attr('data-parallax-expand'));
        expand_ratio = (isNaN(expand_ratio)) ? 1 : expand_ratio;

        // Calculate image size
        var img_wh = ((iw / ih) < (ow / oh));
        var img_ratio = (img_wh) ? (iw / ow) : (ih / oh);
        var fw = iw / img_ratio * expand_ratio;
        var fh = ih / img_ratio * expand_ratio;
        var fsize = fw + 'px ' + fh + 'px';

        // Calculate scroll delta
        var t = Math.abs((ot - vh - st));
        var m = vh + oh;
        var d = t / m;

        // Vertical parallax only - centralizing image horizontally
        var px = ((fw - ow) / 2) * -1;

        // Calculate image position
        var py = 0;
        py = ((fh - oh) * d) * -1;
        var fpos = px + 'px ' + py + 'px';

        // Settings properties
        $(obj).css({
            'background-size': fsize,
            'background-position': fpos
        });
    },
    parallaxUpdateAll: function (evt, cls) {
        $(cls).each(function (idx, obj) {
            theme.parallaxUpdate(null, obj);
        });
    },
    initParallax: function () {
        var cls = '.parallax';
        $(cls).each(function (idx, obj) {
            var url = $(obj).attr('data-parallax-img');
            $(obj).css({
                'background-image': 'url(' + url + ')',
                'background-repeat': 'repeat'
            });
            theme.parallaxUpdate(null, obj);
        });
        $(cls).on('resize', theme.parallaxUpdate);
        $(window).on('scroll', function (evt) {
            theme.parallaxUpdateAll(evt, cls);
        });
        $(window).on('resize', function (evt) {
            theme.parallaxUpdateAll(evt, cls);
        });
    },
    // add animate.css class(es) to the elements to be animated
    setAnimation: function (elem, inOut) {
        // Store all animationend event name in a string.
        // cf animate.css documentation
        var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        elem.each(function () {

            var element = $(this);
            var animationType = 'animated ' + element.data('animation-' + inOut);
            var animationDurations = {};

            if (element.data('animation-duration')) {
                animationDurations['animation-duration'] = element.data('animation-duration');
            }

            if (element.data('animation-delay')) {
                animationDurations['animation-delay'] = element.data('animation-delay');
            }

            if (element.data('animation-offset')) {
                animationDurations['animation-offset'] = element.data('animation-offset');
            }

            element.addClass(animationType).css(animationDurations).one(animationEndEvent, function () {
                element.removeClass(animationType); // remove animate.css Class at the end of the animations
                element.removeAttr('style'); // remove style
            });

        });
    },
    initOwlCarousel: function () {

        var owl = $('.owl-carousel');

        owl.each(function () {

            var currentItem = {};
            var elemsToanim = {};
            var options = $(this).data("owl-carousel-options");
            var defaults = {
                navText: "",
            }

            if (options != undefined) {
                $(this).owlCarousel(options);
            }

            // Fired before current slide change
            $(this).on('change.owl.carousel', function (event) {
                currentItem = $('.owl-item', owl).eq(event.item.index);
                elemsToanim = currentItem.find("[data-animation-out]");
                theme.setAnimation(elemsToanim, 'out');
            });

            var round = 0;
            $(this).on('changed.owl.carousel', function (event) {
                currentItem = $('.owl-item', $(this)).eq(event.item.index);
                elemsToanim = currentItem.find("[data-animation-in]");
                theme.setAnimation(elemsToanim, 'in');
            });

            $(this).on('translated.owl.carousel', function (event) {

                if (event.item.index == (event.page.count - 1)) {
                    if (round < 1) {
                        round++
                        console.log(round);
                    } else {
                        $(this).trigger('stop.owl.autoplay');
                        var owlData = $(this).data('owl.carousel');
                        owlData.settings.autoplay = false; //don't know if both are necessary
                        owlData.options.autoplay = false;
                        $(this).trigger('refresh.owl.carousel');
                    }
                }
            });

            currentItem = $('.owl-item', owl).eq(2);
            elemsToanim = currentItem.find("[data-animation-in]");
            theme.setAnimation(elemsToanim, 'in');

        });



    },
    initIsoTope: function () {

        var $grid = $('.isotope .isotope-grid').isotope();

        // filter functions
        var filterFns = {
            // show if number is greater than 50
            numberGreaterThan50: function () {
                var number = $(this).find('.number').text();
                return parseInt(number, 10) > 50;
            },
            // show if name ends with -ium
            ium: function () {
                var name = $(this).find('.name').text();
                return name.match(/ium$/);
            }
        };

        // bind filter button click
        $('.isotope-filter').on('click', 'a', function () {
            var filterValue = $(this).attr('data-filter');
            // use filterFn if matches value
            filterValue = filterFns[filterValue] || filterValue;
            $grid.isotope({
                filter: filterValue
            });
        });

        // change is-checked class on buttons
        $('.isotope .isotope-filter').each(function (i, buttonGroup) {
            var $buttonGroup = $(buttonGroup);
            $buttonGroup.on('click', 'a', function () {
                $buttonGroup.find('.active').removeClass('active');
                $(this).addClass('active');
            });
        });

    },
    initNavbar: function () {

        $('.navbar-toggler').click(function () {
            $(this).toggleClass('open');
        });

        // Fixed header navigation that auto hides when scroll down
        var currentScrollTop = 0;
        var lastScrollTop = 0;
        $(window).on("scroll", function () {

            if ($(this).scrollTop() >= 5) {
                $('.navbar').addClass('fixed-top');
            } else {
                $('.navbar').removeClass('fixed-top');
            }

            var scrollTop = $(window).scrollTop();
            var navbarHeight = $('.navbar').height();

            currentScrollTop = scrollTop;

            if (lastScrollTop < currentScrollTop && scrollTop > navbarHeight + navbarHeight + 200) {
                // scroll down
                $(".navbar").addClass("scroll-up");
            } else if (lastScrollTop > currentScrollTop && !(scrollTop <= navbarHeight)) {
                // scrool up
                $(".navbar").removeClass("scroll-up");
            }

            // if ($(this).scrollTop() < 300 && $(".navbar").hasClass('fixed-top')) {
            //     $(".navbar").removeClass('fixed-top');
            // }

            lastScrollTop = currentScrollTop;

        });

        /*-----------------------------------------------------------------------------------*/
        /*  NAV VERTICAL
        /*-----------------------------------------------------------------------------------*/

        $('.nav-vertical .nav-item').click(function () {
            $(this).toggleClass('show');
        });

        $(".nav-vertical a").click(function (event) {
            if ($(this).next('ul').length) {
                event.preventDefault();
                $(this).next().toggle('fast');
                $(this).children('i:last-child').toggleClass('fa-caret-down fa-caret-left');
            }
        });

    },
    initGoogleMap: function () {

        (function ($, window, document, undefined) {
            var $window = $(window),
                mapInstances = [],
                $pluginInstance = $('.google-map').lazyLoadGoogleMaps({
                    callback: function (container, map) {
                        var $container = $(container),
                            center = new google.maps.LatLng($container.attr('data-lat'), $container.attr('data-lng'));

                        map.setOptions({
                            center: center,
                            zoom: 15,
                            zoomControl: true,
                            zoomControlOptions: {
                                style: google.maps.ZoomControlStyle.DEFAULT,
                            },
                            disableDoubleClickZoom: false,
                            mapTypeControl: true,
                            mapTypeControlOptions: {
                                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                            },
                            scaleControl: true,
                            scrollwheel: false,
                            streetViewControl: true,
                            draggable: true,
                            overviewMapControl: false,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            styles: [{
                                stylers: [{
                                    saturation: -100
                                }, {
                                    gamma: 1
                                }]
                            }, {
                                elementType: "labels.text.stroke",
                                stylers: [{
                                    visibility: "off"
                                }]
                            }, {
                                featureType: "poi.business",
                                elementType: "labels.text",
                                stylers: [{
                                    visibility: "off"
                                }]
                            }, {
                                featureType: "poi.business",
                                elementType: "labels.icon",
                                stylers: [{
                                    visibility: "off"
                                }]
                            }, {
                                featureType: "poi.place_of_worship",
                                elementType: "labels.text",
                                stylers: [{
                                    visibility: "off"
                                }]
                            }, {
                                featureType: "poi.place_of_worship",
                                elementType: "labels.icon",
                                stylers: [{
                                    visibility: "off"
                                }]
                            }, {
                                featureType: "road",
                                elementType: "geometry",
                                stylers: [{
                                    visibility: "simplified"
                                }]
                            }, {
                                featureType: "water",
                                stylers: [{
                                    visibility: "on"
                                }, {
                                    saturation: 50
                                }, {
                                    gamma: 0
                                }, {
                                    hue: "#50a5d1"
                                }]
                            }, {
                                featureType: "administrative.neighborhood",
                                elementType: "labels.text.fill",
                                stylers: [{
                                    color: "#333333"
                                }]
                            }, {
                                featureType: "road.local",
                                elementType: "labels.text",
                                stylers: [{
                                    weight: 0.5
                                }, {
                                    color: "#333333"
                                }]
                            }, {
                                featureType: "transit.station",
                                elementType: "labels.icon",
                                stylers: [{
                                    gamma: 1
                                }, {
                                    saturation: 50
                                }]
                            }]
                        });
                        new google.maps.Marker({
                            position: center,
                            map: map
                        });

                        $.data(map, 'center', center);
                        mapInstances.push(map);

                        var updateCenter = function () {
                            $.data(map, 'center', map.getCenter());
                        };
                        google.maps.event.addListener(map, 'dragend', updateCenter);
                        google.maps.event.addListener(map, 'zoom_changed', updateCenter);
                        google.maps.event.addListenerOnce(map, 'idle', function () {
                            $container.addClass('is-loaded');
                        });
                    }
                });

            $window.on('resize', $pluginInstance.debounce(1000, function () {
                $.each(mapInstances, function () {
                    this.setCenter($.data(this, 'center'));
                });
            }));

        })(jQuery, window, document);

    },
    initProgressBar: function () {

        $(".progress-bar").each(function (i) {

            var progressDelay = 200;

            $(this).appear(function () {
                $(this).delay(progressDelay * i).animate({
                    width: $(this).attr('aria-valuenow') + '%'
                }, progressDelay);
            });

            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: progressDelay,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now) + '%');
                }
            });

        });

    },
    initNavbarPopup: function () {

        $('a[data-toggle="navbar-popup"]').on("click", function (e) {

            var target = $(this).attr("data-target");
            var btnClose = $(target).find('.btn-close');
            var lblTitle = $(target).find('.popup-title');

            e.preventDefault();
            $(target).show();

            setTimeout(function () {
                $(target).addClass("visible");
            }, 100);
            setTimeout(function () {
                lblTitle.addClass("visible");
            }, 600);
            setTimeout(function () {
                btnClose.addClass("visible");
            }, 800);

            btnClose.bind("click", function () {
                $(target).removeClass("visible");
                setTimeout(function () {
                    $(target).hide();
                    btnClose.removeClass("visible");
                    lblTitle.removeClass("visible");
                }, 300);
            });

        });

    },
    initLightGallery: function () {

        $('.light-gallery').lightGallery({
            thumbnail: true,
            selector: '.lgitem',
            animateThumb: true,
            showThumbByDefault: false,
            download: false,
            autoplayControls: false,
            thumbWidth: 100,
            thumbContHeight: 80,
            videoMaxWidth: '1000px'
        });

        $('.video-gallery').lightGallery();

    },
    initCounter: function () {

        $(".counter").appear(function () {
            $(this).children('span').countTo();
        });

    },
    initCheckboxCollapse: function () {

        $('.checkbox-collapse .custom-checkbox').on('click', function (e) {

            if ($(this).find('input[type=checkbox]').prop('checked')) {
                $(this).parent().find('.collapse').collapse('show');
            } else {
                $(this).parent().find('.collapse').collapse('hide');
            }

            e.stopPropagation();
        })

    },
    initCardLinkShare: function () {

        $(".card-link-share").click(function () {
            var cardSocial = $(this).closest("div").find(".card-social");
            cardSocial.toggleClass("active");
            return false;
        });

    },
    initWOW: function () {
        new WOW().init();
    },
    setPostNavigationPosition: function () {

        var navbarHeight = $('.navbar').height();
        $('.navbar .nav-item > .nav-link').css('line-height', navbarHeight + 'px');
        // $('.navbar-action').css('top', (navbarHeight / 2) - 22 + 'px');

    }
};