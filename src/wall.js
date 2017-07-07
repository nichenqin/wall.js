import { toArray, throwNewError, merge, addClass, removeClass } from './utils';
import { rAF, cAF, hasTransform3d, transformProp, mousewheelEvent, getScreenHeight, getScreenWidth, maxScreen, scrollTouchBottom, scrollTouchTop } from './dom';
import { handleTouch } from './events';
import * as easing from './easing';
import './polyfill';

const SCREEN_SECTION = 'section';
const SCREEN_SLIDE = 'slide';
const DATA_PRE = 'data-wall';

const ANIMATE_DURATION = `${DATA_PRE}-animate-duration`;

const CURRENT_INDEX = `${DATA_PRE}-current-section`;

const SECTION_NAV = `${DATA_PRE}-section-nav`;
const SECTION_INDEX = `${DATA_PRE}-section-index`;

const SECTION_NAV_INDEX = `${DATA_PRE}-section-nav-index`;

const SLIDE = `${DATA_PRE}-slide`;
const SLIDE_INDEX = `${DATA_PRE}-slide-index`;
const SLIDE_ARROW = `${DATA_PRE}-slide-arrow`;

const IMAGE_ORIGIN = `${DATA_PRE}-origin`;

const defaultOptions = {
  wrapperZIndex: 1,
  sectionAnimateDuration: 1,
  easeFunction: 'easeIn',
  loopToBottom: false,
  loopToTop: false,
  sectionNavItemActiveClass: 'active',
  animatingClass: 'animating',
  currentClass: 'current',
};

const html = document.getElementsByTagName('html')[0];
const body = document.getElementsByTagName('body')[0];

class Wall {

