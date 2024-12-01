/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
  initialDate = new Date(),

  $document = $(document),
  $window = $(window),
  $html = $("html"),

  isDesktop = $html.hasClass("desktop"),
  isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isTouch = "ontouchstart" in window,
  $top = $(".top"),
  isNoviBuilder = false,
  windowReady = false,

  plugins = {
    pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
    bootstrapTooltip: $("[data-bs-toggle='tooltip']"),
    bootstrapTabs: $(".tabs"),
    copyrightYear:           $( '.copyright-year' ),
    rdAudioPlayer: $(".rd-audio"),
    owl: $(".owl-carousel"),
    maps:                    $( '.google-map-container' ),
    rdNavbar: $(".rd-navbar"),
    rdRange: $('.rd-range'),
    textRotator: $(".text-rotator"),
    swiper:                  $('.swiper-container'),
    preloader:               $( '.preloader' ),
    progressBar: $(".progress-bar-js"),
    isotope:                 $( '.isotope-wrap' ),
    twitterfeed: $(".twitter"),
    countDown: $(".countdown"),
    materialTabs: $('.rd-material-tabs'),
    popover: $('[data-bs-toggle="popover"]'),
    productThumb: $(".product-thumbnails"),
    dateCountdown: $('.DateCountdown'),
    statefulButton: $('.btn-stateful'),
    slick: $('.slick-slider'),
    lightGallery:            $( '[data-lightgallery="group"]' ),
    lightGalleryItem:        $( '[data-lightgallery="item"]' ),
    lightDynamicGalleryItem: $( '[data-lightgallery="dynamic"]' ),
    scroller: $(".scroll-wrap"),
    viewAnimate: $('.view-animate'),
    selectFilter: $("select"),
    customWaypoints: $('[data-custom-scroll-to]'),
    circleProgress: $(".progress-bar-circle"),
    stepper: $("input[type='number']"),
    customToggle: $("[data-custom-toggle]"),
    rdMailForm: $(".rd-mailform"),
    rdInputLabel: $(".form-label"),
    regula: $("[data-constraints]"),
    radio: $("input[type='radio']"),
    checkbox: $("input[type='checkbox']"),
    captcha: $('.recaptcha'),
    mailchimp: $('.mailchimp-mailform'),
    campaignMonitor:         $( '.campaign-mailform' ),
    search: $(".rd-search"),
    searchResults: $('.rd-search-results'),
    counter:                 document.querySelectorAll( '.counter' ),
    progressLinear:          document.querySelectorAll( '.progress-linear' ),
    progressCircle:          document.querySelectorAll( '.progress-circle' ),
    countdown:               document.querySelectorAll( '.countdown' )
  };

  /**
   * @desc Check the element was been scrolled into the view
   * @param {object} elem - jQuery object
   * @return {boolean}
   */
  function isScrolledIntoView ( elem ) {
    if ( isNoviBuilder ) return true;
    return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
  }

  /**
   * @desc Calls a function when element has been scrolled into the view
   * @param {object} element - jQuery object
   * @param {function} func - init function
   */
  function lazyInit( element, func ) {
    var scrollHandler = function () {
      if ( ( !element.hasClass( 'lazy-loaded' ) && ( isScrolledIntoView( element ) ) ) ) {
        func.call();
        element.addClass( 'lazy-loaded' );
      }
    };

    scrollHandler();
    $window.on( 'scroll', scrollHandler );
  }

  $window.on('load', function () {

    if (plugins.preloader.length && !isNoviBuilder) {
      pageTransition({
        target: document.querySelector( '.page' ),
        delay: 0,
        duration: 500,
        classIn: 'fadeIn',
        classOut: 'fadeOut',
        classActive: 'animated',
        conditions: function (event, link) {
          return link && !/(\#|javascript:void\(0\)|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
        },
        onTransitionStart: function ( options ) {
          setTimeout( function () {
            plugins.preloader.removeClass('loaded');
          }, options.duration * .75 );
        },
        onReady: function () {
          plugins.preloader.addClass('loaded');
          windowReady = true;
        }
      });
    }

    // Counter
    if ( plugins.counter ) {
      for ( var i = 0; i < plugins.counter.length; i++ ) {
        var
          node = plugins.counter[i],
          counter = aCounter({
            node: node,
            duration: node.getAttribute( 'data-duration' ) || 1000
          }),
          scrollHandler = (function() {
            if ( Util.inViewport( this ) && !this.classList.contains( 'animated-first' ) ) {
              this.counter.run();
              this.classList.add( 'animated-first' );
            }
          }).bind( node ),
          blurHandler = (function() {
            this.counter.params.to = parseInt( this.textContent, 10 );
            this.counter.run();
          }).bind( node );

        scrollHandler();
        window.addEventListener( 'scroll', scrollHandler );
        node.addEventListener( 'blur', blurHandler );
      }
    }

    // Progress Bar
    if ( plugins.progressLinear ) {
      for ( var i = 0; i < plugins.progressLinear.length; i++ ) {
        var
          container = plugins.progressLinear[i],
          counter = aCounter({
            node: container.querySelector( '.progress-linear-counter' ),
            duration: container.getAttribute( 'data-duration' ) || 1000,
            onStart: function() {
              this.custom.bar.style.width = this.params.to + '%';
            }
          });

        counter.custom = {
          container: container,
          bar: container.querySelector( '.progress-linear-bar' ),
          onScroll: (function() {
            if ( Util.inViewport( this.custom.container ) && !this.custom.container.classList.contains( 'animated' ) ) {
              this.run();
              this.custom.container.classList.add( 'animated' );
            }
          }).bind( counter ),
          onBlur: (function() {
            this.params.to = parseInt( this.params.node.textContent, 10 );
            this.run();
          }).bind( counter )
        };

        counter.custom.onScroll();
        window.addEventListener( 'scroll', counter.custom.onScroll );
        counter.params.node.addEventListener( 'blur', counter.custom.onBlur );
      }
    }

    // Progress Circle
    if ( plugins.progressCircle ) {
      for ( var i = 0; i < plugins.progressCircle.length; i++ ) {
        var
          container = plugins.progressCircle[i],
          counter = aCounter({
            node: container.querySelector( '.progress-circle-counter' ),
            duration: 500,
            onUpdate: function( value ) {
              this.custom.bar.render( value * 3.6 );
            }
          });

        counter.params.onComplete = counter.params.onUpdate;

        counter.custom = {
          container: container,
          bar: aProgressCircle({ node: container.querySelector( '.progress-circle-bar' ) }),
          onScroll: (function() {
            if ( Util.inViewport( this.custom.container ) && !this.custom.container.classList.contains( 'animated' ) ) {
              this.run();
              this.custom.container.classList.add( 'animated' );
            }
          }).bind( counter ),
          onBlur: (function() {
            this.params.to = parseInt( this.params.node.textContent, 10 );
            this.run();
          }).bind( counter )
        };

        counter.custom.onScroll();
        window.addEventListener( 'scroll', counter.custom.onScroll );
        counter.params.node.addEventListener( 'blur', counter.custom.onBlur );
      }
    }

    // Isotope
    if ( plugins.isotope.length ) {
      for ( var i = 0; i < plugins.isotope.length; i++ ) {
        var
          wrap = plugins.isotope[ i ],
          filterHandler = function ( event ) {
            event.preventDefault();
            for ( var n = 0; n < this.isoGroup.filters.length; n++ ) this.isoGroup.filters[ n ].classList.remove( 'active' );
            this.classList.add( 'active' );
            this.isoGroup.isotope.arrange( { filter: this.getAttribute( "data-isotope-filter" ) !== '*' ? '[data-filter*="' + this.getAttribute( "data-isotope-filter" ) + '"]' : '*' } );
          },
          resizeHandler = function () {
            this.isoGroup.isotope.layout();
          };

        wrap.isoGroup = {};
        wrap.isoGroup.filters = wrap.querySelectorAll( '[data-isotope-filter]' );
        wrap.isoGroup.node = wrap.querySelector( '.isotope' );
        wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) ? wrap.isoGroup.node.getAttribute( 'data-isotope-layout' ) : 'masonry';
        wrap.isoGroup.isotope = new Isotope( wrap.isoGroup.node, {
          itemSelector: '.isotope-item',
          layoutMode: wrap.isoGroup.layout,
          filter: '*',
          columnWidth: ( function() {
            if ( wrap.isoGroup.node.hasAttribute('data-column-class') ) return wrap.isoGroup.node.getAttribute('data-column-class');
            if ( wrap.isoGroup.node.hasAttribute('data-column-width') ) return parseFloat( wrap.isoGroup.node.getAttribute('data-column-width') );
          }() )
        } );

        for ( var n = 0; n < wrap.isoGroup.filters.length; n++ ) {
          var filter = wrap.isoGroup.filters[ n ];
          filter.isoGroup = wrap.isoGroup;
          filter.addEventListener( 'click', filterHandler );
        }

        window.addEventListener( 'resize', resizeHandler.bind( wrap ) );
      }
    }

  })

