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
  animateDirection: 'top',
  easeFunction: _easing.easeInOutExpo,
  speed: 1.2
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
    // get first of array as current section, and others as rest sections

    // the position of current section
    var _sections = _toArray(this.sections);

    this.currentSection = _sections[0];
    this.restSections = _sections.slice(1);
    this.currentSectionPosition = 0;
    // mark if use transform 3d for smooth animation
    this.translateZ = _dom.hasTransform3d ? 'translateZ(0)' : '';
    // init screen size, X presents width, Y presents height
    this.size = { X: 0, Y: 0 };
    // merge default options and custom options
    this.options = (0, _utils.merge)(defaultOptions, options);
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
    }
  }, {
    key: '_refresh',
    value: function _refresh(force) {
      if (force) this._setupSize()._setupSections()._css()._queueSections();
      this.isToBack = false;
      this.isAnimating = false;
      this.currentSectionPosition = 0;
      (0, _utils.cAF)(this.requestId);
      return this;
    }
  }, {
    key: '_setupSize',
    value: function _setupSize() {
      this.size.X = (0, _utils.getScreenWidth)();
      this.size.Y = (0, _utils.getScreenHeight)();
      return this;
    }
  }, {
    key: '_setupSections',
    value: function _setupSections() {
      this.sections.forEach(function (section, index) {
        section.setAttribute('data-section-index', index + 1);
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
        section.style.right = 0;
        section.style.bottom = 0;
        section.style.left = 0;
      });
      return this;
    }
  }, {
    key: '_queueSections',
    value: function _queueSections() {
      var _this2 = this;

      this.sections.reverse().forEach(function (section, index) {
        section.style.zIndex = index + 1;
      });
      this.sections.reverse();

      var _sections2 = _toArray(this.sections);

      this.currentSection = _sections2[0];
      this.restSections = _sections2.slice(1);

      this.sections.forEach(function (section) {
        _this2._renderSectionPosition(section, 0);
      });
      return this;
    }
  }, {
    key: '_animate',
    value: function _animate() {
      var now = Date.now();
      var delta = (now - this.lastTime) / 1000;

      this._updateSectionPosition(delta)._renderSectionPosition(this.currentSection, this.currentSectionPosition);

      if (this.currentSectionPosition >= 100 || this.currentSectionPosition < 0.1 && this.isToBack) {
        return this._refresh()._queueSections();
      };

      if (this.isAnimating) {
        return this.requestId = (0, _utils.rAF)(this._animate.bind(this));
      };
    }
  }, {
    key: '_updateSectionPosition',
    value: function _updateSectionPosition(delta) {
      var speed = this.currentSection.getAttribute('data-speed') || this.options.speed;
      var target = this.isToBack ? 0 : 100;
      this.currentSectionPosition = this.options.easeFunction(delta, this.currentSectionPosition, target - this.currentSectionPosition, speed);

      return this;
    }
  }, {
    key: '_renderSectionPosition',
    value: function _renderSectionPosition(section, pos) {
      switch (this.options.animateDirection) {
        case 'top':
          section.style[_utils.transformProp] = 'translate(0, -' + pos + '%) ' + this.translateZ;
          break;
        case 'bottom':
          section.style[_utils.transformProp] = 'translate(0, ' + pos + '%) ' + this.translateZ;
          break;
        case 'left':
          section.style[_utils.transformProp] = 'translate(-' + pos + '%, 0) ' + this.translateZ;
          break;
        case 'right':
          section.style[_utils.transformProp] = 'translate(' + pos + '%, 0) ' + this.translateZ;
          break;

        default:
          break;
      }
    }
  }, {
    key: 'prev',
    value: function prev() {
      if (!this.isAnimating) {
        var _sections$reverse = this.sections.reverse();

        var _sections$reverse2 = _toArray(_sections$reverse);

        this.currentSection = _sections$reverse2[0];
        this.restSections = _sections$reverse2.slice(1);

        this.sections = [this.currentSection].concat(_toConsumableArray(this.restSections.reverse()));

        this._renderSectionPosition(this.currentSection, 100);
        this._queueSections();
        this.currentSectionPosition = 100;

        this.isToBack = true;
        this.isAnimating = true;
        this.lastTime = Date.now();

        this._animate();
      }
    }
  }, {
    key: 'next',
    value: function next() {
      if (!this.isAnimating) {
        this.sections = [].concat(_toConsumableArray(this.restSections), [this.currentSection]);

        this.isToBack = false;
        this.isAnimating = true;
        this.lastTime = Date.now();

        this._animate();
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
var rAF = exports.rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
  setTimeout(callback, 1000 / 60);
};

var cAF = exports.cAF = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (id) {
  clearTimeout(id);
};

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

var transformProp = exports.transformProp = function () {
  var testElement = document.createElement('div');

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

var getScreenWidth = exports.getScreenWidth = function getScreenWidth() {
  return window.innerWidth && document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

var getScreenHeight = exports.getScreenHeight = function getScreenHeight() {
  return window.innerHeight && document.documentElement.clientHeight ? Math.min(window.innerHeight, document.documentElement.clientHeight) : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
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

/***/ })
/******/ ]);
});
//# sourceMappingURL=wall.js.map