  constructor(wrapper = throwNewError`wrapper`, options = defaultOptions) {
    // get wrapper which contains sections
    this.wrapper = typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper;
    // get child sections, if no section contains, throw a new error
    this.sections = this.wrapper.children.length ? toArray(this.wrapper.children) : throwNewError`sections`;
    this.currentSection = null;
    this.restSections = null;

    this.currentSlides = null;
    this.currentSlide = null;
    this.restSlides = null;

    // the position of current section, used to move currentSection
    this.currentScreenPosition = 0;

    // mark if use transform 3d for smooth animation
    this.translateZ = hasTransform3d ? 'translateZ(0)' : '';
    // init screen size, X presents width, Y presents height
    this.size = { X: 0, Y: 0 };

    // merge default options and custom options
    this.options = merge(defaultOptions, options);
    // set up nav element
    this.navElements = toArray(document.querySelectorAll(`[${SECTION_NAV}]`));

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

  _init() {
    this._refresh(true);

    window.addEventListener('resize', () => { this._setupSize()._cssWrapper(); });
    document.addEventListener('keydown', this._handleKeyDown.bind(this));
  }

  _refresh(force) {
    if (force)
      this
        ._setupSize()._cssHtmlAndBody()._cssWrapper()
        ._setupSections()._cssSections()._queue(this.sections)
        ._setupSlides()
        ._setupSectionNav();

    cAF(this.requestId);
    this.isAnimating = false;

    removeClass(this.currentSection, this.options.animatingClass);
    this.sections.forEach(section => removeClass(section, this.options.currentClass));

    [this.currentSection, ...this.restSections] = this.sections;
    addClass(this.currentSection, this.options.currentClass);

    if (this.currentSlides.length && this.currentSlide) {
      removeClass(this.currentSlide, this.options.animatingClass);
      this.currentSlides.forEach(slide => removeClass(slide, this.options.currentClass));
    }

    [this.currentSlide, ...this.restSlides] = this.currentSlides;
    if (this.currentSlides.length && this.currentSlide) {
      addClass(this.currentSlide, this.options.currentClass);
    }

    this._renderSectionNavs();
    this._lazyload(this.currentSection);
    this.wrapper.setAttribute(CURRENT_INDEX, this._getCurrentSectionIndex());

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
      section.setAttribute(SECTION_INDEX, index + 1);
      section.addEventListener(mousewheelEvent, this._handleWheelEvent.bind(this));
      handleTouch(section, this);
    });
    return this;
  }

  _handleKeyDown(e) {
    switch (e.keyCode) {
      case 34: case 40: if (scrollTouchBottom(this.currentSection)) this.nextSection(); break;
      case 33: case 38: if (scrollTouchTop(this.currentSection)) this.prevSection(); break;
      case 37: if (this.currentSlide) this.prevSlide(); break;
      case 39: if (this.currentSlide) this.nextSlide(); break;
      case 36: this.goToSection(1); break;
      case 35: this.goToSection(this.sections.length); break;
    }
  }

  _handleWheelEvent(e) {
    const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

    if (scrollTouchBottom(this.currentSection) && delta === -1) this.nextSection();
    if (scrollTouchTop(this.currentSection) && delta === 1) this.prevSection();

    return this;
  }

  _setupSectionNav() {
    if (this.navElements && this.navElements.length) {
      this.navElements.forEach(navElement => {
        navElement.style.zIndex = this.options.wrapperZIndex + 1;

        const navItems = toArray(navElement.children);
        navItems.forEach((item, index) => {
          item.setAttribute(SECTION_NAV_INDEX, index + 1);
          item.addEventListener('click', () => {
            this.goToSection(item.getAttribute(SECTION_NAV_INDEX));
          });
        });
      });
    }

    return this;
  }

  _setupSlides() {
    this.currentSlides = toArray(this.currentSection.querySelectorAll(`[${SLIDE}]`));

    this.sections.forEach(section => {
      const slides = toArray(section.querySelectorAll(`[${SLIDE}]`));
      const arrows = toArray(section.querySelectorAll(`[${SLIDE_ARROW}]`));
      if (slides.length) {
        slides.forEach((slide, index) => {
          maxScreen(slide);
          slide.style.overflowX = 'hidden';
          slide.style.overflowY = 'auto';

          slide.setAttribute(SLIDE_INDEX, index + 1);
        });
        slides.reverse().forEach((slide, index) => slide.style.zIndex = index + 1);

        if (arrows.length) {
          arrows.forEach(arrow => arrow.style.zIndex = slides.length + 1);
        }
      }
    });
    return this;
  }

  _cssHtmlAndBody() {
    html.style.height = '100%';
    html.style.overflow = 'hidden';
    body.style.height = '100%';
    body.style.position = 'relative';
    body.style.margin = 0;
    body.style.overflow = 'hidden';
    return this;
  }

  _cssWrapper() {
    this.wrapper.style.position = 'relative';
    this.wrapper.style.height = '100%';
    this.wrapper.style.zIndex = this.options.wrapperZIndex;
    return this;
  }

  _cssSections() {
    this.sections.forEach(section => {
      maxScreen(section);
      section.style.height = this.size.Y + 'px';
      section.style.overflowX = 'hidden';
      section.style.overflowY = 'auto';
    });
    return this;
  }

  _lazyload(currentScreen) {
    const images = toArray(currentScreen.querySelectorAll(`[${IMAGE_ORIGIN}]`));
    images.forEach(image => image.setAttribute('src', image.getAttribute(IMAGE_ORIGIN)));
  }

  _queue(screenList) {
    screenList.reverse().forEach((section, index) => { section.style.zIndex = index + 1; });
    screenList.reverse();

    screenList.forEach(section => this._renderSectionPosition(section, 0));

    return this;
  }

  _resetCurrentSlides() {
    [this.currentSection, ...this.restSections] = this.sections;

    this.currentSlides = toArray(this.currentSection.querySelectorAll(`[${SLIDE}]`))
      .sort((a, b) => +b.style.zIndex - +a.style.zIndex);

    if (this.currentSlide) removeClass(this.currentSlide, this.options.currentClass);
    [this.currentSlide, ...this.restSlides] = this.currentSlides;
    if (this.currentSlide) addClass(this.currentSlide, this.options.currentClass);

    return this;
  }

  _refreshAnimateStatus(isToBack) {
    this.isToBack = isToBack;
    cAF(this.requestId);
    this.currentScreenPosition = this.isToBack ? 100 : 0;
    this.isAnimating = true;
    this.lastTime = Date.now();

    if (this.screenType === SCREEN_SECTION) {
      addClass(this.currentSection, this.options.animatingClass);
    } else if (this.currentSlide && this.screenType === SCREEN_SLIDE) {
      addClass(this.currentSlide, this.options.animatingClass);
    }
    return this;
  }

  _animateScreen(currentScreen, screenList) {
    const now = Date.now();
    const delta = (now - this.lastTime) / 1000;

    currentScreen.style.zIndex = screenList.length + 1;

    this._updateCurrentScreenPosition(delta)._renderSectionPosition(currentScreen, this.currentScreenPosition);

    const shouldStop = (this.currentScreenPosition > 99.9 && !this.isToBack) || (this.currentScreenPosition < 0.1 && this.isToBack);

    if (shouldStop) {
      this._refresh()._queue(screenList);
      if (this.screenType === SCREEN_SECTION) this._resetCurrentSlides();
      return this;
    };

    if (this.isAnimating) {
      return this.requestId = rAF(this._animateScreen.bind(this, currentScreen, screenList));
    };
  }

  _updateCurrentScreenPosition(delta) {
    const currentDuration = this.screenType === SCREEN_SECTION ? +this.currentSection.getAttribute(ANIMATE_DURATION) : +this.currentSlide.getAttribute(ANIMATE_DURATION);
    const duration = currentDuration || this.options.sectionAnimateDuration;
    const target = this.isToBack ? 0 : 100;

    this.currentScreenPosition = this.easeFunction(delta, this.currentScreenPosition, target - this.currentScreenPosition, duration);
    return this;
  }

  _renderSectionPosition(screen, pos) {
    switch (this.screenType) {
      case SCREEN_SECTION:
        screen.style[transformProp] = `translate(0, -${pos}%) ${this.translateZ}`;
        break;
      case SCREEN_SLIDE:
        screen.style[transformProp] = `translate(-${pos}%, 0) ${this.translateZ}`;
        break;
    }
  }

  _getCurrentSectionIndex() {
    return this.currentSection.getAttribute(SECTION_INDEX);
  }

  _renderSectionNavs() {
    if (this.navElements && this.navElements.length) {
      const { sectionNavItemActiveClass } = this.options;

      this.navElements.forEach(navElement => {
        const navItems = toArray(navElement.children);
        navItems.forEach(item => removeClass(item, sectionNavItemActiveClass));

        const currentNav = navItems.find(item => item.getAttribute(SECTION_NAV_INDEX) === this._getCurrentSectionIndex());
        addClass(currentNav, sectionNavItemActiveClass);
      });

    }
  }

  prevSection() {
    if (!this.options.loopToBottom && this._getCurrentSectionIndex() == 1) return;

    if (!this.isAnimating) {
      // reverse the sections array and set the last section to be the current section
      [this.currentSection, ...this.restSections] = this.sections.reverse();
      this.sections = [this.currentSection, ...this.restSections.reverse()];
      this.screenType = SCREEN_SECTION;

      this._refreshAnimateStatus(true)._animateScreen(this.currentSection, this.sections);
    }
  }

  nextSection() {
    if (!this.options.loopToTop && this._getCurrentSectionIndex() == this.sections.length) return;

    if (!this.isAnimating) {
      // move current section to last of the queue
      this.sections = [...this.restSections, this.currentSection];
      this.screenType = SCREEN_SECTION;

      this._refreshAnimateStatus(false)._animateScreen(this.currentSection, this.sections);
    }
  }

  goToSection(index) {
    if (index === this._getCurrentSectionIndex()) return;

    if (!this.isAnimating) {
      this.isToBack = index < this._getCurrentSectionIndex();

      this.sections = toArray(this.wrapper.children);
      const targetSection = this.sections.find(section => section.getAttribute(SECTION_INDEX) == index);
      const prevSections = this.sections.slice(0, index - 1);
      const nextSections = this.sections.slice(index);
      this.sections = [targetSection, ...nextSections, ...prevSections];

      if (this.isToBack) {
        this.currentSection = targetSection;
      } else {
        this._queue(this.sections);
      }

      this.screenType = SCREEN_SECTION;
      this._refreshAnimateStatus(this.isToBack)._animateScreen(this.currentSection, this.sections);
    }
  }

  prevSlide() {
    if (!this.isAnimating) {
      [this.currentSlide, ...this.restSlides] = this.currentSlides.reverse();
      this.currentSlides = [this.currentSlide, ...this.restSlides.reverse()];
      this.screenType = SCREEN_SLIDE;

      this._refreshAnimateStatus(true)._animateScreen(this.currentSlide, this.currentSlides);
    }
  }

  nextSlide() {
    if (!this.isAnimating) {
      this.currentSlides = [...this.restSlides, this.currentSlide];
      this.screenType = SCREEN_SLIDE;

      this._refreshAnimateStatus(false)._animateScreen(this.currentSlide, this.currentSlides);
    }
  }

}

module.exports = Wall;
