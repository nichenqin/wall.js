import { rAF, cAF, toArray, throwNewError, merge, getScreenHeight, getScreenWidth, transformProp } from './utils';

const defaultOptions = {
  animationDirection: 'top'
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
    this.requestId = null;
    this.isAnimating = false;

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
    this.wrapper.style.width = this.size.X + 'px';
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
    return this;
  }

  _animate() {

    this._updateSectionPosition()._renderSectionPosition();

    if (this.currentSectionPosition === 100) this._refresh()._queueSections();

    if (this.isAnimating) return this.requestId = rAF(this._animate.bind(this));
  }

  _updateSectionPosition() {
    this.currentSectionPosition++;
    return this;
  }

  _renderSectionPosition() {
    this.currentSection.style[transformProp] = `translate(0, -${this.currentSectionPosition}%)`;
  }

  prev() {
    [this.currentSection, ...this.restSections] = this.sections.reverse();
    this.sections = [this.currentSection, ...this.restSections.reverse()];
    this._queueSections();
  }

  next() {
    this.sections = [...this.restSections, this.currentSection];
    this.isAnimating = true;
    this._animate();
  }

}

module.exports = Wall;