/**
 * Initialize All Scripts
 */
$document.ready(function () {
  isNoviBuilder = window.xMode;
  
  /**
   * Wrapper to eliminate json errors
   * @param {string} str - JSON string
   * @returns {object} - parsed or empty object
   */
  function parseJSON ( str ) {
    try {
      if ( str )  return JSON.parse( str );
      else return {};
    } catch ( error ) {
      console.warn( error );
      return {};
    }
  }
  
  /**
   * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
   * @param {object} swiper - swiper instance
   */
  function setRealPrevious(swiper) {
    let element = swiper.$wrapperEl[0].children[swiper.activeIndex];
    swiper.realPrevious = Array.prototype.indexOf.call(element.parentNode.children, element);
  }
  
  /**
   * @desc Sets slides background images from attribute 'data-slide-bg'
   * @param {object} swiper - swiper instance
   */
  function setBackgrounds(swiper) {
    let swipersBg = swiper.el.querySelectorAll('[data-slide-bg]');
    
    for (let i = 0; i < swipersBg.length; i++) {
      let swiperBg = swipersBg[i];
      swiperBg.style.backgroundImage = 'url(' + swiperBg.getAttribute('data-slide-bg') + ')';
    }
  }
  
  /**
   * @desc Animate captions on active slides
   * @param {object} swiper - swiper instance
   */
  function initCaptionAnimate(swiper) {
    let
      animate = function (caption) {
        return function () {
          let duration;
          if (duration = caption.getAttribute('data-caption-duration')) caption.style.animationDuration = duration + 'ms';
          caption.classList.remove('not-animated');
          caption.classList.add(caption.getAttribute('data-caption-animate'));
          caption.classList.add('animated');
        };
      },
      initializeAnimation = function (captions) {
        for (let i = 0; i < captions.length; i++) {
          let caption = captions[i];
          caption.classList.remove('animated');
          caption.classList.remove(caption.getAttribute('data-caption-animate'));
          caption.classList.add('not-animated');
        }
      },
      finalizeAnimation = function (captions) {
        for (let i = 0; i < captions.length; i++) {
          let caption = captions[i];
          if (caption.getAttribute('data-caption-delay')) {
            setTimeout(animate(caption), Number(caption.getAttribute('data-caption-delay')));
          } else {
            animate(caption)();
          }
        }
      };
    
    // Caption parameters
    swiper.params.caption = {
      animationEvent: 'slideChangeTransitionEnd'
    };
    
    initializeAnimation(swiper.$wrapperEl[0].querySelectorAll('[data-caption-animate]'));
    finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
    
    if (swiper.params.caption.animationEvent === 'slideChangeTransitionEnd') {
      swiper.on(swiper.params.caption.animationEvent, function () {
        initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
        finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
      });
    } else {
      swiper.on('slideChangeTransitionEnd', function () {
        initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
      });
      
      swiper.on(swiper.params.caption.animationEvent, function () {
        finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
      });
    }
  }

  /**
   * @desc Initialize owl carousel plugin
   * @param {object} c - carousel jQuery object
   */
  function initOwlCarousel(c) {
    var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
      values = [0, 576, 768, 992, 1200, 1600],
      responsive = {};

    for (var j = 0; j < values.length; j++) {
      responsive[values[j]] = {};
      for (var k = j; k >= -1; k--) {
        if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
          responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
        }
        if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
          responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
        }
        if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
          responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
        }
      }
    }

    // Enable custom pagination
    if (c.attr('data-dots-custom')) {
      c.on("initialized.owl.carousel", function (event) {
        var carousel = $(event.currentTarget),
          customPag = $(carousel.attr("data-dots-custom")),
          active = 0;

        if (carousel.attr('data-active')) {
          active = parseInt(carousel.attr('data-active'), 10);
        }

        carousel.trigger('to.owl.carousel', [active, 300, true]);
        customPag.find("[data-owl-item='" + active + "']").addClass("active");

        customPag.find("[data-owl-item]").on('click', function (e) {
          e.preventDefault();
          carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
        });

        carousel.on("translate.owl.carousel", function (event) {
          customPag.find(".active").removeClass("active");
          customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
        });
      });
    }

    c.on("initialized.owl.carousel", function () {
      initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
    });

    c.owlCarousel({
      autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
      loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
      items: 1,
      center: c.attr("data-center") === "true",
      dotsContainer: c.attr("data-pagination-class") || false,
      navContainer: c.attr("data-navigation-class") || false,
      mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
      nav: c.attr("data-nav") === "true",
      dots: c.attr("data-dots") === "true",
      dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
      animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
      animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
      responsive: responsive,
      navText: c.attr("data-nav-text") ? $.parseJSON( c.attr("data-nav-text") ) : [],
      navClass: c.attr("data-nav-class") ? $.parseJSON( c.attr("data-nav-class") ) : ['owl-prev', 'owl-next']
    });
  }

  /**
   * @desc Initialize the gallery with set of images
   * @param {object} itemsToInit - jQuery object
   * @param {string} [addClass] - additional gallery class
   */
  function initLightGallery ( itemsToInit, addClass ) {
    if ( !isNoviBuilder ) {
      $( itemsToInit ).lightGallery( {
        thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
        selector: "[data-lightgallery='item']",
        autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
        pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
        addClass: addClass,
        mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
        loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false"
      } );
    }
  }

  /**
   * @desc Initialize the gallery with dynamic addition of images
   * @param {object} itemsToInit - jQuery object
   * @param {string} [addClass] - additional gallery class
   */
  function initDynamicLightGallery ( itemsToInit, addClass ) {
    if ( !isNoviBuilder ) {
      $( itemsToInit ).on( "click", function () {
        $( itemsToInit ).lightGallery( {
          thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
          selector: "[data-lightgallery='item']",
          autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
          pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
          addClass: addClass,
          mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
          loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false",
          dynamic: true,
          dynamicEl: JSON.parse( $( itemsToInit ).attr( "data-lg-dynamic-elements" ) ) || []
        } );
      } );
    }
  }

  /**
   * @desc Initialize the gallery with one image
   * @param {object} itemToInit - jQuery object
   * @param {string} [addClass] - additional gallery class
   */
  function initLightGalleryItem ( itemToInit, addClass ) {
    if ( !isNoviBuilder ) {
      $( itemToInit ).lightGallery( {
        selector: "this",
        addClass: addClass,
        counter: false,
        youtubePlayerParams: {
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
          controls: 0
        },
        vimeoPlayerParams: {
          byline: 0,
          portrait: 0
        }
      } );
    }
  }


  /**
   * Live Search
   * @description  create live search results
   */
  function liveSearch(options) {
    $('#' + options.live).removeClass('cleared').html();
    options.current++;
    options.spin.addClass('loading');
    $.get(handler, {
      s: decodeURI(options.term),
      liveSearch: options.live,
      dataType: "html",
      liveCount: options.liveCount,
      filter: options.filter,
      template: options.template
    }, function (data) {
      options.processed++;
      var live = $('#' + options.live);
      if (options.processed == options.current && !live.hasClass('cleared')) {
        live.find('> #search-results').removeClass('active');
        live.html(data);
        setTimeout(function () {
          live.find('> #search-results').addClass('active');
        }, 50);
      }
      options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
    })
  }


  /**
   * @desc Attach form validation to elements
   * @param {object} elements - jQuery object
   */
  function attachFormValidator(elements) {
    // Custom validator - phone number
    regula.custom({
      name: 'PhoneNumber',
      defaultMessage: 'Invalid phone number format',
      validator: function() {
        if ( this.value === '' ) return true;
        else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test( this.value );
      }
    });

    for (var i = 0; i < elements.length; i++) {
      var o = $(elements[i]), v;
      o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
      v = o.parent().find(".form-validation");
      if (v.is(":last-child")) o.addClass("form-control-last-child");
    }

    elements.on('input change propertychange blur', function (e) {
      var $this = $(this), results;

      if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
      if ($this.parents('.rd-mailform').hasClass('success')) return;

      if (( results = $this.regula('validate') ).length) {
        for (i = 0; i < results.length; i++) {
          $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
        }
      } else {
        $this.siblings(".form-validation").text("").parent().removeClass("has-error")
      }
    }).regula('bind');

    var regularConstraintsMessages = [
      {
        type: regula.Constraint.Required,
        newMessage: "The text field is required."
      },
      {
        type: regula.Constraint.Email,
        newMessage: "The email is not a valid email."
      },
      {
        type: regula.Constraint.Numeric,
        newMessage: "Only numbers are required"
      },
      {
        type: regula.Constraint.Selected,
        newMessage: "Please choose an option."
      }
    ];


    for (var i = 0; i < regularConstraintsMessages.length; i++) {
      var regularConstraint = regularConstraintsMessages[i];

      regula.override({
        constraintType: regularConstraint.type,
        defaultMessage: regularConstraint.newMessage
      });
    }
  }

  /**
   * @desc Check if all elements pass validation
   * @param {object} elements - object of items for validation
   * @param {object} captcha - captcha object for validation
   * @return {boolean}
   */
  function isValidated(elements, captcha) {
    var results, errors = 0;

    if (elements.length) {
      for (var j = 0; j < elements.length; j++) {

        var $input = $(elements[j]);
        if ((results = $input.regula('validate')).length) {
          for (k = 0; k < results.length; k++) {
            errors++;
            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
          }
        } else {
          $input.siblings(".form-validation").text("").parent().removeClass("has-error")
        }
      }

      if (captcha) {
        if (captcha.length) {
          return validateReCaptcha(captcha) && errors === 0
        }
      }

      return errors === 0;
    }
    return true;
  }

  /**
   * @desc Validate google reCaptcha
   * @param {object} captcha - captcha object for validation
   * @return {boolean}
   */
  function validateReCaptcha(captcha) {
    var captchaToken = captcha.find('.g-recaptcha-response').val();

    if (captchaToken.length === 0) {
      captcha
        .siblings('.form-validation')
        .html('Please, prove that you are not robot.')
        .addClass('active');
      captcha
        .closest('.form-wrap')
        .addClass('has-error');

      captcha.on('propertychange', function () {
        var $this = $(this),
          captchaToken = $this.find('.g-recaptcha-response').val();

        if (captchaToken.length > 0) {
          $this
            .closest('.form-wrap')
            .removeClass('has-error');
          $this
            .siblings('.form-validation')
            .removeClass('active')
            .html('');
          $this.off('propertychange');
        }
      });

      return false;
    }

    return true;
  }

  /**
   * @desc Initialize Google reCaptcha
   */
  window.onloadCaptchaCallback = function () {
    for (var i = 0; i < plugins.captcha.length; i++) {
      var
        $captcha = $(plugins.captcha[i]),
        resizeHandler = (function() {
          var
            frame = this.querySelector( 'iframe' ),
            inner = this.firstElementChild,
            inner2 = inner.firstElementChild,
            containerRect = null,
            frameRect = null,
            scale = null;

          inner2.style.transform = '';
          inner.style.height = 'auto';
          inner.style.width = 'auto';

          containerRect = this.getBoundingClientRect();
          frameRect = frame.getBoundingClientRect();
          scale = containerRect.width/frameRect.width;

          if ( scale < 1 ) {
            inner2.style.transform = 'scale('+ scale +')';
            inner.style.height = ( frameRect.height * scale ) + 'px';
            inner.style.width = ( frameRect.width * scale ) + 'px';
          }
        }).bind( plugins.captcha[i] );

      grecaptcha.render(
        $captcha.attr('id'),
        {
          sitekey: $captcha.attr('data-sitekey'),
          size: $captcha.attr('data-size') ? $captcha.attr('data-size') : 'normal',
          theme: $captcha.attr('data-theme') ? $captcha.attr('data-theme') : 'light',
          callback: function () {
            $('.recaptcha').trigger('propertychange');
          }
        }
      );

      $captcha.after("<span class='form-validation'></span>");

      if ( plugins.captcha[i].hasAttribute( 'data-auto-size' ) ) {
        resizeHandler();
        window.addEventListener( 'resize', resizeHandler );
      }
    }
  };

  /**
   * Init Bootstrap tooltip
   * @description  calls a function when need to init bootstrap tooltips
   */
  function initBootstrapTooltip(tooltipPlacement) {
    if (window.innerWidth < 599) {
      plugins.bootstrapTooltip.tooltip('destroy');
      plugins.bootstrapTooltip.tooltip({
        placement: 'bottom'
      });
    } else {
      plugins.bootstrapTooltip.tooltip('destroy');
      plugins.bootstrapTooltip.tooltipPlacement;
      plugins.bootstrapTooltip.tooltip();
    }
  }

  // Copyright Year (Evaluates correct copyright year)
  if (plugins.copyrightYear.length) {
    plugins.copyrightYear.text(initialDate.getFullYear());
  }

  /**
   * IE Polyfills
   * @description  Adds some loosing functionality to IE browsers
   */
  if (isIE) {
    if (isIE < 10) {
      $html.addClass("lt-ie-10");
    }

    if (isIE < 11) {
      if (plugins.pointerEvents) {
        $.getScript(plugins.pointerEvents)
          .done(function () {
            $html.addClass("ie-10");
            PointerEventsPolyfill.initialize({});
          });
      }
    }

    if (isIE === 11) {
      $("html").addClass("ie-11");
    }

    if (isIE === 12) {
      $("html").addClass("ie-edge");
    }
  }

  /**
   * Bootstrap Tooltips
   * @description Activate Bootstrap Tooltips
   */
  if (plugins.bootstrapTooltip.length) {
    var tooltipPlacement = plugins.bootstrapTooltip.attr('data-bs-placement');
    initBootstrapTooltip(tooltipPlacement);
    $(window).on('resize orientationchange', function () {
      initBootstrapTooltip(tooltipPlacement);
    })
  }


  /**
   * RD Audio player
   * @description Enables RD Audio player plugin
   */
  if (plugins.rdAudioPlayer.length > 0) {
    var i;
    for (i = 0; i < plugins.rdAudioPlayer.length; i++) {
      $(plugins.rdAudioPlayer[i]).RDAudio();
    }
  }

  /**
   * Text Rotator
   * @description Enables Text Rotator plugin
   */
  if (plugins.textRotator.length) {
    var i;
    for (i = 0; i < plugins.textRotator.length; i++) {
      var textRotatorItem = plugins.textRotator[i];
      $(textRotatorItem).rotator();
    }
  }


  /**
   * RD MaterialTabs
   * @description Enables RD MaterialTabs plugin
   */
  if (plugins.materialTabs.length) {
    var i;
    for (i = 0; i < plugins.materialTabs.length; i++) {
      var materialTabsItem = plugins.materialTabs[i];
      $(materialTabsItem).RDMaterialTabs({});
    }
  }

  /**
   * Google ReCaptcha
   * @description Enables Google ReCaptcha
   */
  if (plugins.captcha.length) {
    $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
  }

  /**
   * Radio
   * @description Add custom styling options for input[type="radio"]
   */
  if (plugins.radio.length) {
    var i;
    for (i = 0; i < plugins.radio.length; i++) {
      $(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
    }
  }

  /**
   * Checkbox
   * @description Add custom styling options for input[type="checkbox"]
   */
  if (plugins.checkbox.length) {
    var i;
    for (i = 0; i < plugins.checkbox.length; i++) {
      $(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
    }
  }

  // RD Input Label
  if (plugins.rdInputLabel.length) {
    plugins.rdInputLabel.RDInputLabel();
  }

  // Regula
  if (plugins.regula.length) {
    attachFormValidator(plugins.regula);
  }

  // MailChimp Ajax subscription
  if (plugins.mailchimp.length) {
    for (i = 0; i < plugins.mailchimp.length; i++) {
      var $mailchimpItem = $(plugins.mailchimp[i]),
        $email = $mailchimpItem.find('input[type="email"]');

      // Required by MailChimp
      $mailchimpItem.attr('novalidate', 'true');
      $email.attr('name', 'EMAIL');

      $mailchimpItem.on('submit', $.proxy( function ( $email, event ) {
        event.preventDefault();

        var $this = this;

        var data = {},
          url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
          dataArray = $this.serializeArray(),
          $output = $("#" + $this.attr("data-form-output"));

        for (i = 0; i < dataArray.length; i++) {
          data[dataArray[i].name] = dataArray[i].value;
        }

        $.ajax({
          data: data,
          url: url,
          dataType: 'jsonp',
          error: function (resp, text) {
            $output.html('Server error: ' + text);

            setTimeout(function () {
              $output.removeClass("active");
            }, 4000);
          },
          success: function (resp) {
            $output.html(resp.msg).addClass('active');
            $email[0].value = '';
            var $label = $('[for="'+ $email.attr( 'id' ) +'"]');
            if ( $label.length ) $label.removeClass( 'focus not-empty' );

            setTimeout(function () {
              $output.removeClass("active");
            }, 6000);
          },
          beforeSend: function (data) {
            var isNoviBuilder = window.xMode;

            var isValidated = (function () {
              var results, errors = 0;
              var elements = $this.find('[data-constraints]');
              var captcha = null;
              if (elements.length) {
                for (var j = 0; j < elements.length; j++) {

                  var $input = $(elements[j]);
                  if ((results = $input.regula('validate')).length) {
                    for (var k = 0; k < results.length; k++) {
                      errors++;
                      $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                    }
                  } else {
                    $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                  }
                }

                if (captcha) {
                  if (captcha.length) {
                    return validateReCaptcha(captcha) && errors === 0
                  }
                }

                return errors === 0;
              }
              return true;
            })();

            // Stop request if builder or inputs are invalide
            if (isNoviBuilder || !isValidated)
              return false;

            $output.html('Submitting...').addClass('active');
          }
        });

        return false;
      }, $mailchimpItem, $email ));
    }
  }

  // Campaign Monitor ajax subscription
  if (plugins.campaignMonitor.length) {
    for (i = 0; i < plugins.campaignMonitor.length; i++) {
      var $campaignItem = $(plugins.campaignMonitor[i]);

      $campaignItem.on('submit', $.proxy(function (e) {
        var data = {},
          url = this.attr('action'),
          dataArray = this.serializeArray(),
          $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
          $this = $(this);

        for (i = 0; i < dataArray.length; i++) {
          data[dataArray[i].name] = dataArray[i].value;
        }

        $.ajax({
          data: data,
          url: url,
          dataType: 'jsonp',
          error: function (resp, text) {
            $output.html('Server error: ' + text);

            setTimeout(function () {
              $output.removeClass("active");
            }, 4000);
          },
          success: function (resp) {
            $output.html(resp.Message).addClass('active');

            setTimeout(function () {
              $output.removeClass("active");
            }, 6000);
          },
          beforeSend: function (data) {
            // Stop request if builder or inputs are invalide
            if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
              return false;

            $output.html('Submitting...').addClass('active');
          }
        });

        // Clear inputs after submit
        var inputs = $this[0].getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].value = '';
          var label = document.querySelector( '[for="'+ inputs[i].getAttribute( 'id' ) +'"]' );
          if( label ) label.classList.remove( 'focus', 'not-empty' );
        }

        return false;
      }, $campaignItem));
    }
  }

  // RD Mailform
  if (plugins.rdMailForm.length) {
    var i, j, k,
      msg = {
        'MF000': 'Successfully sent!',
        'MF001': 'Recipients are not set!',
        'MF002': 'Form will not work locally!',
        'MF003': 'Please, define email field in your form!',
        'MF004': 'Please, define type of your form!',
        'MF254': 'Something went wrong with PHPMailer!',
        'MF255': 'Aw, snap! Something went wrong.'
      };

    for (i = 0; i < plugins.rdMailForm.length; i++) {
      var $form = $(plugins.rdMailForm[i]),
        formHasCaptcha = false;

      $form.attr('novalidate', 'novalidate').ajaxForm({
        data: {
          "form-type": $form.attr("data-form-type") || "contact",
          "counter": i
        },
        beforeSubmit: function (arr, $form, options) {
          if (isNoviBuilder)
            return;

          var form = $(plugins.rdMailForm[this.extraData.counter]),
            inputs = form.find("[data-constraints]"),
            output = $("#" + form.attr("data-form-output")),
            captcha = form.find('.recaptcha'),
            captchaFlag = true;

          output.removeClass("active error success");

          if (isValidated(inputs, captcha)) {

            // veify reCaptcha
            if (captcha.length) {
              var captchaToken = captcha.find('.g-recaptcha-response').val(),
                captchaMsg = {
                  'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                  'CPT002': 'Something wrong with google reCaptcha'
                };

              formHasCaptcha = true;

              $.ajax({
                method: "POST",
                url: "bat/reCaptcha.php",
                data: {'g-recaptcha-response': captchaToken},
                async: false
              })
                .done(function (responceCode) {
                  if (responceCode !== 'CPT000') {
                    if (output.hasClass("snackbars")) {
                      output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                      setTimeout(function () {
                        output.removeClass("active");
                      }, 3500);

                      captchaFlag = false;
                    } else {
                      output.html(captchaMsg[responceCode]);
                    }

                    output.addClass("active");
                  }
                });
            }

            if (!captchaFlag) {
              return false;
            }

            form.addClass('form-in-process');

            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
              output.addClass("active");
            }
          } else {
            return false;
          }
        },
        error: function (result) {
          if (isNoviBuilder)
            return;

          var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
            form = $(plugins.rdMailForm[this.extraData.counter]);

          output.text(msg[result]);
          form.removeClass('form-in-process');

          if (formHasCaptcha) {
            grecaptcha.reset();
          }
        },
        success: function (result) {
          if (isNoviBuilder)
            return;

          var form = $(plugins.rdMailForm[this.extraData.counter]),
            output = $("#" + form.attr("data-form-output")),
            select = form.find('select');

          form
            .addClass('success')
            .removeClass('form-in-process');

          if (formHasCaptcha) {
            grecaptcha.reset();
          }

          result = result.length === 5 ? result : 'MF255';
          output.text(msg[result]);

          if (result === "MF000") {
            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
            } else {
              output.addClass("active success");
            }
          } else {
            if (output.hasClass("snackbars")) {
              output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
            } else {
              output.addClass("active error");
            }
          }

          form.clearForm();

          if (select.length) {
            select.select2("val", "");
          }

          form.find('input, textarea').trigger('blur');

          setTimeout(function () {
            output.removeClass("active error success");
            form.removeClass('success');
          }, 3500);
        }
      });
    }
  }


  // lightGallery
  if (plugins.lightGallery.length) {
    for (var i = 0; i < plugins.lightGallery.length; i++) {
      initLightGallery(plugins.lightGallery[i]);
    }
  }

  // lightGallery item
  if (plugins.lightGalleryItem.length) {
    // Filter carousel items
    var notCarouselItems = [];

    for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
      if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
          !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
          !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
        notCarouselItems.push(plugins.lightGalleryItem[z]);
      }
    }

    plugins.lightGalleryItem = notCarouselItems;

    for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
      initLightGalleryItem(plugins.lightGalleryItem[i]);
    }
  }

  // Dynamic lightGallery
  if (plugins.lightDynamicGalleryItem.length) {
    for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
      initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
    }
  }


  /**
   * Product Thumbnails
   * @description Enables product thumbnails
   */
  if (plugins.productThumb.length) {
    var i;
    for (i = 0; i < plugins.productThumb.length; i++) {
      var thumbnails = $(plugins.productThumb[i]);

      thumbnails.find("li").on('click', function () {
        var item = $(this);
        item.parent().find('.active').removeClass('active');
        var image = item.parents(".product").find(".product-image-area");
        image.removeClass('animateImageIn');
        image.addClass('animateImageOut');
        item.addClass('active');
        setTimeout(function () {
          var src = item.find("img").attr("src");
          if (item.attr('data-large-image')) {
            src = item.attr('data-large-image');
          }
          image.attr("src", src);
          image.removeClass('animateImageOut');
          image.addClass('animateImageIn');
        }, 300);
      })
    }
  }

  /**
   * Select2
   * @description Enables select2 plugin
   */
  if (plugins.selectFilter.length) {
    var i;
    for (i = 0; i < plugins.selectFilter.length; i++) {
      var select = $(plugins.selectFilter[i]);

      select.select2({
        theme: "bootstrap"
      }).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
    }
  }

  /**
   * Stepper
   * @description Enables Stepper Plugin
   */
  if (plugins.stepper.length) {
    plugins.stepper.stepper({
      labels: {
        up: "",
        down: ""
      }
    });
  }



  /**
   * Popovers
   * @description Enables Popovers plugin
   */
  if (plugins.popover.length) {
    if (window.innerWidth < 767) {
      plugins.popover.attr('data-bs-placement', 'bottom');
      plugins.popover.popover();
    }
    else {
      plugins.popover.popover();
    }
  }
  

  /**
   * Bootstrap Buttons
   * @description  Enable Bootstrap Buttons plugin
   */
  if (plugins.statefulButton.length) {
    $(plugins.statefulButton).on('click', function () {
      var statefulButtonLoading = $(this).button('loading');

      setTimeout(function () {
        statefulButtonLoading.button('reset')
      }, 2000);
    })
  }


  /**
   * Circle Progress
   * @description Enable Circle Progress plugin
   */
  if (plugins.circleProgress.length) {
    var i;
    for (i = 0; i < plugins.circleProgress.length; i++) {
      var circleProgressItem = $(plugins.circleProgress[i]);
      $document
        .on("scroll", function () {
          if (!circleProgressItem.hasClass('animated')) {

            var arrayGradients = circleProgressItem.attr('data-gradient').split(",");

            circleProgressItem.circleProgress({
              value: circleProgressItem.attr('data-value'),
              size: circleProgressItem.attr('data-size') ? circleProgressItem.attr('data-size') : 175,
              fill: {gradient: arrayGradients, gradientAngle: Math.PI / 4},
              startAngle: -Math.PI / 4 * 2,
              emptyFill: $(this).attr('data-empty-fill') ? $(this).attr('data-empty-fill') : "rgb(245,245,245)"

            }).on('circle-animation-progress', function (event, progress, stepValue) {
              $(this).find('span').text(String(stepValue.toFixed(2)).replace('0.', '').replace('1.', '1'));
            });
            circleProgressItem.addClass('animated');
          }
        })
        .trigger("scroll");
    }
  }

  /**
   * Progress bar
   * @description  Enable progress bar
   */
  if (plugins.progressBar.length) {
    var i,
      bar,
      type;

    for (i = 0; i < plugins.progressBar.length; i++) {
      var progressItem = plugins.progressBar[i];
      bar = null;

      if (progressItem.className.indexOf("progress-bar-horizontal") > -1) {
        type = 'Line';
      }

      if (progressItem.className.indexOf("progress-bar-radial") > -1) {
        type = 'Circle';
      }

      if (progressItem.getAttribute("data-stroke") && progressItem.getAttribute("data-value") && type) {
        bar = new ProgressBar[type](progressItem, {
          strokeWidth: Math.round(parseFloat(progressItem.getAttribute("data-stroke")) / progressItem.offsetWidth * 100),
          trailWidth: progressItem.getAttribute("data-trail") ? Math.round(parseFloat(progressItem.getAttribute("data-trail")) / progressItem.offsetWidth * 100) : 0,
          text: {
            value: progressItem.getAttribute("data-counter") === "true" ? '0' : null,
            className: 'progress-bar__body',
            style: null
          }
        });
        bar.svg.setAttribute('preserveAspectRatio', "none meet");
        if (type === 'Line') {
          bar.svg.setAttributeNS(null, "height", progressItem.getAttribute("data-stroke"));
        }

        bar.path.removeAttribute("stroke");
        bar.path.className.baseVal = "progress-bar__stroke";
        if (bar.trail) {
          bar.trail.removeAttribute("stroke");
          bar.trail.className.baseVal = "progress-bar__trail";
        }

        if (progressItem.getAttribute("data-easing") && !isIE) {
          $(document)
            .on("scroll", {"barItem": bar}, $.proxy(function (event) {
              var bar = event.data.barItem;
              var $this = $(this);

              if (isScrolledIntoView($this) && this.className.indexOf("progress-bar--animated") === -1) {
                this.className += " progress-bar--animated";
                bar.animate(parseInt($this.attr("data-value")) / 100.0, {
                  easing: $this.attr("data-easing"),
                  duration: $this.attr("data-duration") ? parseInt($this.attr("data-duration")) : 800,
                  step: function (state, b) {
                    if (b._container.className.indexOf("progress-bar-horizontal") > -1 ||
                      b._container.className.indexOf("progress-bar-vertical") > -1) {
                      b.text.style.width = Math.abs(b.value() * 100).toFixed(0) + "%"
                    }
                    b.setText(Math.abs(b.value() * 100).toFixed(0));
                  }
                });
              }
            }, progressItem))
            .trigger("scroll");
        } else {
          bar.set(parseInt($(progressItem).attr("data-value")) / 100.0);
          bar.setText($(progressItem).attr("data-value"));
          if (type === 'Line') {
            bar.text.style.width = parseInt($(progressItem).attr("data-value")) + "%";
          }
        }
      } else {
        console.error(progressItem.className + ": progress bar type is not defined");
      }
    }
  }

  /**
   * UI To Top
   * @description Enables ToTop Button
   */
  if (isDesktop && !isNoviBuilder) {
    $().UItoTop({
      easingType: 'easeOutQuart',
      containerClass: 'ui-to-top fa fa-angle-up'
    });
  }


  // RD Navbar
  if ( plugins.rdNavbar.length ) {
    var
        navbar = plugins.rdNavbar,
        aliases = { '-': 0, '-sm-': 576, '-md-': 768, '-lg-': 992, '-xl-': 1200, '-xxl-': 1600 },
        responsive = {};

    for ( var alias in aliases ) {
      var link = responsive[ aliases[ alias ] ] = {};
      if ( navbar.attr( 'data'+ alias +'layout' ) )          link.layout        = navbar.attr( 'data'+ alias +'layout' );
      if ( navbar.attr( 'data'+ alias +'device-layout' ) )   link.deviceLayout  = navbar.attr( 'data'+ alias +'device-layout' );
      if ( navbar.attr( 'data'+ alias +'hover-on' ) )        link.focusOnHover  = navbar.attr( 'data'+ alias +'hover-on' ) === 'true';
      if ( navbar.attr( 'data'+ alias +'auto-height' ) )     link.autoHeight    = navbar.attr( 'data'+ alias +'auto-height' ) === 'true';
      if ( navbar.attr( 'data'+ alias +'stick-up-offset' ) ) link.stickUpOffset = navbar.attr( 'data'+ alias +'stick-up-offset' );
      if ( navbar.attr( 'data'+ alias +'stick-up' ) )        link.stickUp       = navbar.attr( 'data'+ alias +'stick-up' ) === 'true';
      if ( isNoviBuilder ) link.stickUp = false;
      else if ( navbar.attr( 'data'+ alias +'stick-up' ) )   link.stickUp       = navbar.attr( 'data'+ alias +'stick-up' ) === 'true';
    }

    plugins.rdNavbar.RDNavbar({
      anchorNav: !isNoviBuilder,
      stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
      responsive: responsive,
      callbacks: {
        onStuck: function () {
          var navbarSearch = this.$element.find('.rd-search input');

          if (navbarSearch) {
            navbarSearch.val('').trigger('propertychange');
          }
        },
        onDropdownOver: function () {
          return !isNoviBuilder;
        },
        onUnstuck: function () {
          if (this.$clone === null)
            return;

          var navbarSearch = this.$clone.find('.rd-search input');

          if (navbarSearch) {
            navbarSearch.val('').trigger('propertychange');
            navbarSearch.trigger('blur');
          }

        }
      }
    });
  }

  /**
   * ViewPort Universal
   * @description Add class in viewport
   */
  if (plugins.viewAnimate.length) {
    var i;
    for (i = 0; i < plugins.viewAnimate.length; i++) {
      var $view = $(plugins.viewAnimate[i]).not('.active');
      $document.on("scroll", $.proxy(function () {
        if (isScrolledIntoView(this)) {
          this.addClass("active");
        }
      }, $view))
        .trigger("scroll");
    }
  }
  
  
  // Swiper
  if (plugins.swiper.length) {
    
    for (let i = 0; i < plugins.swiper.length; i++) {
      
      let
        node = plugins.swiper[i],
        params = parseJSON(node.getAttribute('data-swiper')),
        defaults = {
          speed:      1000,
          loop:       true,
          pagination: {
            el:        '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          autoplay:   {
            delay: 5000
          }
        },
        xMode = {
          autoplay:      false,
          loop:          false,
          simulateTouch: false
        };
      
      params.on = {
        init: function () {
          setBackgrounds(this);
          setRealPrevious(this);
          initCaptionAnimate(this);
          
          // Real Previous Index must be set recent
          this.on('slideChangeTransitionEnd', function () {
            setRealPrevious(this);
          });
        }
      };
      
      new Swiper( node, Util.merge( isNoviBuilder ? [ defaults, params, xMode ] : [ defaults, params ] ) );
    }
  }


  // Owl carousel
  if (plugins.owl.length) {
    for (var i = 0; i < plugins.owl.length; i++) {
      var c = $(plugins.owl[i]);
      plugins.owl[i].owl = c;

      initOwlCarousel(c);
    }
  }



  /**
   * RD Search
   * @description Enables search
   */
  if (plugins.search.length || plugins.searchResults) {
    var handler = "bat/rd-search.php";
    var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' +
      '<p>...#{token}...</p>' +
      '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
    var defaultFilter = '*.html';

    if (plugins.search.length) {

      for (i = 0; i < plugins.search.length; i++) {
        var searchItem = $(plugins.search[i]),
          options = {
            element: searchItem,
            filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
            template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
            live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
            liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live')) : 4,
            current: 0, processed: 0, timer: {}
          };

        if ($('.rd-navbar-search-toggle').length) {
          var toggle = $('.rd-navbar-search-toggle');
          toggle.on('click', function () {
            if (!($(this).hasClass('active'))) {
              searchItem.find('input').val('').trigger('propertychange');
            }
          });
        }

        if (options.live) {
          var clearHandler = false;

          searchItem.find('input').on("keyup input propertychange", $.proxy(function () {
            this.term = this.element.find('input').val().trim();
            this.spin = this.element.find('.input-group-addon');

            clearTimeout(this.timer);

            if (this.term.length > 2) {
              this.timer = setTimeout(liveSearch(this), 200);

              if (clearHandler == false) {
                clearHandler = true;

                $("body").on("click", function (e) {
                  if ($(e.toElement).parents('.rd-search').length == 0) {
                    $('#rd-search-results-live').addClass('cleared').html('');
                  }
                })
              }

            } else if (this.term.length == 0) {
              $('#' + this.live).addClass('cleared').html('');
            }
          }, options, this));
        }

        searchItem.submit($.proxy(function () {
          $('<input />').attr('type', 'hidden')
            .attr('name', "filter")
            .attr('value', this.filter)
            .appendTo(this.element);
          return true;
        }, options, this))
      }
    }

    if (plugins.searchResults.length) {
      var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
      var match = regExp.exec(location.search);

      if (match != null) {
        $.get(handler, {
          s: decodeURI(match[1]),
          dataType: "html",
          filter: match[2],
          template: defaultTemplate,
          live: ''
        }, function (data) {
          plugins.searchResults.html(data);
        })
      }
    }
  }

  /**
   * Slick carousel
   * @description  Enable Slick carousel plugin
   */
  if (plugins.slick.length) {
    var i;
    for (i = 0; i < plugins.slick.length; i++) {
      var $slickItem = $(plugins.slick[i]);

      $slickItem.slick({
        slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll')) || 1,
        asNavFor: $slickItem.attr('data-for') || false,
        dots: $slickItem.attr("data-dots") == "true",
        infinite: $slickItem.attr("data-loop") == "true",
        focusOnSelect: true,
        arrows: $slickItem.attr("data-arrows") == "true",
        swipe: $slickItem.attr("data-swipe") == "true",
        autoplay: $slickItem.attr("data-autoplay") == "true",
        vertical: $slickItem.attr("data-vertical") == "true",
        centerMode: $slickItem.attr("data-center-mode") == "true",
        centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
        mobileFirst: true,
        responsive: [
          {
            breakpoint: 0,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-items')) || 1,
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-xs-items')) || 1,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-sm-items')) || 1,
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-md-items')) || 1,
            }
          },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-lg-items')) || 1,
            }
          }
        ]
      })
        .on('afterChange', function (event, slick, currentSlide, nextSlide) {
          var $this = $(this),
            childCarousel = $this.attr('data-child');

          if (childCarousel) {
            $(childCarousel + ' .slick-slide').removeClass('slick-current');
            $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
          }
        });
    }
  }






  /**
   * WOW
   * @description Enables Wow animation plugin
   */
  if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length && !isNoviBuilder ) {
    new WOW().init();
  }

  // Bootstrap tabs
  if (plugins.bootstrapTabs.length) {
    for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
      var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

      //If have slick carousel inside tab - resize slick carousel on click
      if (bootstrapTabsItem.find('.slick-slider').length) {
        bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
          var $this = $(this);
          var setTimeOutTime = isNoviBuilder ? 1500 : 300;

          setTimeout(function () {
            $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
          }, setTimeOutTime);
        }, bootstrapTabsItem));
      }
    }
  }

  /**
   * JQuery mousewheel plugin
   * @description  Enables jquery mousewheel plugin
   */
  if (plugins.scroller.length) {
    var i;
    for (i = 0; i < plugins.scroller.length; i++) {
      var scrollerItem = $(plugins.scroller[i]);

      scrollerItem.mCustomScrollbar({
        scrollInertia: 200,
        scrollButtons: {enable: true}
      });
    }
  }


  /**
   * RD Range
   * @description Enables RD Range plugin
   */
  if (plugins.rdRange.length) {
    plugins.rdRange.RDRange({});
  }


  /**
   * Custom Toggles
   */
  if (plugins.customToggle.length) {
    var i;

    for (i = 0; i < plugins.customToggle.length; i++) {
      var $this = $(plugins.customToggle[i]);

      $this.on('click', $.proxy(function (event) {
        event.preventDefault();
        var $ctx = $(this);
        $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
      }, $this));

      if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
        $("body").on("click", $this, function (e) {
          if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
          }
        })
      }
    }
  }



  /**
   * Custom Waypoints
   */
  if (plugins.customWaypoints.length) {
    var i;
    for (i = 0; i < plugins.customWaypoints.length; i++) {
      var $this = $(plugins.customWaypoints[i]);

      $this.on('click', function (e) {
        e.preventDefault();
        $("body, html").stop().animate({
          scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top
        }, 1000, function () {
          $(window).trigger("resize");
        });
      });
    }
  }

  // Parallax effect
  if ($top.length) {
    $(window).scroll(function () {
      if ($('html').hasClass('desktop')) {
        if ($('html').hasClass('ie-11') || $('html').hasClass('ie-edge')) {
          return;
        }
        $top.css("opacity", 1 - $(window).scrollTop() / 500);
        $top.css("top", 1 + $(window).scrollTop() / 1.5);
        $top.css("position", 'relative');
      }
    });
  }

  /**
   * RD Twitter Feed
   * @description Enables RD Twitter Feed plugin
   */
  if (plugins.twitterfeed.length > 0) {
    var i;
    for (i = 0; i < plugins.twitterfeed.length; i++) {
      var twitterfeedItem = plugins.twitterfeed[i];
      $(twitterfeedItem).RDTwitter({
        hideReplies: false,
        localTemplate: {
          avatar: "images/features/rd-twitter-post-avatar-48x48.jpg"
        },
        callback: function () {
          $window.trigger("resize");
        }
      });
    }
  }

  // Countdown
  if ( plugins.countdown.length ) {
    for ( var i = 0; i < plugins.countdown.length; i++) {
      var
        node = plugins.countdown[i],
        countdown = aCountdown({
          node:  node,
          from:  node.getAttribute( 'data-from' ),
          to:    node.getAttribute( 'data-to' ),
          count: node.getAttribute( 'data-count' ),
          tick:  100,
        });
    }
  }


});


