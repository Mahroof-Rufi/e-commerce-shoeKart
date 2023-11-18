// Main Js File
$(document).ready(function () {
    'use strict';

    owlCarousels();
    quantityInputs();

    // Header Search Toggle

    var $searchWrapper = $('.header-search-wrapper'),
    	$body = $('body'),
        $searchToggle = $('.search-toggle');

	$searchToggle.on('click', function (e) {
		$searchWrapper.toggleClass('show');
		$(this).toggleClass('active');
		$searchWrapper.find('input').focus();
		e.preventDefault();
	});

	$body.on('click', function (e) {
		if ( $searchWrapper.hasClass('show') ) {
			$searchWrapper.removeClass('show');
			$searchToggle.removeClass('active');
			$body.removeClass('is-search-active');
		}
	});

	$('.header-search').on('click', function (e) {
		e.stopPropagation();
	});

	// Sticky header 
    var catDropdown = $('.category-dropdown'),
        catInitVal = catDropdown.data('visible');
        
	if ( $('.sticky-header').length && $(window).width() >= 992 ) {
		var sticky = new Waypoint.Sticky({
			element: $('.sticky-header')[0],
			stuckClass: 'fixed',
			offset: -300,
            handler: function ( direction ) {
                // Show category dropdown
                if ( catInitVal &&  direction == 'up') {
                    catDropdown.addClass('show').find('.dropdown-menu').addClass('show');
                    catDropdown.find('.dropdown-toggle').attr('aria-expanded', 'true');
                    return false;
                }

                // Hide category dropdown on fixed header
                if ( catDropdown.hasClass('show') ) {
                    catDropdown.removeClass('show').find('.dropdown-menu').removeClass('show');
                    catDropdown.find('.dropdown-toggle').attr('aria-expanded', 'false');
                } 
            }
		});
	}

    // Menu init with superfish plugin
    if ( $.fn.superfish ) {
        $('.menu, .menu-vertical').superfish({
            popUpSelector: 'ul, .megamenu',
            hoverClass: 'show',
            delay: 0,
            speed: 80,
            speedOut: 80 ,
            autoArrows: true
        });
    }

	// Mobile Menu Toggle - Show & Hide
    $('.mobile-menu-toggler').on('click', function (e) {
		$body.toggleClass('mmenu-active');
		$(this).toggleClass('active');
		e.preventDefault();
    });

    $('.mobile-menu-overlay, .mobile-menu-close').on('click', function (e) {
		$body.removeClass('mmenu-active');
		$('.menu-toggler').removeClass('active');
		e.preventDefault();
    });

	// Add Mobile menu icon arrows to items with children
    $('.mobile-menu').find('li').each(function () {
        var $this = $(this);

        if ( $this.find('ul').length ) {
            $('<span/>', {
                'class': 'mmenu-btn'
            }).appendTo($this.children('a'));
        }
    });

    // Mobile Menu toggle children menu
    $('.mmenu-btn').on('click', function (e) {
        var $parent = $(this).closest('li'),
            $targetUl = $parent.find('ul').eq(0);

            if ( !$parent.hasClass('open') ) {
                $targetUl.slideDown(300, function () {
                    $parent.addClass('open');
                });
            } else {
                $targetUl.slideUp(300, function () {
                    $parent.removeClass('open');
                });
            }

        e.stopPropagation();
        e.preventDefault();
    });

	// Sidebar Filter - Show & Hide
    var $sidebarToggler = $('.sidebar-toggler');
    $sidebarToggler.on('click', function (e) {
		$body.toggleClass('sidebar-filter-active');
		$(this).toggleClass('active');
		e.preventDefault();
    });

    $('.sidebar-filter-overlay').on('click', function (e) {
		$body.removeClass('sidebar-filter-active');
		$sidebarToggler.removeClass('active');
		e.preventDefault();
    });

    // Clear All checkbox/remove filters in sidebar filter
    $('.sidebar-filter-clear').on('click', function (e) {
    	$('.sidebar-shop').find('input').prop('checked', false);

    	e.preventDefault();
    });

    // Popup - Iframe Video - Map etc.
    if ( $.fn.magnificPopup ) {
        $('.btn-iframe').magnificPopup({
            type: 'iframe',
            removalDelay: 600,
            preloader: false,
            fixedContentPos: false,
            closeBtnInside: false
        });
    }

    // Product hover
    if ( $.fn.hoverIntent ) {
        $('.product-3').hoverIntent(function () {
            var $this = $(this),
                animDiff = ( $this.outerHeight() - ( $this.find('.product-body').outerHeight() + $this.find('.product-media').outerHeight()) ),
                animDistance = ( $this.find('.product-footer').outerHeight() - animDiff );

            $this.find('.product-footer').css({ 'visibility': 'visible', 'transform': 'translateY(0)' });
            $this.find('.product-body').css('transform', 'translateY('+ -animDistance +'px)');

        }, function () {
            var $this = $(this);

            $this.find('.product-footer').css({ 'visibility': 'hidden', 'transform': 'translateY(100%)' });
            $this.find('.product-body').css('transform', 'translateY(0)');
        });
    }

    // Slider For category pages / filter price
    if ( typeof noUiSlider === 'object' ) {
		var priceSlider  = document.getElementById('price-slider');

		// Check if #price-slider elem is exists if not return
		// to prevent error logs
		if (priceSlider == null) return;

		noUiSlider.create(priceSlider, {
			start: [ 0, 10000 ],
			connect: true,
			step: 100,
			margin: 500,
			range: {
				'min': 0,
				'max': 10000
			},
			tooltips: true,
			format: wNumb({
		        decimals: 0,
		        prefix: '₹'
		    })
		});

		// Update Price Range
		priceSlider.noUiSlider.on('update', function( values, handle ){
			$('#filter-price-range').text(values.join(' - '));
            let selectedMaxPrice = values[1]; // The second value is the maximum price
            let numericValue = selectedMaxPrice.replace(/[^0-9]/g, '');
            $('#selected-max-price').val(numericValue);
		});
	}

	// Product countdown
	if ( $.fn.countdown ) {
		$('.product-countdown').each(function () {
			var $this = $(this), 
				untilDate = $this.data('until'),
				compact = $this.data('compact'),
                dateFormat = ( !$this.data('format') ) ? 'DHMS' : $this.data('format'),
                newLabels = ( !$this.data('labels-short') ) ? 
                                ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'] :
                                ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Mins', 'Secs'],
                newLabels1 = ( !$this.data('labels-short') ) ? 
                                ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'] :
                                ['Year', 'Month', 'Week', 'Day', 'Hour', 'Min', 'Sec'];

            var newDate;

            // Split and created again for ie and edge 
            if ( !$this.data('relative') ) {
                var untilDateArr = untilDate.split(", "), // data-until 2019, 10, 8 - yy,mm,dd
                    newDate = new Date(untilDateArr[0], untilDateArr[1] - 1, untilDateArr[2]);
            } else {
                newDate = untilDate;
            }

			$this.countdown({
			    until: newDate,
			    format: dateFormat,
			    padZeroes: true,
			    compact: compact,
			    compactLabels: ['y', 'm', 'w', ' days,'],
			    timeSeparator: ' : ',
                labels: newLabels,
                labels1: newLabels1

			});
		});

		// Pause
		// $('.product-countdown').countdown('pause');
	}

	// Quantity Input - Cart page - Product Details pages
    function quantityInputs() {
        if ( $.fn.inputSpinner ) {
            $("input[type='number']").inputSpinner({
                decrementButton: '<i class="icon-minus"></i>',
                incrementButton: '<i class="icon-plus"></i>',
                groupClass: 'input-spinner',
                buttonsClass: 'btn-spinner',
                buttonsWidth: '26px'
            });
        }
    }

    // Sticky Content - Sidebar - Social Icons etc..
    // Wrap elements with <div class="sticky-content"></div> if you want to make it sticky
    if ( $.fn.stick_in_parent && $(window).width() >= 992 ) {
    	$('.sticky-content').stick_in_parent({
			offset_top: 80,
            inner_scrolling: false
		});
    }

    function owlCarousels($wrap, options) {
        if ( $.fn.owlCarousel ) {
            var owlSettings = {
                items: 1,
                loop: true,
                margin: 0,
                responsiveClass: true,
                nav: true,
                navText: ['<i class="icon-angle-left">', '<i class="icon-angle-right">'],
                dots: true,
                smartSpeed: 400,
                autoplay: false,
                autoplayTimeout: 15000
            };
            if (typeof $wrap == 'undefined') {
                $wrap = $('body');
            }
            if (options) {
                owlSettings = $.extend({}, owlSettings, options);
            }

            // Init all carousel
            $wrap.find('[data-toggle="owl"]').each(function () {
                var $this = $(this),
                    newOwlSettings = $.extend({}, owlSettings, $this.data('owl-options'));

                $this.owlCarousel(newOwlSettings);
                
            });   
        }
    }

    // Product Image Zoom plugin - product pages
    if ( $.fn.elevateZoom ) {
        $('#product-zoom').elevateZoom({
            gallery:'product-zoom-gallery',
            galleryActiveClass: 'active',
            zoomType: "inner",
            cursor: "crosshair",
            zoomWindowFadeIn: 400,
            zoomWindowFadeOut: 400,
            responsive: true
        });

        // On click change thumbs active item
        $('.product-gallery-item').on('click', function (e) {
            $('#product-zoom-gallery').find('a').removeClass('active');
            $(this).addClass('active');

            e.preventDefault();
        });

        var ez = $('#product-zoom').data('elevateZoom');

        // Open popup - product images
        $('#btn-product-gallery').on('click', function (e) {
            if ( $.fn.magnificPopup ) {
                $.magnificPopup.open({
                    items: ez.getGalleryList(),
                    type: 'image',
                    gallery:{
                        enabled:true
                    },
                    fixedContentPos: false,
                    removalDelay: 600,
                    closeBtnInside: false
                }, 0);

                e.preventDefault();
            }
        });
    }

    // Product Gallery - product-gallery.html 
    if ( $.fn.owlCarousel && $.fn.elevateZoom ) {
        var owlProductGallery = $('.product-gallery-carousel');

        owlProductGallery.on('initialized.owl.carousel', function () {
            owlProductGallery.find('.active img').elevateZoom({
                zoomType: "inner",
                cursor: "crosshair",
                zoomWindowFadeIn: 400,
                zoomWindowFadeOut: 400,
                responsive: true
            });
        });

        owlProductGallery.owlCarousel({
            loop: false,
            margin: 0,
            responsiveClass: true,
            nav: true,
            navText: ['<i class="icon-angle-left">', '<i class="icon-angle-right">'],
            dots: false,
            smartSpeed: 400,
            autoplay: false,
            autoplayTimeout: 15000,
            responsive: {
                0: {
                    items: 1
                },
                560: {
                    items: 2
                },
                992: {
                    items: 3
                },
                1200: {
                    items: 3
                }
            }
        });

        owlProductGallery.on('change.owl.carousel', function () {
            $('.zoomContainer').remove();
        });

        owlProductGallery.on('translated.owl.carousel', function () {
            owlProductGallery.find('.active img').elevateZoom({
                zoomType: "inner",
                cursor: "crosshair",
                zoomWindowFadeIn: 400,
                zoomWindowFadeOut: 400,
                responsive: true
            });
        });
    }

     // Product Gallery Separeted- product-sticky.html 
    if ( $.fn.elevateZoom ) {
        $('.product-separated-item').find('img').elevateZoom({
            zoomType: "inner",
            cursor: "crosshair",
            zoomWindowFadeIn: 400,
            zoomWindowFadeOut: 400,
            responsive: true
        });

        // Create Array for gallery popup
        var galleryArr = [];
        $('.product-gallery-separated').find('img').each(function () {
            var $this = $(this),
                imgSrc = $this.attr('src'),
                imgTitle= $this.attr('alt'),
                obj = {'src': imgSrc, 'title': imgTitle };

            galleryArr.push(obj);
        })

        $('#btn-separated-gallery').on('click', function (e) {
            if ( $.fn.magnificPopup ) {
                $.magnificPopup.open({
                    items: galleryArr,
                    type: 'image',
                    gallery:{
                        enabled:true
                    },
                    fixedContentPos: false,
                    removalDelay: 600,
                    closeBtnInside: false
                }, 0);

                e.preventDefault();
            }
        });
    }

    // Checkout discount input - toggle label if input is empty etc...
    $('#checkout-discount-input').on('focus', function () {
        // Hide label on focus
        $(this).parent('form').find('label').css('opacity', 0);
    }).on('blur', function () {
        // Check if input is empty / toggle label
        var $this = $(this);

        if( $this.val().length !== 0 ) {
            $this.parent('form').find('label').css('opacity', 0);
        } else {
            $this.parent('form').find('label').css('opacity', 1);
        }
    });

    // Dashboard Page Tab Trigger
    $('.tab-trigger-link').on('click', function (e) {
    	var targetHref = $(this).attr('href');

    	$('.nav-dashboard').find('a[href="'+targetHref+'"]').trigger('click');

    	e.preventDefault();
    });

    // Masonry / Grid layout fnction
	function layoutInit( container, selector) {
		$(container).each(function () {
            var $this = $(this);

            $this.isotope({
                itemSelector: selector,
                layoutMode: ( $this.data('layout') ? $this.data('layout'): 'masonry' )
            });
        });
	}
 
	function isotopeFilter ( filterNav, container) {
		$(filterNav).find('a').on('click', function(e) {
			var $this = $(this),
				filter = $this.attr('data-filter');

			// Remove active class
			$(filterNav).find('.active').removeClass('active');

			// Init filter
			$(container).isotope({
				filter: filter,
				transitionDuration: '0.7s'
			});
			
			// Add active class
			$this.closest('li').addClass('active');
			e.preventDefault();
		});
	}

    /* Masonry / Grid Layout & Isotope Filter for blog/portfolio etc... */
    if ( typeof imagesLoaded === 'function' && $.fn.isotope) {
        // Portfolio
        $('.portfolio-container').imagesLoaded(function () {
            // Portfolio Grid/Masonry
            layoutInit( '.portfolio-container', '.portfolio-item' ); // container - selector
            // Portfolio Filter
            isotopeFilter( '.portfolio-filter',  '.portfolio-container'); //filterNav - .container
        });

        // Blog
        $('.entry-container').imagesLoaded(function () {
            // Blog Grid/Masonry
            layoutInit( '.entry-container', '.entry-item' ); // container - selector
            // Blog Filter
            isotopeFilter( '.entry-filter',  '.entry-container'); //filterNav - .container
        });

        // Product masonry product-masonry.html
        $('.product-gallery-masonry').imagesLoaded(function () {
            // Products Grid/Masonry
            layoutInit( '.product-gallery-masonry', '.product-gallery-item' ); // container - selector
        });

        // Products - Demo 11
        $('.products-container').imagesLoaded(function () {
            // Products Grid/Masonry
            layoutInit( '.products-container', '.product-item' ); // container - selector
            // Product Filter
            isotopeFilter( '.product-filter',  '.products-container'); //filterNav - .container
        });
    }

	// Count
    var $countItem = $('.count');
	if ( $.fn.countTo ) {
        if ($.fn.waypoint) {
            $countItem.waypoint( function () {
                $(this.element).countTo();
            }, {
                offset: '90%',
                triggerOnce: true 
            });
        } else {
            $countItem.countTo();
        }    
    } else { 
        // fallback
        // Get the data-to value and add it to element
        $countItem.each(function () {
            var $this = $(this),
                countValue = $this.data('to');
            $this.text(countValue);
        });
    }

    // Scroll To button
    var $scrollTo = $('.scroll-to');
    // If button scroll elements exists
    if ( $scrollTo.length ) {
        // Scroll to - Animate scroll
        $scrollTo.on('click', function(e) {
            var target = $(this).attr('href'),
                $target = $(target);
            if ($target.length) {
                // Add offset for sticky menu
                var scrolloffset = ( $(window).width() >= 992 ) ? ($target.offset().top - 52) : $target.offset().top
                $('html, body').animate({
                    'scrollTop': scrolloffset
                }, 600);
                e.preventDefault();
            }
        });
    }

    // Review tab/collapse show + scroll to tab
    $('#review-link').on('click', function (e) {
        var target = $(this).attr('href'),
            $target = $(target);

        if ( $('#product-accordion-review').length ) {
            $('#product-accordion-review').collapse('show');
        }

        if ($target.length) {
            // Add offset for sticky menu
            var scrolloffset = ( $(window).width() >= 992 ) ? ($target.offset().top - 72) : ( $target.offset().top - 10 )
            $('html, body').animate({
                'scrollTop': scrolloffset
            }, 600);

            $target.tab('show');
        }

    	e.preventDefault();
    });

	// Scroll Top Button - Show
    var $scrollTop = $('#scroll-top');

    $(window).on('load scroll', function() {
        if ( $(window).scrollTop() >= 400 ) {
            $scrollTop.addClass('show');
        } else {
            $scrollTop.removeClass('show');
        }
    });

    // On click animate to top
    $scrollTop.on('click', function (e) {
        $('html, body').animate({
            'scrollTop': 0
        }, 800);
        e.preventDefault();
    });

    // Google Map api v3 - Map for contact pages
    if ( document.getElementById("map") && typeof google === "object" ) {

        var content =   '<address>' +
                            '88 Pine St,<br>' +
                            'New York, NY 10005, USA<br>'+
                            '<a href="#" class="direction-link" target="_blank">Get Directions <i class="icon-angle-right"></i></a>'+
                        '</address>';

        var latLong = new google.maps.LatLng(40.8127911,-73.9624553);

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: latLong, // Map Center coordinates
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP

        });

        var infowindow = new google.maps.InfoWindow({
            content: content,
            maxWidth: 360
        });

        var marker;
        marker = new google.maps.Marker({
            position: latLong,
            map: map,
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(marker, 'click', (function (marker) {
            return function() {
              infowindow.open(map, marker);
            }
        })(marker));
    }

    var $viewAll = $('.view-all-demos');
    $viewAll.on('click', function (e) {
        e.preventDefault();
        $('.demo-item.hidden').addClass('show');
        $(this).addClass('disabled-hidden');
    })

    var $megamenu = $('.megamenu-container .sf-with-ul');
    $megamenu.hover(function() {
        $('.demo-item.show').addClass('hidden');
        $('.demo-item.show').removeClass('show');
        $viewAll.removeClass('disabled-hidden');
    });

    // Product quickView popup
    $('.btn-quickview').on('click', function (e) {
        var ajaxUrl = $(this).attr('href');
        if ( $.fn.magnificPopup ) {
            setTimeout(function () {
                $.magnificPopup.open({
                    type: 'ajax',
                    mainClass: "mfp-ajax-product",
                    tLoading: '',
                    preloader: false,
                    removalDelay: 350,
                    items: {
                      src: ajaxUrl
                    },
                    callbacks: {
                        ajaxContentAdded: function () {
                            owlCarousels($('.quickView-content'), {
                                onTranslate: function(e) {
                                    var $this = $(e.target),
                                        currentIndex = ($this.data('owl.carousel').current() + e.item.count - Math.ceil(e.item.count / 2)) % e.item.count;
                                    $('.quickView-content .carousel-dot').eq(currentIndex).addClass('active').siblings().removeClass('active');
                                }
                            });
                            quantityInputs();
                        },
                        open: function() {
                            $('body').css('overflow-x', 'visible');
                            $('.sticky-header.fixed').css('padding-right', '1.7rem');
                        },
                        close: function() {
                            $('body').css('overflow-x', 'hidden');
                            $('.sticky-header.fixed').css('padding-right', '0');
                        }
                    },

                    ajax: {
                        tError: '',
                    }
                }, 0);
            }, 500);

            e.preventDefault();
        }
    });
    $('body').on('click', '.carousel-dot', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });

    $('body').on('click', '.btn-fullscreen', function(e) {
        var galleryArr = [];
        $(this).parents('.owl-stage-outer').find('.owl-item:not(.cloned)').each(function() {
            var $this = $(this).find('img'),
                imgSrc = $this.attr('src'),
                imgTitle= $this.attr('alt'),
                obj = {'src': imgSrc, 'title': imgTitle };
            galleryArr.push(obj);
        });

        var ajaxUrl = $(this).attr('href');

        var mpInstance = $.magnificPopup.instance;
        if (mpInstance.isOpen)
            mpInstance.close();

        setTimeout(function () {
            $.magnificPopup.open({
                type: 'ajax',
                mainClass: "mfp-ajax-product",
                tLoading: '',
                preloader: false,
                removalDelay: 350,
                items: {
                  src: ajaxUrl
                },
                callbacks: {
                    ajaxContentAdded: function () {
                        owlCarousels($('.quickView-content'), {
                            onTranslate: function(e) {
                                var $this = $(e.target),
                                    currentIndex = ($this.data('owl.carousel').current() + e.item.count - Math.ceil(e.item.count / 2)) % e.item.count;
                                $('.quickView-content .carousel-dot').eq(currentIndex).addClass('active').siblings().removeClass('active');
                                $('.curidx').html(currentIndex + 1);
                            }
                        });
                        quantityInputs();
                    },
                    open: function() {
                        $('body').css('overflow-x', 'visible');
                        $('.sticky-header.fixed').css('padding-right', '1.7rem');
                    },
                    close: function() {
                        $('body').css('overflow-x', 'hidden');
                        $('.sticky-header.fixed').css('padding-right', '0');
                    }
                },

                ajax: {
                    tError: '',
                }
            }, 0);
        }, 500);
        
        e.preventDefault();
    });

    if(document.getElementById('newsletter-popup-form')) {
        setTimeout(function() {
            var mpInstance = $.magnificPopup.instance;
            if (mpInstance.isOpen) {
                mpInstance.close();
            }

            setTimeout(function() {
                $.magnificPopup.open({
                    items: {
                        src: '#newsletter-popup-form'
                    },
                    type: 'inline',
                    removalDelay: 350,
                    callbacks: {
                        open: function() {
                            $('body').css('overflow-x', 'visible');
                            $('.sticky-header.fixed').css('padding-right', '1.7rem');
                        },
                        close: function() {
                            $('body').css('overflow-x', 'hidden');
                            $('.sticky-header.fixed').css('padding-right', '0');
                        }
                    }
                });
            }, 500)
        }, 10000)
    }
});

