import { rAF, cAF, toArray, throwNewError, merge, getScreenHeight, getScreenWidth, transformProp } from './utils';
import { easeInOutExpo } from './easing';

const defaultOptions = {
  animationDirection: 'toTop',
  easeFunction: easeInOutExpo,
  speed: 1.2
};

const body = document.getElementsByTagName('body')[0];

class Wall {

  constructor(wrapper = throwNewError`wrapper`, options = defaultOptions) {
    // get wrapper which contains sections
    this.wrapper = typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper;
    // get child sections, if no section contains, throw a new error
    this.sections = this.wrapper.children.length ? toArray(this.wrapper.children) : throwNewError`sections`;
    // get first of array as current section, and others as rest sections
    [this.currentSection, ...this.restSections] = this.sections;
    this.currentSectionPosition = 0;
    // init section as an empty object, all configs about section will set inside the object
    this.sectionConfig = {};
    // init screen size, X presents width, Y presents height
    this.size = { X: 0, Y: 0 };
    // merge default options and custom options
    this.options = merge(defaultOptions, options);
    // animation time stamp
    this.lastTime = null;
    // requestAnimationFrame id
    this.requestId = null;
    // is animating flag
    this.isAnimating = false;
    this.isToBack = false;

    this._init();
  }

  _init() {
    this._refresh(true);

    window.addEventListener('resize', () => { this._setupSize()._cssWrapper(); });
  }

  _refresh(force) {
    if (force)
      this._setupSize()._setupSections()
        ._css()
        ._queueSections();
    this.isToBack = false;
    this.isAnimating = false;
    this.currentSectionPosition = 0;
    cAF(this.requestId);
    return this;
  }

  _setupSize() {
    this.size.X = getScreenWidth();
    this.size.Y = getScreenHeight();
    return this;
  }

  _setupSections() {
    this.sections.forEach((section, index) => {
      section.setAttribute('data-section-index', index + 1);
    });
    return this;
  }

  _css() {
    return this._cssBody()._cssWrapper()._cssSections();
  }

  _cssBody() {
    body.style.margin = 0;
    body.style.overflow = 'hidden';
    return this;
  }

  _cssWrapper() {
    this.wrapper.style.height = this.size.Y + 'px';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.position = 'relative';
    return this;
  }

  _cssSections() {
    this.sections.forEach(section => {
      section.style.position = 'absolute';
      section.style.top = 0;
      section.style.right = 0;
      section.style.bottom = 0;
      section.style.left = 0;
    });
    return this;
  }

  _queueSections() {
    this.sections.reverse().forEach((section, index) => {
      section.style.zIndex = index + 1;
    });
    this.sections.reverse();
    [this.currentSection, ...this.restSections] = this.sections;
    this.restSections.forEach(section => { this._renderSectionPosition(section, 0, 0); });
    return this;
  }

  _animate() {
    const now = Date.now();
    const delta = (now - this.lastTime) / 1000;

    this
      ._updateSectionPosition(delta)
      ._renderSectionPosition(this.currentSection, 0, this.currentSectionPosition);

    if (this.currentSectionPosition >= 100 || this.currentSectionPosition <= 0) {
      console.log('stop');
      return this._refresh()._queueSections();
    };

    if (this.isAnimating) {
      console.log('animate');
      return this.requestId = rAF(this._animate.bind(this));
    };
  }

  _updateSectionPosition(delta) {
    const speed = this.currentSection.getAttribute('data-speed') || this.options.speed;
    const target = this.isToBack ? 0 : 100;
    this.isToBack
      ? this.currentSectionPosition--
      : this.currentSectionPosition++;
    return this;
  }

  _renderSectionPosition(section, x, y) {
    section.style[transformProp] = `translate(${x}%, -${y}%)`;
  }

  prev() {
    if (!this.isAnimating) {
      [this.currentSection, ...this.restSections] = this.sections.reverse();
      this.sections = [this.currentSection, ...this.restSections.reverse()];

      this._renderSectionPosition(this.currentSection, 0, 100);
      this._queueSections();
      this.currentSectionPosition = 100;

      this.isToBack = true;
      this.isAnimating = true;
      this.lastTime = Date.now();

      this._animate();

    }
  }

  next() {
    if (!this.isAnimating) {
      this.sections = [...this.restSections, this.currentSection];

      this.isToBack = false;
      this.isAnimating = true;
      this.lastTime = Date.now();

      this._animate();
    }
  }

}

module.exports = Wall;
