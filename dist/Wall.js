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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['wrapper'], ['wrapper']),
    _templateObject2 = _taggedTemplateLiteral(['sections'], ['sections']);

var _utils = __webpack_require__(1);

var _easing = __webpack_require__(2);

var _dom = __webpack_require__(3);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultOptions = {
  wrapperZIndex: 1,
  sectionAnimateDuration: 1,
  easeFunction: _easing.easeInOutExpo,
  loopToBottom: false,
  loopToTop: false,
  navElement: '.wall-nav',
  navItemActiveClass: 'active'
};

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
    // the position of current section, used to move currentSection
    this.currentSectionPosition = 0;

    this.currentSectionSlides = undefined;

    // mark if use transform 3d for smooth animation
    this.translateZ = _dom.hasTransform3d ? 'translateZ(0)' : '';
    // init screen size, X presents width, Y presents height
    this.size = { X: 0, Y: 0 };

    // merge default options and custom options
    this.options = (0, _utils.merge)(defaultOptions, options);
    // set up nav element
    this.navElement = typeof this.options.navElement === 'string' ? document.querySelector(this.options.navElement) : this.options.navElement;
    // if nav element exists, set nav items
    this.navItems = this.navElement && (0, _utils.toArray)(this.navElement.children);

    // animation time stamp, control speed
    this.lastTime = null;
    // requestAnimationFrame id
    this.requestId = null;
    // is animating flag
    this.isAnimating = false;
    // mark if the screen is ready to back
    this.isToBack = false;

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
      if (force) this._setupSize()._cssBody()._cssWrapper()._setupSections()._cssSections()._queueSections()._setupSlides()._cssSlides()._setupNav();

      (0, _dom.cAF)(this.requestId);
      this.isAnimating = false;

      var _sections = _toArray(this.sections);

      this.currentSection = _sections[0];
      this.restSections = _sections.slice(1);


      this._renderNavElement();

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
      var _this2 = this;

      this.sections.forEach(function (section, index) {
        section.setAttribute('data-wall-section-index', index + 1);
        section.addEventListener(_dom.mousewheelEvent, _this2._handleWheelEvent.bind(_this2));
      });
      return this;
    }
  }, {
    key: '_handleKeyDown',
    value: function _handleKeyDown(e) {
      switch (e.keyCode) {
        case 34:case 39:case 40:
          break;

        case 33:case 37:case 38:
          break;

        case 36:
          this.goToSection(1);

        case 35:
          this.goToSection(this.sections.length);

        default:
          break;
      }
    }
  }, {
    key: '_handleWheelEvent',
    value: function _handleWheelEvent(e) {
      var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      if (delta === -1) this.nextSection();
      if (delta === 1) this.prevSection();

      return this;
    }
  }, {
    key: '_setupNav',
    value: function _setupNav() {
      var _this3 = this;

      if (this.navElement) {
        this.navElement.style.zIndex = this.options.wrapperZIndex + 1;

        this.navItems.forEach(function (item, index) {
          item.setAttribute('data-wall-nav-index', index + 1);
          item.addEventListener('click', function () {
            _this3.goToSection(item.getAttribute('data-wall-nav-index'));
          });
        });
      }

      return this;
    }
  }, {
    key: '_setupSlides',
    value: function _setupSlides() {
      this.sections.forEach(function (section) {
        var slides = (0, _utils.toArray)(section.querySelectorAll('[data-wall-slide]'));
        slides.forEach(function (slide) {
          slide.style.position = 'absolute';
          slide.style.top = 0;
          slide.style.overflowX = 'hidden';
          slide.style.overflowY = 'auto';
          slide.style.right = 0;
          slide.style.bottom = 0;
          slide.style.left = 0;
        });
        slides.reverse().forEach(function (slide, index) {
          return slide.style.zIndex = index;
        });
      });
      return this;
    }
  }, {
    key: '_css',
    value: function _css() {
      return this._cssBody()._cssWrapper()._cssSections();
    }
  }, {
    key: '_cssBody',
    value: function _cssBody() {
      body.style.margin = 0;
      body.style.overflow = 'hidden';
      return this;
    }
  }, {
    key: '_cssWrapper',
    value: function _cssWrapper() {
      this.wrapper.style.zIndex = this.options.wrapperZIndex;
      this.wrapper.style.height = this.size.Y + 'px';
      this.wrapper.style.width = '100%';
      this.wrapper.style.overflow = 'hidden';
      this.wrapper.style.position = 'relative';
      return this;
    }
  }, {
    key: '_cssSections',
    value: function _cssSections() {
      this.sections.forEach(function (section) {
        section.style.position = 'absolute';
        section.style.top = 0;
        section.style.overflowX = 'hidden';
        section.style.overflowY = 'auto';
        section.style.right = 0;
        section.style.bottom = 0;
        section.style.left = 0;
      });
      return this;
    }
  }, {
    key: '_cssSlides',
    value: function _cssSlides() {
      var slides = (0, _utils.toArray)(this.wrapper.querySelectorAll('[data-wall-slide]'));
      slides.forEach(function (slide) {
        slide.style.position = 'absolute';
        slide.style.top = 0;
        slide.style.overflowX = 'hidden';
        slide.style.overflowY = 'auto';
        slide.style.right = 0;
        slide.style.bottom = 0;
        slide.style.left = 0;
      });
      return this;
    }
  }, {
    key: '_queueSections',
    value: function _queueSections() {
      var _this4 = this;

      this.sections.reverse().forEach(function (section, index) {
        section.style.zIndex = index + 1;
      });
      this.sections.reverse();

      this.sections.forEach(function (section) {
        return _this4._renderSectionPosition(section, 0);
      });

      return this;
    }
  }, {
    key: '_refreshAnimateStatus',
    value: function _refreshAnimateStatus(isToBack) {
      this.isToBack = isToBack;
      (0, _dom.cAF)(this.requestId);
      this.currentSectionPosition = this.isToBack ? 100 : 0;
      this.isAnimating = true;
      this.lastTime = Date.now();
      return this;
    }
  }, {
    key: '_animateCurrentSection',
    value: function _animateCurrentSection() {

      var now = Date.now();
      var delta = (now - this.lastTime) / 1000;

      this.currentSection.style.zIndex = this.sections.length + 1;

      this._updateCurrentSectionPosition(delta)._renderSectionPosition(this.currentSection, this.currentSectionPosition);

      if (this.currentSectionPosition >= 100 || this.currentSectionPosition < 0.1 && this.isToBack) {
        return this._refresh()._queueSections();
      };

      if (this.isAnimating) {
        return this.requestId = (0, _dom.rAF)(this._animateCurrentSection.bind(this));
      };
    }
  }, {
    key: '_updateCurrentSectionPosition',
    value: function _updateCurrentSectionPosition(delta) {
      var duration = this.currentSection.getAttribute('data-wall-animate-duration') || this.options.sectionAnimateDuration;
      var target = this.isToBack ? 0 : 100;

      this.currentSectionPosition = this.options.easeFunction(delta, this.currentSectionPosition, target - this.currentSectionPosition, duration);

      return this;
    }
  }, {
    key: '_renderSectionPosition',
    value: function _renderSectionPosition(section, pos) {
      section.style[_dom.transformProp] = 'translate(0, -' + pos + '%) ' + this.translateZ;
    }
  }, {
    key: 'getCurrentSectionIndex',
    value: function getCurrentSectionIndex() {
      return this.currentSection.getAttribute('data-wall-section-index');
    }
  }, {
    key: '_renderNavElement',
    value: function _renderNavElement() {
      var _this5 = this;

      if (this.navElement) {
        var navItemActiveClass = this.options.navItemActiveClass;

        this.navItems.forEach(function (item) {
          (0, _utils.removeClass)(item, navItemActiveClass);
        });

        var currentNav = this.navItems.find(function (item) {
          return item.getAttribute('data-wall-nav-index') === _this5.getCurrentSectionIndex();
        });
        (0, _utils.addClass)(currentNav, navItemActiveClass);
      }
    }
  }, {
    key: 'prevSection',
    value: function prevSection() {
      if (!(this.currentSection.scrollTop === 0) || !this.options.loopToBottom && this.getCurrentSectionIndex() == 1) return;

      if (!this.isAnimating) {
        var _sections$reverse = this.sections.reverse();
        // reverse the sections array and set the last section to be the current section


        var _sections$reverse2 = _toArray(_sections$reverse);

        this.currentSection = _sections$reverse2[0];
        this.restSections = _sections$reverse2.slice(1);

        this.sections = [this.currentSection].concat(_toConsumableArray(this.restSections.reverse()));

        this._refreshAnimateStatus(true)._animateCurrentSection();
      }
    }
  }, {
    key: 'nextSection',
    value: function nextSection() {
      var _currentSection = this.currentSection,
          scrollHeight = _currentSection.scrollHeight,
          scrollTop = _currentSection.scrollTop,
          clientHeight = _currentSection.clientHeight;


      if (!(scrollHeight - scrollTop === clientHeight) || !this.options.loopToTop && this.getCurrentSectionIndex() == this.sections.length) return;

      if (!this.isAnimating) {
        // move current section to last of the queue
        this.sections = [].concat(_toConsumableArray(this.restSections), [this.currentSection]);

        this._refreshAnimateStatus(false)._animateCurrentSection();
      }
    }
  }, {
    key: 'goToSection',
    value: function goToSection(index) {

      if (index === this.getCurrentSectionIndex()) return;

      if (!this.isAnimating) {
        this.sections = (0, _utils.toArray)(this.wrapper.children);
        var targetSection = this.sections.find(function (section) {
          return section.getAttribute('data-wall-section-index') == index;
        });

        var prevSections = this.sections.slice(0, index - 1);
        var nextSections = this.sections.slice(index);

        this.sections = [targetSection].concat(_toConsumableArray(nextSections), _toConsumableArray(prevSections));

        this._refreshAnimateStatus(index < this.getCurrentSectionIndex());

        if (this.isToBack) {
          this.currentSection = targetSection;
        } else {
          this._queueSections();
        }

        this._animateCurrentSection();
      }
    }
  }]);

  return Wall;
}();

module.exports = Wall;

/***/ }),
/* 1 */
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
  if (el.classList) el.classList.remove(className);else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    el.className = el.className.replace(reg, ' ');
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var easeInOutExpo = exports.easeInOutExpo = function easeInOutExpo(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  t--;
  return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
};

var easeInOutSine = exports.easeInOutSine = function easeInOutSine(t, b, c, d) {
  return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};

/***/ }),
/* 3 */
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
      console.log(vendors[vendor]);
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
  return window.innerWidth && document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

var getScreenHeight = exports.getScreenHeight = function getScreenHeight() {
  return window.innerHeight && document.documentElement.clientHeight ? Math.min(window.innerHeight, document.documentElement.clientHeight) : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=wall.js.map