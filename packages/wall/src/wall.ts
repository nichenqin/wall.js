import { animateTransform } from './animate';
import { Emitter } from './events';
import {
  DATA,
  type Direction,
  type ResolvedWallOptions,
  type WallEventHandler,
  type WallEventName,
  type WallOptions,
} from './types';
import {
  addClass,
  atScrollBottom,
  atScrollTop,
  parseDurationAttr,
  removeClass,
  resolveOptions,
  setTransform,
  toArray,
} from './utils';

type SavedStyle = {
  el: HTMLElement;
  cssText: string;
};

export class Wall {
  readonly wrapper: HTMLElement;
  readonly options: ResolvedWallOptions;

  private sections: HTMLElement[] = [];
  private index = 0;
  private slideIndexes = new Map<number, number>();
  private animating = false;
  private destroyed = false;
  private ac = new AbortController();
  private animAc: AbortController | null = null;
  private emitter = new Emitter();
  private savedStyles: SavedStyle[] = [];
  private documentLocked = false;
  private wheelLockUntil = 0;
  private pointerStart: { x: number; y: number } | null = null;
  /** True while multi-hop chain is playing intermediate pages. */
  private chaining = false;
  /** Accumulates a quick wheel flick into one multi-section hop. */
  private wheelGesture: {
    dir: 1 | -1 | 0;
    sum: number;
    timer: ReturnType<typeof setTimeout> | null;
  } = { dir: 0, sum: 0, timer: null };

  constructor(wrapper: string | HTMLElement, options: WallOptions = {}) {
    const el =
      typeof wrapper === 'string' ? document.querySelector<HTMLElement>(wrapper) : wrapper;

    if (!el) {
      throw new Error(`[wall.js] wrapper not found: ${String(wrapper)}`);
    }

    this.wrapper = el;
    this.options = resolveOptions(options);
    this.sections = toArray(el.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );

    if (!this.sections.length) {
      throw new Error('[wall.js] wrapper has no section children');
    }

    this.init();
  }

  /** 0-based section index. */
  get currentIndex(): number {
    return this.index;
  }

  /** 1-based section index (v1 compatible). */
  get sectionIndex(): number {
    return this.index + 1;
  }

  /** 0-based slide index inside the current section. */
  get currentSlideIndex(): number {
    return this.slideIndexes.get(this.index) ?? 0;
  }

  get isAnimating(): boolean {
    return this.animating || this.chaining;
  }

  get sectionCount(): number {
    return this.sections.length;
  }

  on<E extends WallEventName>(event: E, handler: WallEventHandler<E>): () => void {
    return this.emitter.on(event, handler);
  }

  off<E extends WallEventName>(event: E, handler: WallEventHandler<E>): void {
    this.emitter.off(event, handler);
  }

  /** Go to next section (v1 alias). */
  nextSection(): Promise<void> {
    return this.next();
  }

  /** Go to previous section (v1 alias). */
  prevSection(): Promise<void> {
    return this.prev();
  }

  next(): Promise<void> {
    return this.goTo(this.index + 1);
  }

  prev(): Promise<void> {
    return this.goTo(this.index - 1);
  }

  /**
   * Go to a section by **0-based** index.
   * Out-of-range targets clamp to ends (or loop when enabled).
   *
   * Spans of more than one page **chain through intermediates**
   * (1 → 2 → 3), so page 2 always appears — intermediate hops are faster.
   */
  async goTo(target: number): Promise<void> {
    if (this.destroyed || this.animating || this.chaining) return;

    const last = this.sections.length - 1;
    if (last < 0) return;

    let to = target;

    if (to > last) {
      to = this.options.loopToTop ? to % (last + 1) : last;
    } else if (to < 0) {
      if (this.options.loopToBottom) {
        const len = last + 1;
        to = ((to % len) + len) % len;
      } else {
        to = 0;
      }
    }

    if (to === this.index) return;

    const from = this.index;
    const distance = Math.abs(to - from);

    if (distance === 1) {
      const direction: Direction = to > from ? 'down' : 'up';
      await this.transitionSection(from, to, direction);
      return;
    }

    await this.transitionChain(from, to);
  }

