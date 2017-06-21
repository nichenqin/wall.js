import * as utils from './utils';

const defaultOptions = {};

class Wall {
  constructor(wrapper = utils.throwNewError`wrapper`, options = defaultOptions) {
    // get wrapper which contains sections
    this.wrapper = typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper;
    // get child sections, if no section contains, throw a new error
    this.sections = this.wrapper.children.length ? utils.toArray(this.wrapper.children) : utils.throwNewError`sections`;
    // init section as an empty object, all configs about section will set inside the object
    this.section = {};

    this._init();
  }

  _init() {
    this._getScreeSize()._cssWrapper()._cssSections();

    window.addEventListener('resize', () => { this._getScreeSize(); });
  }

  _getScreeSize() {
    this.X = document.documentElement.clientWidth || window.innerWidth;
    this.Y = document.documentElement.clientHeight || window.innerHeight;
    return this;
  }

  _cssWrapper() {
    this.wrapper.style.height = this.Y + 'px';
    return this;
  }

  _cssSections() {
    this.sections.forEach(section => {
      section.style.height = '100%';
    });
  }
}

module.exports = Wall;