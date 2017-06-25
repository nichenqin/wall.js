import { toArray, throwNewError, merge, addClass, removeClass } from './utils';
import { easeInOutExpo } from './easing';
import { rAF, cAF, hasTransform3d, transformProp, mousewheelEvent, getScreenHeight, getScreenWidth } from './dom';

const defaultOptions = {
  wrapperZIndex: 1,
  sectionAnimateDuration: 1,
  easeFunction: easeInOutExpo,
  loopToBottom: false,
  loopToTop: false,
  navElement: '.wall-nav',
  navItemActiveClass: 'active',
};

const body = document.getElementsByTagName('body')[0];

class Wall {

  constructor(wrapper = throwNewError`wrapper`, options = defaultOptions) {
    // get wrapper which contains sections
    this.wrapper = typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper;
    // get child sections, if no section contains, throw a new error
    this.sections = this.wrapper.children.length ? toArray(this.wrapper.children) : throwNewError`sections`;
    this.currentSection = null;
    this.restSections = null;

    this.currentSlides = undefined;
    this.currentSlide = undefined;
    this.restSlides = undefined;

    // the position of current section, used to move currentSection
    this.currentScreenPosition = 0;

    // mark if use transform 3d for smooth animation
    this.translateZ = hasTransform3d ? 'translateZ(0)' : '';
    // init screen size, X presents width, Y presents height
    this.size = { X: 0, Y: 0 };

    // merge default options and custom options
    this.options = merge(defaultOptions, options);
    // set up nav element
    this.navElement = typeof this.options.navElement === 'string' ? document.querySelector(this.options.navElement) : this.options.navElement;
    // if nav element exists, set nav items
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
    document.addEventListener('keydown', this._handleKeyDown.bind(this));
  }

  _refresh(force) {
    if (force)
      this
        ._setupSize()._cssBody()._cssWrapper()
        ._setupSections()._cssSections()._queue(this.sections)
        ._setupSlides()
        ._setupNav();

    cAF(this.requestId);
    this.isAnimating = false;

    [this.currentSection, ...this.restSections] = this.sections;
    [this.currentSlide, ...this.restSlides] = this.currentSlides;

    this._renderNavElement();

    return this;
  }

  _setupSize() {
    this.size.X = getScreenWidth();
    this.size.Y = getScreenHeight();
    return this;
  }

  _setupSections() {
    [this.currentSection, ...this.restSections] = this.sections;

    this.sections.forEach((section, index) => {
      section.setAttribute('data-wall-section-index', index + 1);
      section.addEventListener(mousewheelEvent, this._handleWheelEvent.bind(this));
    });
    return this;
  }

  _handleKeyDown(e) {
    const { scrollTop, scrollHeight, clientHeight } = this.currentSection;
    switch (e.keyCode) {
      case 34: case 40:
        if (scrollHeight - scrollTop <= clientHeight) this.nextSection();
        break;

      case 33: case 38:
        if (scrollTop === 0) this.prevSection();
        break;

      case 36:
        this.goToSection(1);

      case 35:
        this.goToSection(this.sections.length);

      default:
        break;
    }
  }

  _handleWheelEvent(e) {
    const { scrollTop, scrollHeight, clientHeight } = this.currentSection;
    const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if (scrollHeight - scrollTop <= clientHeight && delta === -1) this.nextSection();
    if (scrollTop === 0 && delta === 1) this.prevSection();

    return this;
  }

  _setupNav() {
    if (this.navElement) {
      this.navElement.style.zIndex = this.options.wrapperZIndex + 1;

      this.navItems.forEach((item, index) => {
        item.setAttribute('data-wall-nav-index', index + 1);
        item.addEventListener('click', () => {
          this.goToSection(item.getAttribute('data-wall-nav-index'));
        });
      });
    }

    return this;
  }

  _setupSlides() {
    this.currentSlides = toArray(this.currentSection.querySelectorAll('[data-wall-slide'));

    this.sections.forEach(section => {
      const slides = toArray(section.querySelectorAll('[data-wall-slide]'));
      const arrows = toArray(section.querySelectorAll('[data-wall-slide-arrow]'));
      if (slides.length) {
        slides.forEach((slide, index) => {
          slide.style.position = 'absolute';
          slide.style.top = 0;
          slide.style.overflowX = 'hidden';
          slide.style.overflowY = 'auto';
          slide.style.right = 0;
          slide.style.bottom = 0;
          slide.style.left = 0;

          slide.setAttribute('data-wall-slide-index', index + 1);
        });

        slides.reverse().forEach((slide, index) => slide.style.zIndex = index + 1);

        if (arrows.length) {
          arrows.forEach(arrow => arrow.style.zIndex = slides.length + 1);
        }
      }
    });
    return this;
  }

  _cssBody() {
    body.style.margin = 0;
    body.style.overflow = 'hidden';
    return this;
  }