  /**
   * Move by a signed section count (e.g. `+3` / `-2`).
   * Multi-step hops still pass through every intermediate page.
   */
  stepBy(delta: number): Promise<void> {
    if (!delta || this.destroyed || this.animating || this.chaining) {
      return Promise.resolve();
    }
    return this.goTo(this.index + delta);
  }

  /**
   * Go to a section by **1-based** index (v1 compatible).
   */
  goToSection(oneBasedIndex: number | string): Promise<void> {
    const n = Number(oneBasedIndex);
    if (!Number.isFinite(n)) return Promise.resolve();
    return this.goTo(n - 1);
  }

  nextSlide(): Promise<void> {
    const slides = this.getSlides(this.index);
    if (!slides.length) return Promise.resolve();
    const cur = this.slideIndexes.get(this.index) ?? 0;
    return this.goToSlide(cur + 1);
  }

  prevSlide(): Promise<void> {
    const slides = this.getSlides(this.index);
    if (!slides.length) return Promise.resolve();
    const cur = this.slideIndexes.get(this.index) ?? 0;
    return this.goToSlide(cur - 1);
  }

  async goToSlide(target: number): Promise<void> {
    if (this.destroyed || this.animating) return;

    const slides = this.getSlides(this.index);
    if (!slides.length) return;

    let to = target;
    const last = slides.length - 1;
    if (to < 0 || to > last) return;
    const from = this.slideIndexes.get(this.index) ?? 0;
    if (to === from) return;

    const direction: Direction = to > from ? 'right' : 'left';
    await this.transitionSlide(from, to, direction);
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    this.clearWheelGesture();
    this.animAc?.abort();
    this.ac.abort();
    this.emitter.emit('destroy', undefined);
    this.emitter.clear();

    for (const section of this.sections) {
      removeClass(section, this.options.currentClass);
      removeClass(section, this.options.animatingClass);
      section.removeAttribute(DATA.sectionIndex);
      for (const slide of this.getSlidesFromSection(section)) {
        removeClass(slide, this.options.currentClass);
        removeClass(slide, this.options.animatingClass);
        slide.removeAttribute(DATA.slideIndex);
        slide.style.cssText = '';
      }
      section.style.cssText = '';
    }

    this.restoreStyles();
    this.unlockDocument();
    this.wrapper.removeAttribute(DATA.currentSection);
    this.wrapper.classList.remove('wall-js');
  }

  // ─── setup ───────────────────────────────────────────────

  private init(): void {
    this.wrapper.classList.add('wall-js');
    this.saveAndApplyLayout();
    this.setupSections();
    this.setupSlides();
    this.setupNav();
    this.bindInputs();
    this.applySectionPositions(this.index, false);
    this.markCurrent();
    this.lazyload(this.sections[this.index]!);
    this.updateNav();
    this.wrapper.setAttribute(DATA.currentSection, String(this.sectionIndex));
  }

  private saveStyle(el: HTMLElement): void {
    this.savedStyles.push({ el, cssText: el.style.cssText });
  }

  private restoreStyles(): void {
    for (const { el, cssText } of this.savedStyles) {
      el.style.cssText = cssText;
    }
    this.savedStyles = [];
  }

  private saveAndApplyLayout(): void {
    if (this.options.lockDocumentScroll) {
      this.lockDocument();
    }

    this.saveStyle(this.wrapper);
    Object.assign(this.wrapper.style, {
      position: 'relative',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      zIndex: String(this.options.wrapperZIndex),
    });
  }

  private lockDocument(): void {
    if (this.documentLocked) return;
    const html = document.documentElement;
    const body = document.body;
    this.saveStyle(html);
    this.saveStyle(body);
    html.style.height = '100%';
    html.style.overflow = 'hidden';
    body.style.height = '100%';
    body.style.overflow = 'hidden';
    body.style.margin = body.style.margin || '0';
    this.documentLocked = true;
  }

  private unlockDocument(): void {
    this.documentLocked = false;
  }