// {{{ win-safari hacks, scratch this,
// let's just expose platform/browser to css
(function () {
  var uaMatch = '', prefix = '';

  if (navigator.userAgent.match(/Windows/)) {
    $('html').addClass('x-win');
  }
  else if (navigator.userAgent.match(/Mac OS X/)) {
    $('html').addClass('x-mac');
  }
  else if (navigator.userAgent.match(/X11/)) {
    $('html').addClass('x-x11');
  }

  // browser
  if (navigator.userAgent.match(/Chrome/)) {
    uaMatch = ' Chrome/';
    prefix = 'x-chrome';
  }
  else if (navigator.userAgent.match(/Safari/)) {
    uaMatch = ' Version/';
    prefix = 'x-safari';
  }
  else if (navigator.userAgent.match(/Firefox/)) {
    uaMatch = ' Firefox/';
    prefix = 'x-firefox';
  }
  else if (navigator.userAgent.match(/MSIE/)) {
    uaMatch = ' MSIE ';
    prefix = 'x-msie';
  }
  // add result preifx as browser class
  if (prefix) {
    $('html').addClass(prefix);

    // get major and minor versions
    // reduce, reuse, recycle
    uaMatch = new RegExp(uaMatch + '(\\d+)\.(\\d+)');
    var uaMatch = navigator.userAgent.match(uaMatch);
    if (uaMatch && uaMatch[1]) {
      // set major only version
      $('html').addClass(prefix + '-' + uaMatch[1]);
      // set major + minor versions
      $('html').addClass(prefix + '-' + uaMatch[1] + '-' + uaMatch[2]);
    }
  }



})();
// }}}