function addToCart(id) {
    console.log("add to cart function started");
    $.ajax({
        method: 'post',
        url: '/add_to_cart', 
        data: JSON.stringify({id:id}),
        contentType: 'application/json',
        xhrFields: {
            withCredentials: true // Include session cookies
        },
        success: function (response) {
            if(response.result===true){
                $('#headerCart').load('/ #headerCart'); 
                Swal.fire({
                    title: 'success',
                    text: 'product added to cart',
                    icon: 'success',
                    confirmButtonText: 'OK'
                  });
            }else{
                Swal.fire({
                    title: 'Error',
                    text: 'Product is out of stock',
                    icon: 'error', // Use 'error' for an error message
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (error) {

            console.error(error);
        }
    });
}

function addToWishlist (productId) {
    const URL = `/add_to_wishlist?id=${productId}`;
    console.log("add to wishlist function started");
    $.ajax({
        method: 'get',
        url: URL,  
        contentType: 'application/json',
        xhrFields: {
            withCredentials: true
        }, 
        success: function (response) {
            if(response.success === true){
                Swal.fire({
                    title: 'success',
                    text: 'product added to wishlist',
                    icon: 'success',
                    confirmButtonText: 'OK'
                  });
            } else {
                window.location.href = '/login';
            }
        },
        error: function (error) {

            console.error(error);
        }
    });
}

function deleteFromCart(id) {
    console.log("on delete cart function");
    $.ajax({
        method: 'post',
        url: '/delete_from_cart', 
        data: JSON.stringify({id:id}),
        contentType: 'application/json',
        xhrFields: {
            withCredentials: true // Include session cookies
        },
        success: function (response) {
            if(response.result===true){
                $('#headerCart').load('/ #headerCart'); 
                $('#productsData').load('/cart #productsData');
            }else{
                Swal.fire({
                    title: 'error',
                    text: 'product is out of stock',
                    icon: 'failed',
                    confirmButtonText: 'OK'
                  });
            }
        },
        error: function (error) {

            console.error(error);
        }
    });
}

function changeQuantity(val,id,count) {
    // console.log("val is:" + val);
    // console.log("id is:" + id);
    const url = `/edit_qnty?val=${val}&id=${id}&count=${count}`;
    $.ajax({
        method: 'get',
        url: url,
        success: function (response) {
            if (response.result === true) {
                $('#productsData').load('/cart #productsData');
                $('#headerCart').load('/ #headerCart'); 
            } else if (response.message === true) {
                Swal.fire({
                    title: 'Error',
                    text: 'Product is out of stock',
                    icon: 'error', // Use 'error' for an error message
                    confirmButtonText: 'OK'
                });
            } else if (response.message === false) {
                Swal.fire({
                    title: 'Error',
                    text: 'Product stock limit exceede',
                    icon: 'error', // Use 'error' for an error message
                    confirmButtonText: 'OK'
                });
            } else if (response.result === false) {
                Swal.fire({
                    title: 'Error',
                    text: 'something went wrong',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (error) {
            console.error(error);
        }
    });
}

//for the profile edit

function editProfile() {
    document.querySelectorAll('input').forEach(function(input) {
        input.removeAttribute('readonly');
    })
    
    // Show the "Save" button and hide the "Edit" link
    document.getElementById('editFields').style.display = 'none';
    document.getElementById('changePass').style.display = 'none';
    document.getElementById('changeMail').style.display = 'none';
    document.getElementById('saveChanges').style.display = 'block';
};

// for add new Address

function checkFullName() {
    const inputElement = document.querySelector('input[name="fullname"]');
    const trimmedValue = inputElement.value.trim();
    console.log(trimmedValue);
    const errorElement = document.querySelector('#fullNameError');
    
    if (trimmedValue.length < 6) {
        errorElement.textContent = "Full Name must be at least 6 characters.";
        return false
    } else {
        errorElement.textContent = "";
        return true
    }
}

function checkPhone() {
    const inputElement = document.querySelector('input[name="mobile"]');
    const trimmedValue = inputElement.value.trim();
    const errorElement = document.querySelector('#mobileNumberError');
    const phonePattern = /^[0-9]/;

    if (phonePattern.test(trimmedValue) && trimmedValue.length == 10) {
        errorElement.textContent = "";
        return true
    } else {
        errorElement.textContent = "Enter a valid 10-digit mobile number";
        return false
    }
}


function checkHouseName() {
    const inputElement = document.querySelector('input[name="housename"]');
    const trimmedValue = inputElement.value.trim();
    const errorElement = document.querySelector('#houseNameError');

    if (trimmedValue === "") {
        errorElement.textContent = "This field is required"
        return false
    } else {
        errorElement.textContent = ""
        return true
    }
}

function checkColony() {
    const inputElement = document.querySelector('input[name="colony"]');
    const trimmedValue = inputElement.value.trim();
    const errorElement = document.querySelector('#colonyNameError');

    if (trimmedValue == "") {
        errorElement.textContent = "This field is required"
        return false
    } else {
        errorElement.textContent = ""
        return true
    }
} 

function checkCity() {
    const inputElement = document.querySelector('input[name="city"]');
    const trimmedValue = inputElement.value.trim();
    const errorElement = document.querySelector('#cityNameError');

    if (trimmedValue == "") {
        errorElement.textContent = "This field is required"
        return false
    } else {
        errorElement.textContent = ""
        return true
    }
}

function checkState() {
    const inputElement = document.querySelector('input[name="state"]');
    const trimmedValue = inputElement.value.trim();
    const errorElement = document.querySelector('#stateNameError');

    if (trimmedValue == "") {
        errorElement.textContent = "This is field is required"
        return false
    } else {
        errorElement.textContent = ""
        return true
    }
}

function checkPincode() {
    const inputElement = document.querySelector('input[name="pincode"]');
    const trimmedValue = inputElement.value.trim();
    const errorElement = document.querySelector('#pincodeError');

    if (trimmedValue == "") {
        errorElement.textContent = "This is field is required"
    } else if (trimmedValue < 6) {
        errorElement.textContent = "Enter a valid pincode"
        return false
    } else {
        errorElement.textContent = ""
        return true
    }
}

function validateAddressForm(form) {
    const checkFullNameResult = checkFullName();
    const checkHouseNameResult = checkHouseName();
    const checkPhoneResult = checkPhone();
    const checkColonyResult = checkColony();
    const checkCityResult = checkCity();
    const checkStateResult = checkState();
    const checkPincodeResult = checkPincode();

    if (!checkFullNameResult || !checkHouseNameResult || !checkPhoneResult || !checkColonyResult || !checkCityResult || !checkStateResult || !checkPincodeResult) {
        console.log(checkFullNameResult,checkHouseNameResult,checkPhoneResult,checkColonyResult,checkCityResult,checkStateResult,checkPincodeResult);
        Swal.fire({
            title: 'Error',
            text: 'Please fill in all required fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    } else {
        Swal.fire({
            title: 'Added',
            text: 'Address added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            form.submit();
        });
    }
}

function validateNewAddressForm() {
    const checkFullNameResult = checkFullName();
    const checkHouseNameResult = checkHouseName();
    const checkPhoneResult = checkPhone();
    const checkColonyResult = checkColony();
    const checkCityResult = checkCity();
    const checkStateResult = checkState();
    const checkPincodeResult = checkPincode();

    if (!checkFullNameResult || !checkHouseNameResult || !checkPhoneResult || !checkColonyResult || !checkCityResult || !checkStateResult || !checkPincodeResult) {
        console.log(checkFullNameResult,checkHouseNameResult,checkPhoneResult,checkColonyResult,checkCityResult,checkStateResult,checkPincodeResult);
        
        return false;
    } else {
        return true;
    }
}

function handleAddNewAddress (event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    if ( validateNewAddressForm() ) {
        console.log('form data if case');
        newAddress(formData)
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Please fill in all required fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    return false
}

function newAddress (form) {
    console.log('here the form data');
    const data = {};
    for (const pair of form.entries()) {
        data[pair[0]] = pair[1];
    }
    console.log(data);

    $.ajax({
        method: 'post',
        url: '/new_address',
        data: data,
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    title: 'Success',
                    text: 'Address added successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then((result) => {
                    // Check if the user clicked the "OK" button
                    if (result.isConfirmed || result.isDismissed) {
                        // Reload the page after the user closes the alert
                        window.location.reload(true); // Pass true to force a full page reload
                    }
                })
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'something wrong',
                    icon: 'error', // Use 'error' for an error message
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (error) {
            console.error(error);
        }
    });
}


function deleteAddress(id) {
    const url = `/delete_address/${id}`
    console.log('here the address id');
    console.log(id);
    $.ajax({
        method: 'delete',
        url: url,
        success: function (response) {
            if (response.result === true) {
                $('#container').load('/profile #container');
                Swal.fire({
                    title: 'Success',
                    text: 'Address deleted successfully',
                    icon: 'success', 
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'something wrong',
                    icon: 'error', // Use 'error' for an error message
                    confirmButtonText: 'OK'
                });
            }
        },
        error: function (error) {
            console.error(error);
        }
    });
}

// for add the shippping charge to the total

function addShipcharge(charge) {
    const totalVal = document.querySelector('#subTotal').textContent;
    let total;
    if (!isNaN(totalVal)) {
        total = totalVal;
    } else {
        total = totalVal.substring(1);
    }
    const finalAmount = parseInt(total) + parseInt(charge);
    const result = document.querySelector('#final-amount');
    result.textContent = '₹'+parseInt(finalAmount);
}

// check the address
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#checkout-form'); 

    if (form) {
        form.addEventListener("submit", function (event) {
            const selectedAddress = document.querySelector("input[name='selectedAddress']:checked");

            if (!selectedAddress) {
                document.querySelector('#address-error').textContent = "You must select a valid Delivery address";
                event.preventDefault(); // Prevent the form from submitting
            }
        });
    } else {
        console.error("Form element not found");
    }
});


// check the shipping method

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#cart-form");

    if (form) {
        form.addEventListener("submit", function (event) {
            const selectedAddress = document.querySelector("input[name='shipping']:checked");

            if (!selectedAddress) {
                document.querySelector('#shipping-error').textContent = "You must select a shipping method to continue";
                event.preventDefault();
            }
        });
    } else {
        console.error("Form element not found");
    }
});


// set the payment method
function setPaymentMethod(val) {
    // console.log("on the set payment function:"+val+" "+num);
    const payment = document.querySelector('#paymentMethodField');
    if (payment) {
        console.log("on if case of setpayement method");
        payment.value = val;
    } else {
        console.error("Element with ID 'paymentMethod' not found.");
    }
}

// for check the payment method selected or not
function checkPayment(event) {
    console.log("on the check payment function");
   const value = document.querySelector('#paymentMethodField').value
   if (value == "") {
    event.preventDefault();
    document.querySelector('#paymentMethodError').textContent = "please select a payment method";
    return false
   }
   return true
}

// for the the razorpay
$(document).ready(function(){
	$('.pay-form').submit(function(e){
		e.preventDefault();

		let formData = $(this).serialize();

		$.ajax({
			url:"/place_order",
			type:"POST",
			data: formData,
			success:function(response){
				if(response.order){
                    console.log("on success section");
					openRazorPay(response.order)
				} else if ( response.cod === true ) {
                    window.location.href = '/order_sucess'
                } else if ( response.wallet === true ) {
                    window.location.href = '/order_sucess'
                } else {
					alert(res.msg);
				}
			}
		})

	});
});

function openRazorPay (order) {
    console.log(order);
    var options = {
        "key": ""+'rzp_test_OVwm8vSjjV54PO',
        "amount": order.amount,
        "currency": "INR",
        "name": "SheoKart",
        "description": "sample description",
        "image": "https://dummyimage.com/600x400/000/fff",
        "order_id": ""+order.id,
        "handler": function (response){
            alert("Payment Succeeded");
            verifyPayment(response,order);
        },  
        "notes" : {
            "description":"Sample description 2"
        },
        "theme": {
            "color": "#2300a3"
        }
    };
    var razorpayObject = new Razorpay(options);
    razorpayObject.on('payment.failed', function (response){
            alert("Payment Failed");
    });
    razorpayObject.open();
}

function verifyPayment (res,order) {
    $.ajax({
        url:"/payment/verify_payment",
        type:"POST",
        data: {res,order},
        success: function (response) {
            if (response.success === true) {
                // Swal.fire({
                //     title: 'success',
                //     text: 'Payment Successfull',
                //     icon: 'success',
                //     confirmButtonText: 'OK'
                //   });
                  window.location.href = '/order_sucess'
            } else {
                // Swal.fire({
                //     title: 'Error',
                //     text: 'Payment Failed',
                //     icon: 'error', 
                //     confirmButtonText: 'OK'
                // });
                window.location.href = '/'
            }
        },
        error: function (xhr, status, error) {
            console.error("Error in verify_payment request: " + error);
        }
    })
}

function returnOrder (orderId) {
    console.log('on the return order function');
    $.ajax({
        url:"/return_order",
        type:"PATCH",
        data: ({orderId}),
        success: function (response) {
            if (response.success === true) {
                window.location.href = '/profile'
                Swal.fire({
                    title: 'success',
                    text: 'Return order Successfull',
                    icon: 'success',
                    confirmButtonText: 'OK'
                  });
            } else if (response.success === false){
                Swal.fire({
                    title: 'Error',
                    text: 'Something wrong',
                    icon: 'error', 
                    confirmButtonText: 'OK'
                });
            } else {
                window.location.href = '/'
            }
        },
        error: function (xhr, status, error) {
            console.error("Error in verify_payment request: " + error);
        }
    })
}

function addDiscount (couponId) {
    const totalAmountValue = document.querySelector('#subTotal').textContent
    const totalAmount = totalAmountValue.substring(1);
    console.log(totalAmount);
    $.ajax({
        url:"/add_discount",
        type:"PATCH",
        data: ({couponId,totalAmount}),
        success: function (response) {
            if (response.minimumPurchaseAmount === false) {
                Swal.fire({
                    title: 'Error',
                    text: 'Minimum purchase amount not reached',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  });
            } else if (response.expired === false){
                Swal.fire({
                    title: 'Error',
                    text: 'Coupon expired',
                    icon: 'error', 
                    confirmButtonText: 'OK'
                });
            } else if (response.used === true){
                Swal.fire({
                    title: 'Error',
                    text: 'You already used the coupon',
                    icon: 'error', 
                    confirmButtonText: 'OK'
                });
            } else if (response.exceed === true) {
                Swal.fire({
                    title: 'Error',
                    text: 'Coupon usage limit exceed',
                    icon: 'error', 
                    confirmButtonText: 'OK'
                });
            } else if (response.discountedAmount) {
                console.log('the final case');
                $('#cart-form').load('/cart #cart-form', function () {
                    console.log('Content loaded successfully');
                    $('#subTotal').html("₹"+response.discountedAmount);
                    $('#final-amount').html("₹"+response.discountedAmount);
                    $('#discount').val(response.discount);
                    $('#coupon-input').val(response.coupon.code);
                    $('#couponDetail').val(JSON.stringify(response.coupon));
                    couponChange();
                });                
                Swal.fire({
                    title: 'success',
                    text: 'Coupon applied sucessfully',
                    icon: 'success',
                    confirmButtonText: 'OK'
                  });
            } else {
                window.location.href = '/'
            }
        },
        error: function (xhr, status, error) {
            console.error("Error in verify_payment request: " + error);
        }
    })
}

function couponChange () {
    console.log('the change function on the coupon code section');
    const codeValue = document.querySelector('#coupon-input').value;
    const couponButton = document.querySelector('#couponButton');
    const showButton = document.querySelector('#deleteButton');
    if (codeValue) {
        showButton.hidden = false
        couponButton.hidden = true
    } else {
        showButton.hidden = true
        couponButton.hidden = false
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#deleteButton').addEventListener('click', () => {
        window.location.reload();
    });
});



function addAmount (event) {
    event.preventDefault()

	let formData = $(this).serialize();
    $.ajax({
        url:"/add_amount",
        type:"POST",
        data: formData,
        success:function(response){
            if(response.order){
                console.log("on success section");
                openRazorPay(response.order)
            } else if ( response.cod === true ) {
                window.location.href = '/order_sucess'
            } else if ( response.wallet === true ) {
                window.location.href = '/order_sucess'
            } else {
                alert(res.msg);
            }
        }
    })
}

$(document).ready(function(){
	$('.add-amount-form').submit(function(e){
		e.preventDefault();

		let formData = $(this).serialize();
        console.log('this is the add- amount form submition function');

		$.ajax({
			url:"/add_amount",
			type:"POST",
			data: formData,
			success:function(response){
				if(response.addMoney){
                    console.log("on success section");
					openRazorPay2(response.addMoney,response.result)
				} else if ( response.success === false ) {
                    console.log('something went wrong, try agian later');
                    Swal.fire({
                        title: 'Error',
                        text: 'something went wrong, try agian later',
                        icon: 'error',
                        confirmButtonText: 'OK'
                      }).then(() => window.location.href = '/profile')
                } else {
					alert(response.msg);
				}
			}
		})

	});
});

function openRazorPay2 (addMoney,actualMoney) {
    console.log(addMoney);
        var options = {
        "key": "rzp_test_OVwm8vSjjV54PO",
        "amount": addMoney.amount, 
        "currency": "INR",
        "name": "Fashion Arclight",
        "description": "Test Transaction",
        "image": "/user/images/Fs Hat Logo.jpg",
        "order_id": addMoney.id, 
        handler: function (response) {
            verifyPayment(response, addMoney, actualMoney);
        },
        "prefill": { 
            "name": "Fashion Arclight", 
            "email": "fashionarclight.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Fashion Arclight "
        },
        "theme": {
            "color": "#cc9967"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}

function verifyPayment(payment, order,actualMoney) {
    console.log('look here');
    console.log(actualMoney);
    console.log(payment,order);
    if (payment.razorpay_payment_id) {
        $.ajax({
        url: "/payment/comfirm-payment",
        method: "post",
        data: {
            payment: payment,
            order: order,
            data: actualMoney,
        },
        success: (response) => {
        if (response.final === true) {
            Swal.fire({
                title: 'success',
                text: 'Amount added sucessfully',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => window.location.href = '/profile')
        } else if (response.final === false) {
            Swal.fire({
                title: 'Error',
                text: 'something wrong, try again',
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
    },
    });
    }
}