  private setupSections(): void {
    this.sections.forEach((section, i) => {
      section.setAttribute(DATA.sectionIndex, String(i + 1));
      Object.assign(section.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
        willChange: 'transform',
      });
    });
  }

  private setupSlides(): void {
    this.sections.forEach((section, sectionIndex) => {
      const slides = this.getSlidesFromSection(section);
      if (!slides.length) {
        this.slideIndexes.set(sectionIndex, 0);
        return;
      }

      this.slideIndexes.set(sectionIndex, 0);

      slides.forEach((slide, i) => {
        slide.setAttribute(DATA.slideIndex, String(i + 1));
        Object.assign(slide.style, {
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          boxSizing: 'border-box',
          willChange: 'transform',
        });
      });

      this.applySlidePositions(sectionIndex, false);

      const arrows = toArray(
        section.querySelectorAll<HTMLElement>(`[${DATA.slideArrow}]`),
      );
      for (const arrow of arrows) {
        arrow.style.zIndex = String(slides.length + 1);
      }
    });
  }

  private setupNav(): void {
    const navs = toArray(
      document.querySelectorAll<HTMLElement>(`[${DATA.sectionNav}]`),
    );
    const { signal } = this.ac;

    for (const nav of navs) {
      nav.style.zIndex = String(this.options.wrapperZIndex + 1);
      const items = toArray(nav.children);
      items.forEach((item, i) => {
        item.setAttribute(DATA.sectionNavIndex, String(i + 1));
        item.addEventListener(
          'click',
          () => {
            void this.goToSection(item.getAttribute(DATA.sectionNavIndex) ?? i + 1);
          },
          { signal },
        );
      });
    }
  }

  private bindInputs(): void {
    const { signal } = this.ac;
    const { options } = this;

    if (options.wheel) {
      this.wrapper.addEventListener('wheel', this.onWheel, {
        passive: false,
        signal,
      });
    }

    if (options.keyboard) {
      document.addEventListener('keydown', this.onKeyDown, { signal });
    }

    if (options.touch) {
      this.wrapper.addEventListener('pointerdown', this.onPointerDown, { signal });
      this.wrapper.addEventListener('pointerup', this.onPointerUp, { signal });
      this.wrapper.addEventListener('pointercancel', this.onPointerCancel, {
        signal,
      });
    }

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            /* layout is percentage/inset based — noop placeholder for future */
          })
        : null;
    ro?.observe(this.wrapper);
    signal.addEventListener('abort', () => ro?.disconnect());
  }

  // ─── positions ───────────────────────────────────────────

  private sectionTransform(fromIndex: number, sectionIndex: number): string {
    if (sectionIndex < fromIndex) return 'translate3d(0, -100%, 0)';
    if (sectionIndex > fromIndex) return 'translate3d(0, 100%, 0)';
    return 'translate3d(0, 0, 0)';
  }

  private applySectionPositions(activeIndex: number, _animate: boolean): void {
    this.sections.forEach((section, i) => {
      setTransform(section, this.sectionTransform(activeIndex, i));
      section.style.zIndex = i === activeIndex ? '2' : '1';
    });
  }

  private slideTransform(fromIndex: number, slideIndex: number): string {
    if (slideIndex < fromIndex) return 'translate3d(-100%, 0, 0)';
    if (slideIndex > fromIndex) return 'translate3d(100%, 0, 0)';
    return 'translate3d(0, 0, 0)';
  }

  private applySlidePositions(sectionIndex: number, _animate: boolean): void {
    const slides = this.getSlides(sectionIndex);
    const active = this.slideIndexes.get(sectionIndex) ?? 0;
    slides.forEach((slide, i) => {
      setTransform(slide, this.slideTransform(active, i));
      slide.style.zIndex = i === active ? '2' : '1';
    });
  }

  private getSlides(sectionIndex: number): HTMLElement[] {
    const section = this.sections[sectionIndex];
    if (!section) return [];
    return this.getSlidesFromSection(section);
  }

  private getSlidesFromSection(section: HTMLElement): HTMLElement[] {
    const direct = toArray(
      section.querySelectorAll<HTMLElement>(`:scope > [${DATA.slide}]`),
    );
    if (direct.length) return direct;
    return toArray(section.querySelectorAll<HTMLElement>(`[${DATA.slide}]`));
  }

  private markCurrent(): void {
    const { currentClass } = this.options;
    this.sections.forEach((section, i) => {
      if (i === this.index) addClass(section, currentClass);
      else removeClass(section, currentClass);

      const slides = this.getSlides(i);
      const activeSlide = this.slideIndexes.get(i) ?? 0;
      slides.forEach((slide, si) => {
        if (i === this.index && si === activeSlide) addClass(slide, currentClass);
        else removeClass(slide, currentClass);
      });
    });
  }

  private updateNav(): void {
    const navs = toArray(
      document.querySelectorAll<HTMLElement>(`[${DATA.sectionNav}]`),
    );
    const active = this.options.sectionNavItemActiveClass;
    const current = String(this.sectionIndex);

    for (const nav of navs) {
      const items = toArray(nav.children);
      for (const item of items) {
        if (item.getAttribute(DATA.sectionNavIndex) === current) {
          addClass(item, active);
        } else {
          removeClass(item, active);
        }
      }
    }
  }

  private lazyload(screen: HTMLElement | undefined): void {
    if (!screen) return;
    const images = toArray(
      screen.querySelectorAll<HTMLImageElement>(`[${DATA.origin}]`),
    );
    for (const img of images) {
      const origin = img.getAttribute(DATA.origin);
      if (origin && img.getAttribute('src') !== origin) {
        img.setAttribute('src', origin);
      }
    }
  }

  private durationFor(el: HTMLElement | undefined): number {
    return parseDurationAttr(el ?? null, this.options.duration);
  }

  // ─── transitions ─────────────────────────────────────────

  /**
   * Walk from → to one page at a time so every intermediate section is shown.
   * Intermediate hops use `skipDuration`; the last hop uses normal duration.
   */
  private async transitionChain(from: number, to: number): Promise<void> {
    const step = to > from ? 1 : -1;
    const direction: Direction = step > 0 ? 'down' : 'up';
    const skipMs = Math.max(80, this.options.skipDuration);

    this.chaining = true;
    try {
      let cur = from;
      while (cur !== to) {
        if (this.destroyed) return;
        const next = cur + step;
        const isLast = next === to;
        await this.transitionSection(cur, next, direction, {
          duration: isLast ? undefined : skipMs,
          // keep wheel locked across the whole chain
          settleLockMs: isLast ? 140 : 40,
        });
        cur = next;
      }
    } finally {
      this.chaining = false;
    }
  }

  private async transitionSection(
    from: number,
    to: number,
    direction: Direction,
    opts?: { duration?: number; settleLockMs?: number },
  ): Promise<void> {
    const fromEl = this.sections[from];
    const toEl = this.sections[to];
    if (!fromEl || !toEl) return;

    this.animating = true;
    this.animAc?.abort();
    this.animAc = new AbortController();
    const { signal } = this.animAc;

    addClass(fromEl, this.options.animatingClass);
    addClass(toEl, this.options.animatingClass);

    // ensure off-screen neighbors are placed correctly
    this.sections.forEach((section, i) => {
      if (i === from || i === to) return;
      setTransform(section, this.sectionTransform(to, i));
      section.style.zIndex = '1';
    });

    const fromStart = 'translate3d(0, 0, 0)';
    const fromEnd =
      direction === 'down' ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 100%, 0)';
    const toStart =
      direction === 'down' ? 'translate3d(0, 100%, 0)' : 'translate3d(0, -100%, 0)';
    const toEnd = 'translate3d(0, 0, 0)';

    setTransform(fromEl, fromStart);
    setTransform(toEl, toStart);
    fromEl.style.zIndex = '3';
    toEl.style.zIndex = '2';

    const base = Math.max(this.durationFor(fromEl), this.durationFor(toEl));
    const duration = opts?.duration ?? base;
    const easing = this.options.easing;

    await Promise.all([
      animateTransform(fromEl, fromStart, fromEnd, { duration, easing, signal }),
      animateTransform(toEl, toStart, toEnd, { duration, easing, signal }),
    ]);

    if (this.destroyed) return;

    this.index = to;
    this.applySectionPositions(to, false);
    removeClass(fromEl, this.options.animatingClass);
    removeClass(toEl, this.options.animatingClass);
    this.markCurrent();
    this.lazyload(toEl);
    this.updateNav();
    this.wrapper.setAttribute(DATA.currentSection, String(this.sectionIndex));
    this.animating = false;
    this.wheelLockUntil =
      performance.now() + (opts?.settleLockMs ?? 140);

    this.emitter.emit('change', { from, to, direction });
  }

  private async transitionSlide(
    from: number,
    to: number,
    direction: Direction,
  ): Promise<void> {
    const slides = this.getSlides(this.index);
    const fromEl = slides[from];
    const toEl = slides[to];
    if (!fromEl || !toEl) return;

    this.animating = true;
    this.animAc?.abort();
    this.animAc = new AbortController();
    const { signal } = this.animAc;

    addClass(fromEl, this.options.animatingClass);
    addClass(toEl, this.options.animatingClass);

    const fromStart = 'translate3d(0, 0, 0)';
    const fromEnd =
      direction === 'right' ? 'translate3d(-100%, 0, 0)' : 'translate3d(100%, 0, 0)';
    const toStart =
      direction === 'right' ? 'translate3d(100%, 0, 0)' : 'translate3d(-100%, 0, 0)';
    const toEnd = 'translate3d(0, 0, 0)';

    setTransform(fromEl, fromStart);
    setTransform(toEl, toStart);
    fromEl.style.zIndex = '3';
    toEl.style.zIndex = '2';

    const duration = Math.max(this.durationFor(fromEl), this.durationFor(toEl));
    const easing = this.options.easing;

    await Promise.all([
      animateTransform(fromEl, fromStart, fromEnd, { duration, easing, signal }),
      animateTransform(toEl, toStart, toEnd, { duration, easing, signal }),
    ]);

    if (this.destroyed) return;

    this.slideIndexes.set(this.index, to);
    this.applySlidePositions(this.index, false);
    removeClass(fromEl, this.options.animatingClass);
    removeClass(toEl, this.options.animatingClass);
    this.markCurrent();
    this.lazyload(toEl);
    this.animating = false;
    this.wheelLockUntil = performance.now() + 120;

    this.emitter.emit('slideChange', {
      section: this.index,
      from,
      to,
      direction,
    });
  }

  // ─── input handlers ──────────────────────────────────────

  private activeScrollRoot(): HTMLElement {
    const section = this.sections[this.index]!;
    const slides = this.getSlides(this.index);
    if (slides.length) {
      const slide = slides[this.slideIndexes.get(this.index) ?? 0];
      if (slide) return slide;
    }
    return section;
  }

  private onWheel = (e: WheelEvent): void => {
    if (
      this.animating ||
      this.chaining ||
      performance.now() < this.wheelLockUntil
    ) {
      e.preventDefault();
      return;
    }

    const dy = this.normalizeWheelDelta(e);
    if (Math.abs(dy) < this.options.wheelThreshold) return;

    const root = this.activeScrollRoot();
    const goingDown = dy > 0;

    if (goingDown) {
      if (!atScrollBottom(root)) return;
    } else {
      if (!atScrollTop(root)) return;
    }

    e.preventDefault();
    this.queueWheelGesture(goingDown ? 1 : -1, Math.abs(dy));
  };

  /** Convert wheel delta to approximate CSS pixels. */
  private normalizeWheelDelta(e: WheelEvent): number {
    let dy = e.deltaY;
    // 0: pixel, 1: line, 2: page
    if (e.deltaMode === 1) dy *= 16;
    else if (e.deltaMode === 2) dy *= window.innerHeight || 800;
    return dy;
  }

  /**
   * Accumulate a short wheel burst so a hard trackpad flick
   * can skip several sections in one go.
   */
  private queueWheelGesture(dir: 1 | -1, magnitude: number): void {
    const g = this.wheelGesture;

    if (g.dir !== 0 && g.dir !== dir) {
      // direction flipped mid-gesture — commit previous first
      this.flushWheelGesture();
    }

    this.wheelGesture.dir = dir;
    this.wheelGesture.sum += magnitude;

    if (this.wheelGesture.timer != null) {
      clearTimeout(this.wheelGesture.timer);
    }

    // Always coalesce briefly so trackpad bursts become one decision.
    // Multi-hop only kicks in when accumulated sum is clearly large.
    const wait = this.options.wheelSkip
      ? Math.max(16, this.options.wheelSkipWindow)
      : 0;

    if (wait <= 0) {
      this.flushWheelGesture();
      return;
    }

    this.wheelGesture.timer = setTimeout(() => {
      this.flushWheelGesture();
    }, wait);
  }

  private clearWheelGesture(): void {
    if (this.wheelGesture.timer != null) {
      clearTimeout(this.wheelGesture.timer);
    }
    this.wheelGesture = { dir: 0, sum: 0, timer: null };
  }

  private flushWheelGesture(): void {
    const { dir, sum } = this.wheelGesture;
    this.clearWheelGesture();

    if (
      !dir ||
      sum <= 0 ||
      this.destroyed ||
      this.animating ||
      this.chaining
    ) {
      return;
    }

    const steps = this.stepsFromIntensity(
      sum,
      this.options.wheelSkip,
      this.options.wheelSkipUnit,
      this.options.wheelSkipMax,
    );

    void this.stepBy(dir * steps);
  }

  /**
   * Map gesture intensity → hop count.
   * One page is the default; each *full* extra `unit` of intensity adds one hop.
   * (Previously `round(sum/unit)` was far too aggressive.)
   */
  private stepsFromIntensity(
    intensity: number,
    enabled: boolean,
    unit: number,
    max: number,
  ): number {
    if (!enabled || unit <= 0) return 1;
    const extra = Math.floor(Math.max(0, intensity - this.options.wheelThreshold) / unit);
    return Math.min(Math.max(1, max), 1 + extra);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (this.animating || this.chaining) return;

    // ignore when typing
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.isContentEditable ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT')
    ) {
      return;
    }

    const root = this.activeScrollRoot();

    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        if (!atScrollBottom(root)) return;
        e.preventDefault();
        void this.next();
        break;
      case 'ArrowUp':
      case 'PageUp':
        if (!atScrollTop(root)) return;
        e.preventDefault();
        void this.prev();
        break;
      case 'ArrowRight':
        if (this.getSlides(this.index).length) {
          e.preventDefault();
          void this.nextSlide();
        }
        break;
      case 'ArrowLeft':
        if (this.getSlides(this.index).length) {
          e.preventDefault();
          void this.prevSlide();
        }
        break;
      case 'Home':
        e.preventDefault();
        void this.goTo(0);
        break;
      case 'End':
        e.preventDefault();
        void this.goTo(this.sections.length - 1);
        break;
      default:
        break;
    }
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        'button, a, input, textarea, select, label, [data-wall-no-swipe]',
      )
    ) {
      return;
    }
    this.pointerStart = { x: e.clientX, y: e.clientY };
    try {
      this.wrapper.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  private onPointerCancel = (): void => {
    this.pointerStart = null;
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.pointerStart || this.animating || this.chaining) {
      this.pointerStart = null;
      return;
    }

    const dx = e.clientX - this.pointerStart.x;
    const dy = e.clientY - this.pointerStart.y;
    this.pointerStart = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = this.options.swipeThreshold;

    if (absX < threshold && absY < threshold) return;

    const root = this.activeScrollRoot();

    if (absY >= absX) {
      // vertical — longer flicks can skip multiple sections
      if (dy < 0) {
        if (!atScrollBottom(root)) return;
        const steps = this.stepsFromIntensity(
          absY,
          this.options.swipeSkip,
          this.options.swipeSkipUnit,
          this.options.swipeSkipMax,
        );
        void this.stepBy(steps);
      } else {
        if (!atScrollTop(root)) return;
        const steps = this.stepsFromIntensity(
          absY,
          this.options.swipeSkip,
          this.options.swipeSkipUnit,
          this.options.swipeSkipMax,
        );
        void this.stepBy(-steps);
      }
    } else if (this.getSlides(this.index).length) {
      if (dx < 0) void this.nextSlide();
      else void this.prevSlide();
    }
  };
}
