export type Direction = 'up' | 'down' | 'left' | 'right';

export type WallEventMap = {
  change: {
    from: number;
    to: number;
    direction: Direction;
  };
  slideChange: {
    section: number;
    from: number;
    to: number;
    direction: Direction;
  };
  destroy: undefined;
};

export type WallEventName = keyof WallEventMap;

export type WallEventHandler<E extends WallEventName> = (
  payload: WallEventMap[E],
) => void;

export interface WallOptions {
  /** Animation duration in milliseconds. Default: `700`. */
  duration?: number;
  /** CSS easing string. Default: `cubic-bezier(0.22, 0.61, 0.36, 1)`. */
  easing?: string;
  /** Loop from last section to first. Default: `false`. */
  loop?: boolean;
  /** Loop from first section to last when going prev. Default: follows `loop`. */
  loopToBottom?: boolean;
  /** Loop from last section to first when going next. Default: follows `loop`. */
  loopToTop?: boolean;
  /** Lock document scroll on html/body. Default: `true`. */
  lockDocumentScroll?: boolean;
  /** Class on the active section/slide. Default: `current`. */
  currentClass?: string;
  /** Class while a section/slide is animating. Default: `animating`. */
  animatingClass?: string;
  /** Active class for `[data-wall-section-nav]` children. Default: `active`. */
  sectionNavItemActiveClass?: string;
  /** Minimum swipe distance in px. Default: `60`. */
  swipeThreshold?: number;
  /** Enable keyboard navigation. Default: `true`. */
  keyboard?: boolean;
  /** Enable wheel navigation. Default: `true`. */
  wheel?: boolean;
  /** Enable touch/pointer navigation. Default: `true`. */
  touch?: boolean;
  /** z-index of the wrapper. Default: `1`. */
  wrapperZIndex?: number;
  /**
   * Wheel delta threshold before a page change fires.
   * Higher = less sensitive. Default: `20`.
   */
  wheelThreshold?: number;
  /**
   * When true, a hard / fast wheel gesture can pass through multiple sections
   * (each intermediate page is still shown, just faster). Default: `true`.
   */
  wheelSkip?: boolean;
  /**
   * Accumulated wheel delta (px) required **per extra** section beyond the first.
   * Higher = harder to multi-hop. Default: `320`.
   */
  wheelSkipUnit?: number;
  /**
   * Maximum sections advanced in one wheel gesture. Default: `3`.
   */
  wheelSkipMax?: number;
  /**
   * Time window (ms) to accumulate wheel deltas into one gesture.
   * Default: `90`.
   */
  wheelSkipWindow?: number;
  /**
   * Duration (ms) for intermediate hops when chaining through pages.
   * Final hop uses normal `duration`. Default: `260`.
   */
  skipDuration?: number;
  /**
   * When true, a long vertical swipe can multi-hop (with intermediate pages).
   * Default: `true`.
   */
  swipeSkip?: boolean;
  /**
   * Swipe distance (px) required per extra section. Default: `280`.
   */
  swipeSkipUnit?: number;
  /**
   * Max sections advanced in one swipe. Default: `3`.
   */
  swipeSkipMax?: number;
}

export interface ResolvedWallOptions {
  duration: number;
  easing: string;
  loop: boolean;
  loopToBottom: boolean;
  loopToTop: boolean;
  lockDocumentScroll: boolean;
  currentClass: string;
  animatingClass: string;
  sectionNavItemActiveClass: string;
  swipeThreshold: number;
  keyboard: boolean;
  wheel: boolean;
  touch: boolean;
  wrapperZIndex: number;
  wheelThreshold: number;
  wheelSkip: boolean;
  wheelSkipUnit: number;
  wheelSkipMax: number;
  wheelSkipWindow: number;
  skipDuration: number;
  swipeSkip: boolean;
  swipeSkipUnit: number;
  swipeSkipMax: number;
}

export const DATA = {
  animateDuration: 'data-wall-animate-duration',
  currentSection: 'data-wall-current-section',
  sectionNav: 'data-wall-section-nav',
  sectionIndex: 'data-wall-section-index',
  sectionNavIndex: 'data-wall-section-nav-index',
  slide: 'data-wall-slide',
  slideIndex: 'data-wall-slide-index',
  slideArrow: 'data-wall-slide-arrow',
  origin: 'data-wall-origin',
} as const;

export const DEFAULT_OPTIONS: ResolvedWallOptions = {
  duration: 700,
  easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  loop: false,
  loopToBottom: false,
  loopToTop: false,
  lockDocumentScroll: true,
  currentClass: 'current',
  animatingClass: 'animating',
  sectionNavItemActiveClass: 'active',
  swipeThreshold: 60,
  keyboard: true,
  wheel: true,
  touch: true,
  wrapperZIndex: 1,
  wheelThreshold: 28,
  wheelSkip: true,
  wheelSkipUnit: 320,
  wheelSkipMax: 3,
  wheelSkipWindow: 90,
  skipDuration: 260,
  swipeSkip: true,
  swipeSkipUnit: 280,
  swipeSkipMax: 3,
};
