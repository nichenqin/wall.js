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
    this.sections = this.wrapper.children.length ? utils.toArray(this.wrapper.children).reverse() : utils.throwNewError`sections`;
    // init section as an empty object, all configs about section will set inside the object
    this.section = {};
    // init screen size, X presents width, Y presents height
    this.size = { X: 0, Y: 0 };

    this._init();
  }

  _init() {
    this._refresh();

    window.addEventListener('resize', () => { this._setupSize()._cssWrapper(); });
  }

  _refresh() {
    this._setupSize()._css();
  }

  _setupSize() {
    this.size.X = utils.getScreenWidth();
    this.size.Y = utils.getScreenHeight();
    return this;
  }

  _css() {
    this._cssBody()._cssWrapper()._cssSections();
    return this;
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
    this.sections.forEach((section, index) => {
      section.style.position = 'absolute';
      section.style.top = 0;
      section.style.right = 0;
      section.style.bottom = 0;
      section.style.left = 0;
      section.style.zIndex = index + 1;
    });
    return this;
  }

}

module.exports = Wall;