  _cssWrapper() {
    this.wrapper.style.position = 'relative';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.width = '100%';
    this.wrapper.style.height = this.size.Y + 'px';
    this.wrapper.style.zIndex = this.options.wrapperZIndex;
    return this;
  }

  _cssSections() {
    this.sections.forEach(section => {
      section.style.position = 'absolute';
      section.style.top = 0;
      section.style.right = 0;
      section.style.bottom = 0;
      section.style.left = 0;
      section.style.overflowX = 'hidden';
      section.style.overflowY = 'auto';
    });
    return this;
  }

  _queue(screenList) {
    screenList.reverse().forEach((section, index) => { section.style.zIndex = index + 1; });
    screenList.reverse();

    screenList.forEach(section => this._renderSectionPosition(section, 0));

    return this;
  }

  _refreshAnimateStatus(isToBack) {
    this.isToBack = isToBack;
    cAF(this.requestId);
    this.currentScreenPosition = this.isToBack ? 100 : 0;
    this.isAnimating = true;
    this.lastTime = Date.now();
    return this;
  }

  _animateScreen(currentScreen, screenList) {
    const now = Date.now();
    const delta = (now - this.lastTime) / 1000;

    currentScreen.style.zIndex = screenList.length + 1;

    this
      ._updateCurrentScreenPosition(delta)
      ._renderSectionPosition(currentScreen, this.currentScreenPosition);

    if (this.currentScreenPosition >= 100 || (this.currentScreenPosition < 0.1 && this.isToBack)) {
      return this._refresh()._queue(screenList);
    };

    if (this.isAnimating) {
      return this.requestId = rAF(this._animateScreen.bind(this, currentScreen, screenList));
    };
  }

  _updateCurrentScreenPosition(delta) {
    const duration = this.currentSection.getAttribute('data-wall-animate-duration') || this.options.sectionAnimateDuration;
    const target = this.isToBack ? 0 : 100;

    this.currentScreenPosition = this.options.easeFunction(delta, this.currentScreenPosition, target - this.currentScreenPosition, duration);

    return this;
  }

  _renderSectionPosition(screen, pos) {
    screen.style[transformProp] = `translate(0, -${pos}%) ${this.translateZ}`;
  }

  getCurrentSectionIndex() {
    return this.currentSection.getAttribute('data-wall-section-index');
  }

  _renderNavElement() {
    if (this.navElement) {
      const { navItemActiveClass } = this.options;
      this.navItems.forEach(item => { removeClass(item, navItemActiveClass); });

      const currentNav = this.navItems.find(item => item.getAttribute('data-wall-nav-index') === this.getCurrentSectionIndex());
      addClass(currentNav, navItemActiveClass);
    }
  }

  prevSection() {
    if (!this.options.loopToBottom && this.getCurrentSectionIndex() == 1) return;

    if (!this.isAnimating) {
      // reverse the sections array and set the last section to be the current section
      [this.currentSection, ...this.restSections] = this.sections.reverse();
      this.sections = [this.currentSection, ...this.restSections.reverse()];

      this
        ._refreshAnimateStatus(true)
        ._animateScreen(this.currentSection, this.sections);
    }
  }

  nextSection() {
    if (!this.options.loopToTop && this.getCurrentSectionIndex() == this.sections.length) return;

    if (!this.isAnimating) {
      // move current section to last of the queue
      this.sections = [...this.restSections, this.currentSection];

      this
        ._refreshAnimateStatus(false)
        ._animateScreen(this.currentSection, this.sections);
    }
  }

  goToSection(index) {

    if (index === this.getCurrentSectionIndex()) return;

    if (!this.isAnimating) {
      this.sections = toArray(this.wrapper.children);
      const targetSection = this.sections.find(section => section.getAttribute('data-wall-section-index') == index);

      const prevSections = this.sections.slice(0, index - 1);
      const nextSections = this.sections.slice(index);

      this.sections = [targetSection, ...nextSections, ...prevSections];

      this._refreshAnimateStatus(index < this.getCurrentSectionIndex());

      if (this.isToBack) {
        this.currentSection = targetSection;
      } else {
        this._queue(this.sections);
      }

      this._animateScreen(this.currentSection, this.sections);
    }
  }

  prevSlide() {
    if (!this.isAnimating) {
      [this.currentSlide, ...this.restSlides] = this.currentSlides.reverse();
      this.currentSlides = [this.currentSlide, ...this.restSlides.reverse()];

      this
        ._refreshAnimateStatus(true)
        ._animateScreen(this.currentSlide, this.currentSlides);
    }
  }

  nextSlide() {
    if (!this.isAnimating) {
      this.currentSlides = [...this.restSlides, this.currentSlide];

      this
        ._refreshAnimateStatus(false)
        ._animateScreen(this.currentSlide, this.currentSlides);
    }
  }

}

module.exports = Wall;
