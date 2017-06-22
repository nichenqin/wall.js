import * as utils from './utils';

const defaultOptions = {
  wrapperClassName: 'wall-wrapper'
};

const body = document.getElementsByTagName('body')[0];

class Wall {

  constructor(wrapper = utils.throwNewError`wrapper`, options = defaultOptions) {
    // get wrapper which contains sections
    this.wrapper = typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper;
    // get child sections, if no section contains, throw a new error
    this.sections = this.wrapper.children.length ? utils.toArray(this.wrapper.children) : utils.throwNewError`sections`;
    // get first of array as current section, and others as rest sections
    [this.currentSection, ...this.restSections] = this.sections;
    // init section as an empty object, all configs about section will set inside the object
    this.sectionConfig = {};
    // init screen size, X presents width, Y presents height
    this.size = { X: 0, Y: 0 };
    // merge default options and custom options
    this.options = utils.merge(defaultOptions, options);
    // animation time stamp
    this.lastTime = null;

    this._init();
  }

  _init() {
    this._refresh();

    window.addEventListener('resize', () => { this._setupSize()._cssWrapper(); });
  }

  _refresh() {
    this
      ._setupSize()._setupSections()
      ._css()
      ._queueSections();
  }

  _setupSize() {
    this.size.X = utils.getScreenWidth();
    this.size.Y = utils.getScreenHeight();
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
    this.wrapper.classList.add(this.options.wrapperClassName);
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
    [this.currentSection] = this.sections;
    return this;
  }

  _animate() {

  }

  next() {
    this.sections = [...this.restSections, this.currentSection];
    this._queueSections();
  }

}

module.exports = Wall;
