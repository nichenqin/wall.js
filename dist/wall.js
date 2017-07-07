(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Wall"] = factory();
	else
		root["Wall"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var testElement = document.createElement('div');

var hasTransform3d = exports.hasTransform3d = 'WebkitPerspective' in testElement.style || 'MozPerspective' in testElement.style || 'msPerspective' in testElement.style || 'OPerspective' in testElement.style || 'perspective' in testElement.style;

var transformProp = exports.transformProp = function () {
  if (!('transform' in testElement.style)) {
    var vendors = ['Webkit', 'Moz', 'ms'];
    for (var vendor in vendors) {
      if (vendors[vendor] + 'Transform' in testElement.style) {
        return vendors[vendor] + 'Transform';
      }
    }
  }
  return 'transform';
}();

var mousewheelEvent = exports.mousewheelEvent = 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

var rAF = exports.rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
  setTimeout(callback, 1000 / 60);
};

var cAF = exports.cAF = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (id) {
  clearTimeout(id);
};

var getScreenWidth = exports.getScreenWidth = function getScreenWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

var getScreenHeight = exports.getScreenHeight = function getScreenHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

var maxScreen = exports.maxScreen = function maxScreen(el) {
  el.style.position = 'absolute';
  el.style.top = 0;
  el.style.right = 0;
  el.style.bottom = 0;
  el.style.left = 0;
};

var isScrollable = exports.isScrollable = function isScrollable(_ref) {
  var scrollHeight = _ref.scrollHeight,
      clientHeight = _ref.clientHeight;
  return clientHeight < scrollHeight;
};

var scrollTouchBottom = exports.scrollTouchBottom = function scrollTouchBottom(_ref2) {
  var scrollTop = _ref2.scrollTop,
      scrollHeight = _ref2.scrollHeight,
      clientHeight = _ref2.clientHeight;
  return scrollHeight - scrollTop <= clientHeight;
};

var scrollTouchTop = exports.scrollTouchTop = function scrollTouchTop(screen) {
  return screen.scrollTop === 0;
};

var touchEvent = exports.touchEvent = {
  touchStart: 'touchstart',
  touchMove: 'touchmove'
};

if (window.navigator.msPointerEnabled) {
  touchEvent.touchStart = 'MSPointerDown';
  touchEvent.touchMove = 'MSPointerMove';
} else if (window.navigator.pointerEnabled) {
  touchEvent.touchStart = 'pointerdown';
  touchEvent.touchMove = 'pointermove';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['wrapper'], ['wrapper']),
    _templateObject2 = _taggedTemplateLiteral(['sections'], ['sections']);

var _utils = __webpack_require__(2);

var _dom = __webpack_require__(0);

var _events = __webpack_require__(3);

var _easing = __webpack_require__(5);

var easing = _interopRequireWildcard(_easing);

__webpack_require__(6);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SCREEN_SECTION = 'section';
var SCREEN_SLIDE = 'slide';
var DATA_PRE = 'data-wall';

var ANIMATE_DURATION = DATA_PRE + '-animate-duration';

var CURRENT_INDEX = DATA_PRE + '-current-section';

var SECTION_NAV = DATA_PRE + '-section-nav';
var SECTION_INDEX = DATA_PRE + '-section-index';

var SECTION_NAV_INDEX = DATA_PRE + '-section-nav-index';

var SLIDE = DATA_PRE + '-slide';
var SLIDE_INDEX = DATA_PRE + '-slide-index';
var SLIDE_ARROW = DATA_PRE + '-slide-arrow';

var IMAGE_ORIGIN = DATA_PRE + '-origin';

var defaultOptions = {
  wrapperZIndex: 1,
  sectionAnimateDuration: 1,
  easeFunction: 'easeIn',
  loopToBottom: false,
  loopToTop: false,
  sectionNavItemActiveClass: 'active',
  animatingClass: 'animating',
  currentClass: 'current'
};

var html = document.getElementsByTagName('html')[0];
var body = document.getElementsByTagName('body')[0];

var Wall = function () {
  function Wall() {
    var wrapper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _utils.throwNewError)(_templateObject);
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;

    _classCallCheck(this, Wall);

    // get wrapper which contains sections
    this.wrapper = typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper;
    // get child sections, if no section contains, throw a new error
    this.sections = this.wrapper.children.length ? (0, _utils.toArray)(this.wrapper.children) : (0, _utils.throwNewError)(_templateObject2);
    this.currentSection = null;
    this.restSections = null;

    this.currentSlides = null;
    this.currentSlide = null;
    this.restSlides = null;

    // the position of current section, used to move currentSection
    this.currentScreenPosition = 0;

    // mark if use transform 3d for smooth animation
    this.translateZ = _dom.hasTransform3d ? 'translateZ(0)' : '';
    // init screen size, X presents width, Y presents height
    this.size = { X: 0, Y: 0 };

    // merge default options and custom options
    this.options = (0, _utils.merge)(defaultOptions, options);
    // set up nav element
    this.navElements = (0, _utils.toArray)(document.querySelectorAll('[' + SECTION_NAV + ']'));

    this.easeFunction = typeof this.options.easeFunction === 'string' ? easing[this.options.easeFunction] : this.options.easeFunction;

    // animation time stamp, control speed
    this.lastTime = null;
    // requestAnimationFrame id
    this.requestId = null;
    // is animating flag
    this.isAnimating = false;
    // mark if the screen is ready to back
    this.isToBack = false;
    this.screenType = SCREEN_SECTION;

    this._init();
  }

  _createClass(Wall, [{
    key: '_init',
    value: function _init() {
      var _this = this;

      this._refresh(true);

      window.addEventListener('resize', function () {
        _this._setupSize()._cssWrapper();
      });
      document.addEventListener('keydown', this._handleKeyDown.bind(this));
    }
  }, {
    key: '_refresh',
    value: function _refresh(force) {
      var _this2 = this;

      if (force) this._setupSize()._cssHtmlAndBody()._cssWrapper()._setupSections()._cssSections()._queue(this.sections)._setupSlides()._setupSectionNav();

      (0, _dom.cAF)(this.requestId);
      this.isAnimating = false;

      (0, _utils.removeClass)(this.currentSection, this.options.animatingClass);
      this.sections.forEach(function (section) {
        return (0, _utils.removeClass)(section, _this2.options.currentClass);
      });

      var _sections = _toArray(this.sections);

      this.currentSection = _sections[0];
      this.restSections = _sections.slice(1);

      (0, _utils.addClass)(this.currentSection, this.options.currentClass);

      if (this.currentSlides.length && this.currentSlide) {
        (0, _utils.removeClass)(this.currentSlide, this.options.animatingClass);
        this.currentSlides.forEach(function (slide) {
          return (0, _utils.removeClass)(slide, _this2.options.currentClass);
        });
      }

      var _currentSlides = _toArray(this.currentSlides);

      this.currentSlide = _currentSlides[0];
      this.restSlides = _currentSlides.slice(1);

      if (this.currentSlides.length && this.currentSlide) {
        (0, _utils.addClass)(this.currentSlide, this.options.currentClass);
      }

      this._renderSectionNavs();
      this._lazyload(this.currentSection);
      this.wrapper.setAttribute(CURRENT_INDEX, this._getCurrentSectionIndex());

      return this;
    }
  }, {
    key: '_setupSize',
    value: function _setupSize() {
      this.size.X = (0, _dom.getScreenWidth)();
      this.size.Y = (0, _dom.getScreenHeight)();
      return this;
    }
  }, {
    key: '_setupSections',
    value: function _setupSections() {
      var _this3 = this;

      var _sections2 = _toArray(this.sections);

      this.currentSection = _sections2[0];
      this.restSections = _sections2.slice(1);


      this.sections.forEach(function (section, index) {
        section.setAttribute(SECTION_INDEX, index + 1);
        section.addEventListener(_dom.mousewheelEvent, _this3._handleWheelEvent.bind(_this3));
        (0, _events.handleTouch)(section, _this3);
      });
      return this;
    }
  }, {
    key: '_handleKeyDown',
    value: function _handleKeyDown(e) {
      switch (e.keyCode) {
        case 34:case 40:
          if ((0, _dom.scrollTouchBottom)(this.currentSection)) this.nextSection();break;
        case 33:case 38:
          if ((0, _dom.scrollTouchTop)(this.currentSection)) this.prevSection();break;
        case 37:
          if (this.currentSlide) this.prevSlide();break;
        case 39:
          if (this.currentSlide) this.nextSlide();break;
        case 36:
          this.goToSection(1);break;
        case 35:
          this.goToSection(this.sections.length);break;
      }
    }
  }, {
    key: '_handleWheelEvent',
    value: function _handleWheelEvent(e) {
      var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));

      if ((0, _dom.scrollTouchBottom)(this.currentSection) && delta === -1) this.nextSection();
      if ((0, _dom.scrollTouchTop)(this.currentSection) && delta === 1) this.prevSection();

      return this;
    }
  }, {
    key: '_setupSectionNav',
    value: function _setupSectionNav() {
      var _this4 = this;

      if (this.navElements && this.navElements.length) {
        this.navElements.forEach(function (navElement) {
          navElement.style.zIndex = _this4.options.wrapperZIndex + 1;

          var navItems = (0, _utils.toArray)(navElement.children);
          navItems.forEach(function (item, index) {
            item.setAttribute(SECTION_NAV_INDEX, index + 1);
            item.addEventListener('click', function () {
              _this4.goToSection(item.getAttribute(SECTION_NAV_INDEX));
            });
          });
        });
      }

      return this;
    }
  }, {
    key: '_setupSlides',
    value: function _setupSlides() {
      this.currentSlides = (0, _utils.toArray)(this.currentSection.querySelectorAll('[' + SLIDE + ']'));

      this.sections.forEach(function (section) {
        var slides = (0, _utils.toArray)(section.querySelectorAll('[' + SLIDE + ']'));
        var arrows = (0, _utils.toArray)(section.querySelectorAll('[' + SLIDE_ARROW + ']'));
        if (slides.length) {
          slides.forEach(function (slide, index) {
            (0, _dom.maxScreen)(slide);
            slide.style.overflowX = 'hidden';
            slide.style.overflowY = 'auto';

            slide.setAttribute(SLIDE_INDEX, index + 1);
          });
          slides.reverse().forEach(function (slide, index) {
            return slide.style.zIndex = index + 1;
          });

          if (arrows.length) {
            arrows.forEach(function (arrow) {
              return arrow.style.zIndex = slides.length + 1;
            });
          }
        }
      });
      return this;
    }
  }, {
    key: '_cssHtmlAndBody',
    value: function _cssHtmlAndBody() {
      html.style.height = '100%';
      html.style.overflow = 'hidden';
      body.style.height = '100%';
      body.style.position = 'relative';
      body.style.margin = 0;
      body.style.overflow = 'hidden';
      return this;
    }
  }, {
    key: '_cssWrapper',
    value: function _cssWrapper() {
      this.wrapper.style.position = 'relative';
      this.wrapper.style.height = '100%';
      this.wrapper.style.zIndex = this.options.wrapperZIndex;
      return this;
    }
  }, {
    key: '_cssSections',
    value: function _cssSections() {
      var _this5 = this;

      this.sections.forEach(function (section) {
        (0, _dom.maxScreen)(section);
        section.style.height = _this5.size.Y + 'px';
        section.style.overflowX = 'hidden';
        section.style.overflowY = 'auto';
      });
      return this;
    }
  }, {
    key: '_lazyload',
    value: function _lazyload(currentScreen) {
      var images = (0, _utils.toArray)(currentScreen.querySelectorAll('[' + IMAGE_ORIGIN + ']'));
      images.forEach(function (image) {
        return image.setAttribute('src', image.getAttribute(IMAGE_ORIGIN));
      });
    }
  }, {
    key: '_queue',
    value: function _queue(screenList) {
      var _this6 = this;

      screenList.reverse().forEach(function (section, index) {
        section.style.zIndex = index + 1;
      });
      screenList.reverse();

      screenList.forEach(function (section) {
        return _this6._renderSectionPosition(section, 0);
      });

      return this;
    }
  }, {
    key: '_resetCurrentSlides',
    value: function _resetCurrentSlides() {
      var _sections3 = _toArray(this.sections);

      this.currentSection = _sections3[0];
      this.restSections = _sections3.slice(1);


      this.currentSlides = (0, _utils.toArray)(this.currentSection.querySelectorAll('[' + SLIDE + ']')).sort(function (a, b) {
        return +b.style.zIndex - +a.style.zIndex;
      });

      if (this.currentSlide) (0, _utils.removeClass)(this.currentSlide, this.options.currentClass);

      var _currentSlides2 = _toArray(this.currentSlides);

      this.currentSlide = _currentSlides2[0];
      this.restSlides = _currentSlides2.slice(1);

      if (this.currentSlide) (0, _utils.addClass)(this.currentSlide, this.options.currentClass);

      return this;
    }
  }, {
    key: '_refreshAnimateStatus',
    value: function _refreshAnimateStatus(isToBack) {
      this.isToBack = isToBack;
      (0, _dom.cAF)(this.requestId);
      this.currentScreenPosition = this.isToBack ? 100 : 0;
      this.isAnimating = true;
      this.lastTime = Date.now();

      if (this.screenType === SCREEN_SECTION) {
        (0, _utils.addClass)(this.currentSection, this.options.animatingClass);
      } else if (this.currentSlide && this.screenType === SCREEN_SLIDE) {
        (0, _utils.addClass)(this.currentSlide, this.options.animatingClass);
      }
      return this;
    }
  }, {
    key: '_animateScreen',
    value: function _animateScreen(currentScreen, screenList) {
      var now = Date.now();
      var delta = (now - this.lastTime) / 1000;

      currentScreen.style.zIndex = screenList.length + 1;

      this._updateCurrentScreenPosition(delta)._renderSectionPosition(currentScreen, this.currentScreenPosition);

      var shouldStop = this.currentScreenPosition > 99.9 && !this.isToBack || this.currentScreenPosition < 0.1 && this.isToBack;

      if (shouldStop) {
        this._refresh()._queue(screenList);
        if (this.screenType === SCREEN_SECTION) this._resetCurrentSlides();
        return this;
      };

      if (this.isAnimating) {
        return this.requestId = (0, _dom.rAF)(this._animateScreen.bind(this, currentScreen, screenList));
      };
    }
  }, {
    key: '_updateCurrentScreenPosition',
    value: function _updateCurrentScreenPosition(delta) {
      var currentDuration = this.screenType === SCREEN_SECTION ? +this.currentSection.getAttribute(ANIMATE_DURATION) : +this.currentSlide.getAttribute(ANIMATE_DURATION);
      var duration = currentDuration || this.options.sectionAnimateDuration;
      var target = this.isToBack ? 0 : 100;

      this.currentScreenPosition = this.easeFunction(delta, this.currentScreenPosition, target - this.currentScreenPosition, duration);
      return this;
    }
  }, {
    key: '_renderSectionPosition',
    value: function _renderSectionPosition(screen, pos) {
      switch (this.screenType) {
        case SCREEN_SECTION:
          screen.style[_dom.transformProp] = 'translate(0, -' + pos + '%) ' + this.translateZ;
          break;
        case SCREEN_SLIDE:
          screen.style[_dom.transformProp] = 'translate(-' + pos + '%, 0) ' + this.translateZ;
          break;
      }
    }
  }, {
    key: '_getCurrentSectionIndex',
    value: function _getCurrentSectionIndex() {
      return this.currentSection.getAttribute(SECTION_INDEX);
    }
  }, {
    key: '_renderSectionNavs',
    value: function _renderSectionNavs() {
      var _this7 = this;

      if (this.navElements && this.navElements.length) {
        var sectionNavItemActiveClass = this.options.sectionNavItemActiveClass;


        this.navElements.forEach(function (navElement) {
          var navItems = (0, _utils.toArray)(navElement.children);
          navItems.forEach(function (item) {
            return (0, _utils.removeClass)(item, sectionNavItemActiveClass);
          });

          var currentNav = navItems.find(function (item) {
            return item.getAttribute(SECTION_NAV_INDEX) === _this7._getCurrentSectionIndex();
          });
          (0, _utils.addClass)(currentNav, sectionNavItemActiveClass);
        });
      }
    }
  }, {
    key: 'prevSection',
    value: function prevSection() {
      if (!this.options.loopToBottom && this._getCurrentSectionIndex() == 1) return;

      if (!this.isAnimating) {
        var _sections$reverse = this.sections.reverse();
        // reverse the sections array and set the last section to be the current section


        var _sections$reverse2 = _toArray(_sections$reverse);

        this.currentSection = _sections$reverse2[0];
        this.restSections = _sections$reverse2.slice(1);

        this.sections = [this.currentSection].concat(_toConsumableArray(this.restSections.reverse()));
        this.screenType = SCREEN_SECTION;

        this._refreshAnimateStatus(true)._animateScreen(this.currentSection, this.sections);
      }
    }
  }, {
    key: 'nextSection',
    value: function nextSection() {
      if (!this.options.loopToTop && this._getCurrentSectionIndex() == this.sections.length) return;

      if (!this.isAnimating) {
        // move current section to last of the queue
        this.sections = [].concat(_toConsumableArray(this.restSections), [this.currentSection]);
        this.screenType = SCREEN_SECTION;

        this._refreshAnimateStatus(false)._animateScreen(this.currentSection, this.sections);
      }
    }
  }, {
    key: 'goToSection',
    value: function goToSection(index) {
      if (index === this._getCurrentSectionIndex()) return;

      if (!this.isAnimating) {
        this.isToBack = index < this._getCurrentSectionIndex();

        this.sections = (0, _utils.toArray)(this.wrapper.children);
        var targetSection = this.sections.find(function (section) {
          return section.getAttribute(SECTION_INDEX) == index;
        });
        var prevSections = this.sections.slice(0, index - 1);
        var nextSections = this.sections.slice(index);
        this.sections = [targetSection].concat(_toConsumableArray(nextSections), _toConsumableArray(prevSections));

        if (this.isToBack) {
          this.currentSection = targetSection;
        } else {
          this._queue(this.sections);
        }

        this.screenType = SCREEN_SECTION;
        this._refreshAnimateStatus(this.isToBack)._animateScreen(this.currentSection, this.sections);
      }
    }
  }, {
    key: 'prevSlide',
    value: function prevSlide() {
      if (!this.isAnimating) {
        var _currentSlides$revers = this.currentSlides.reverse();

        var _currentSlides$revers2 = _toArray(_currentSlides$revers);

        this.currentSlide = _currentSlides$revers2[0];
        this.restSlides = _currentSlides$revers2.slice(1);

        this.currentSlides = [this.currentSlide].concat(_toConsumableArray(this.restSlides.reverse()));
        this.screenType = SCREEN_SLIDE;

        this._refreshAnimateStatus(true)._animateScreen(this.currentSlide, this.currentSlides);
      }
    }
  }, {
    key: 'nextSlide',
    value: function nextSlide() {
      if (!this.isAnimating) {
        this.currentSlides = [].concat(_toConsumableArray(this.restSlides), [this.currentSlide]);
        this.screenType = SCREEN_SLIDE;

        this._refreshAnimateStatus(false)._animateScreen(this.currentSlide, this.currentSlides);
      }
    }
  }]);

  return Wall;
}();

