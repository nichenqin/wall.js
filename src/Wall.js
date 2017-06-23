import { toArray, throwNewError, merge, addClass, removeClass } from './utils';
import { easeInOutExpo } from './easing';
import { rAF, cAF, hasTransform3d, transformProp, getScreenHeight, getScreenWidth } from './dom';

const defaultOptions = {
  wrapperZIndex: 1,
  animateDirection: 'top',
  easeFunction: easeInOutExpo,
  animateDuration: 1,
  navElement: '.wall-nav',
  navItemActiveClass: 'active'
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
    // the position of current section, used to move currentSection
    this.currentSectionPosition = 0;
    // mark if use transform 3d for smooth animation
    this.translateZ = hasTransform3d ? 'translateZ(0)' : '';
    // init screen size, X presents width, Y presents height
    this.size = { X: 0, Y: 0 };

    // merge default options and custom options
    this.options = merge(defaultOptions, options);
    this.navElement = typeof this.options.navElement === 'string' ? document.querySelector(this.options.navElement) : this.options.navElement;
    this.navItems = this.navElement && toArray(this.navElement.children);
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

  _init() {
    this._refresh(true);

    window.addEventListener('resize', () => { this._setupSize()._cssWrapper(); });
  }

  _refresh(force) {
    if (force)
      this
        ._setupSize()._css()
        ._setupSections()._setupNav()
        ._queueSections();

    this.isToBack = false;
    this.isAnimating = false;
    this.currentSectionPosition = 0;
    cAF(this.requestId);

    [this.currentSection, ...this.restSections] = this.sections;

    this._renderNav();

    return this;
  }

  _setupSize() {
    this.size.X = getScreenWidth();
    this.size.Y = getScreenHeight();
    return this;
  }

  _setupSections() {
    this.sections.forEach((section, index) => {
      section.setAttribute('data-wall-section-index', index + 1);
    });
    return this;
  }

  _setupNav() {
    if (this.navElement) {
      this.navElement.style.zIndex = this.options.wrapperZIndex + 1;
      this.navElement.style.position = 'absolute';

      this.navItems.forEach((item, index) => {
        item.setAttribute('data-wall-nav-index', index + 1);
        item.addEventListener('click', () => {
          this.goTo(item.getAttribute('data-wall-nav-index'));
        });
      });
    }

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
    this.wrapper.style.zIndex = this.options.wrapperZIndex;
    this.wrapper.style.height = this.size.Y + 'px';
    this.wrapper.style.width = '100%';
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
    this.sections.reverse().forEach((section, index) => { section.style.zIndex = index + 1; });
    this.sections.reverse();

    [this.currentSection, ...this.restSections] = this.sections;
    this.sections.forEach(section => this._renderSectionPosition(section, 0));

    return this;
  }

  _animate() {
    const now = Date.now();
    const delta = (now - this.lastTime) / 1000;

    console.log('animating');

    this
      ._updateSectionPosition(delta)
      ._renderSectionPosition(this.currentSection, this.currentSectionPosition);

    if (this.currentSectionPosition >= 100 || (this.currentSectionPosition < 0.1 && this.isToBack)) {
      return this._refresh()._queueSections();
    };

    if (this.isAnimating) {
      return this.requestId = rAF(this._animate.bind(this));
    };
  }

  _updateSectionPosition(delta) {
    const duration = this.currentSection.getAttribute('data-wall-animate-duration') || this.options.animateDuration;
    const target = this.isToBack ? 0 : 100;

    this.currentSectionPosition = this.options.easeFunction(delta, this.currentSectionPosition, target - this.currentSectionPosition, duration);

    return this;
  }

  _renderSectionPosition(section, pos) {
    switch (this.currentSection.getAttribute('data-wall-animate-direction') || this.options.animateDirection) {
      case 'top':
        section.style[transformProp] = `translate(0, -${pos}%) ${this.translateZ}`;
        break;
      case 'bottom':
        section.style[transformProp] = `translate(0, ${pos}%) ${this.translateZ}`;
        break;
      case 'left':
        section.style[transformProp] = `translate(-${pos}%, 0) ${this.translateZ}`;
        break;
      case 'right':
        section.style[transformProp] = `translate(${pos}%, 0) ${this.translateZ}`;
        break;

      default:
        section.style[transformProp] = `translate(0, -${pos}%) ${this.translateZ}`;
        break;
    }

  }

  _renderNav() {
    if (this.navElement) {
      this.navItems.forEach(item => { removeClass(item, this.options.navItemActiveClass); });
      const currentNav = this.navItems.find(item => item.getAttribute('data-wall-nav-index') === this.currentSection.getAttribute('data-wall-section-index'));
      console.log(this.currentSection);
      console.log(currentNav);
      addClass(currentNav, this.options.navItemActiveClass);
    }
  }

  prev() {
    if (!this.isAnimating) {
      [this.currentSection, ...this.restSections] = this.sections.reverse();
      this.sections = [this.currentSection, ...this.restSections.reverse()];

      this
        ._queueSections()
        ._renderSectionPosition(this.currentSection, 100);

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

  goTo(num) {
    console.log(num);
  }

}

module.exports = Wall;