module.exports = Wall;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var throwNewError = exports.throwNewError = function throwNewError(p) {
  throw new Error(p + ' is required');
};

var toArray = exports.toArray = function toArray(o) {
  return Array.prototype.slice.call(o);
};

var merge = exports.merge = function merge(targetObj, obj) {
  Object.keys(obj).forEach(function (key) {
    targetObj[key] = obj[key];
  });
  return targetObj;
};

var hasClass = function hasClass(el, className) {
  if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

var addClass = exports.addClass = function addClass(el, className) {
  if (el.classList) el.classList.add(className);else if (!hasClass(el, className)) el.className += " " + className;
};

var removeClass = exports.removeClass = function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    el.className = el.className.replace(reg, ' ');
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _touch = __webpack_require__(4);

var _touch2 = _interopRequireDefault(_touch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = { handleTouch: _touch2.default };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dom = __webpack_require__(0);

var handleTouch = function handleTouch(el, context) {

  var start = { X: 0, Y: 0 };
  var end = { X: 0, Y: 0 };

  var handleTouchStart = function handleTouchStart(e) {
    var touch = e.touches ? e.touches[0] : e;
    start.X = touch.pageX;
    start.Y = touch.pageY;
  };

  var handleTouchMove = function handleTouchMove(e) {
    if (context.isAnimating) return;

    var touch = e.touches ? e.touches[0] : e;
    end.X = touch.pageX;
    end.Y = touch.pageY;
    var diffX = start.X - end.X;
    var diffY = start.Y - end.Y;

    var isVertical = Math.abs(diffY) - Math.abs(diffX) > 0;

    if (isVertical) {
      if (diffY > 200 && (0, _dom.scrollTouchBottom)(el)) return context.nextSection();
      if (diffY > -200 && diffY < 0 && (0, _dom.scrollTouchTop)(el)) return context.prevSection();
    } else {
      if (context.currentSlide) {
        if (diffX > 200) return context.nextSlide();
        if (diffX > -200 && diffX < 0) return context.prevSlide();
      }
    }
  };

  el.addEventListener(_dom.touchEvent.touchStart, handleTouchStart, false);
  el.addEventListener(_dom.touchEvent.touchMove, handleTouchMove, false);
};

exports.default = handleTouch;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var linear = exports.linear = function linear(t, b, c, d) {
  return c * t / d + b;
};

var easeIn = exports.easeIn = function easeIn(t, b, c, d) {
  return c * Math.pow(2, 10 * (t / d - 1)) + b;
};

var easeOut = exports.easeOut = function easeOut(t, b, c, d) {
  return c * (-Math.pow(2, -10 * t / d) + 1) + b;
};

var easeInOut = exports.easeInOut = function easeInOut(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  t--;
  return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=wall.js.map