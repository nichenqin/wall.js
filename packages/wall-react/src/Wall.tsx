import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import {
  Wall as WallCore,
  type WallEventMap,
  type WallOptions,
} from 'wall.js';
import { WallContext, type WallContextValue } from './context';
import { WallSection } from './Section';
import { WallSlide } from './Slide';

export type WallChangePayload = WallEventMap['change'];
export type WallSlideChangePayload = WallEventMap['slideChange'];

export type WallHandle = {
  /** Underlying wall.js instance (null if not mounted). */
  readonly instance: WallCore | null;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  goTo: (index: number) => Promise<void>;
  goToSection: (oneBased: number | string) => Promise<void>;
  nextSlide: () => Promise<void>;
  prevSlide: () => Promise<void>;
  goToSlide: (index: number) => Promise<void>;
  stepBy: (delta: number) => Promise<void>;
  destroy: () => void;
  readonly currentIndex: number;
  readonly sectionIndex: number;
  readonly currentSlideIndex: number;
  readonly sectionCount: number;
  readonly isAnimating: boolean;
};

export type WallProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> &
  WallOptions & {
    children?: ReactNode;
    /**
     * Force re-create the wall.js instance when this value changes
     * (e.g. after dynamic section inserts).
     */
    remountKey?: string | number;
    onChange?: (payload: WallChangePayload) => void;
    onSlideChange?: (payload: WallSlideChangePayload) => void;
    onDestroy?: () => void;
    /**
     * When true (default), wall.js locks document scroll on html/body.
     * Override via the same-named option.
     */
    lockDocumentScroll?: boolean;
  };

function pickOptions(props: WallProps): WallOptions {
  const {
    duration,
    easing,
    loop,
    loopToBottom,
    loopToTop,
    lockDocumentScroll,
    currentClass,
    animatingClass,
    sectionNavItemActiveClass,
    swipeThreshold,
    keyboard,
    wheel,
    touch,
    wrapperZIndex,
    wheelThreshold,
    wheelSkip,
    wheelSkipUnit,
    wheelSkipMax,
    wheelSkipWindow,
    skipDuration,
    swipeSkip,
    swipeSkipUnit,
    swipeSkipMax,
  } = props;

  return {
    duration,
    easing,
    loop,
    loopToBottom,
    loopToTop,
    lockDocumentScroll,
    currentClass,
    animatingClass,
    sectionNavItemActiveClass,
    swipeThreshold,
    keyboard,
    wheel,
    touch,
    wrapperZIndex,
    wheelThreshold,
    wheelSkip,
    wheelSkipUnit,
    wheelSkipMax,
    wheelSkipWindow,
    skipDuration,
    swipeSkip,
    swipeSkipUnit,
    swipeSkipMax,
  };
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    const value = obj[key];
    if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}

const WallRoot = forwardRef<WallHandle, WallProps>(function WallRoot(
  props,
  ref,
) {
  const {
    children,
    className,
    style,
    remountKey,
    onChange,
    onSlideChange,
    onDestroy,
    // wall options — pulled out so they don't land on the DOM node
    duration: _d,
    easing: _e,
    loop: _l,
    loopToBottom: _lb,
    loopToTop: _lt,
    lockDocumentScroll: _lds,
    currentClass: _cc,
    animatingClass: _ac,
    sectionNavItemActiveClass: _sn,
    swipeThreshold: _st,
    keyboard: _kb,
    wheel: _wh,
    touch: _tc,
    wrapperZIndex: _wz,
    wheelThreshold: _wt,
    wheelSkip: _ws,
    wheelSkipUnit: _wsu,
    wheelSkipMax: _wsm,
    wheelSkipWindow: _wsw,
    skipDuration: _sd,
    swipeSkip: _ss,
    swipeSkipUnit: _ssu,
    swipeSkipMax: _ssm,
    ...domProps
  } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WallCore | null>(null);
  const [index, setIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [version, setVersion] = useState(0);

  // Keep latest callbacks without re-instantiating Wall
  const onChangeRef = useRef(onChange);
  const onSlideChangeRef = useRef(onSlideChange);
  const onDestroyRef = useRef(onDestroy);
  onChangeRef.current = onChange;
  onSlideChangeRef.current = onSlideChange;
  onDestroyRef.current = onDestroy;

  const optionsKey = useMemo(
    () => JSON.stringify(stripUndefined(pickOptions(props))),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional snapshot of option fields
    [
      props.duration,
      props.easing,
      props.loop,
      props.loopToBottom,
      props.loopToTop,
      props.lockDocumentScroll,
      props.currentClass,
      props.animatingClass,
      props.sectionNavItemActiveClass,
      props.swipeThreshold,
      props.keyboard,
      props.wheel,
      props.touch,
      props.wrapperZIndex,
      props.wheelThreshold,
      props.wheelSkip,
      props.wheelSkipUnit,
      props.wheelSkipMax,
      props.wheelSkipWindow,
      props.skipDuration,
      props.swipeSkip,
      props.swipeSkipUnit,
      props.swipeSkipMax,
    ],
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const options = stripUndefined(pickOptions(props)) as WallOptions;
    let wall: WallCore;
    try {
      wall = new WallCore(el, options);
    } catch (err) {
      console.error('[ @wall.js/react ] failed to create Wall', err);
      return;
    }

    instanceRef.current = wall;
    setIndex(wall.currentIndex);
    setSlideIndex(wall.currentSlideIndex);
    setVersion((v) => v + 1);

    const offChange = wall.on('change', (payload) => {
      setIndex(payload.to);
      setSlideIndex(wall.currentSlideIndex);
      onChangeRef.current?.(payload);
    });

    const offSlide = wall.on('slideChange', (payload) => {
      setSlideIndex(payload.to);
      onSlideChangeRef.current?.(payload);
    });

    const offDestroy = wall.on('destroy', () => {
      onDestroyRef.current?.();
    });

    return () => {
      offChange();
      offSlide();
      offDestroy();
      wall.destroy();
      instanceRef.current = null;
    };
    // Remount when options or remountKey change. Children structure
    // changes should pass a new remountKey from the consumer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey, remountKey]);

  useImperativeHandle(
    ref,
    (): WallHandle => ({
      get instance() {
        return instanceRef.current;
      },
      next: () => instanceRef.current?.next() ?? Promise.resolve(),
      prev: () => instanceRef.current?.prev() ?? Promise.resolve(),
      goTo: (i) => instanceRef.current?.goTo(i) ?? Promise.resolve(),
      goToSection: (n) =>
        instanceRef.current?.goToSection(n) ?? Promise.resolve(),
      nextSlide: () => instanceRef.current?.nextSlide() ?? Promise.resolve(),
      prevSlide: () => instanceRef.current?.prevSlide() ?? Promise.resolve(),
      goToSlide: (i) => instanceRef.current?.goToSlide(i) ?? Promise.resolve(),
      stepBy: (delta) => instanceRef.current?.stepBy(delta) ?? Promise.resolve(),
      destroy: () => instanceRef.current?.destroy(),
      get currentIndex() {
        return instanceRef.current?.currentIndex ?? 0;
      },
      get sectionIndex() {
        return instanceRef.current?.sectionIndex ?? 1;
      },
      get currentSlideIndex() {
        return instanceRef.current?.currentSlideIndex ?? 0;
      },
      get sectionCount() {
        return instanceRef.current?.sectionCount ?? 0;
      },
      get isAnimating() {
        return instanceRef.current?.isAnimating ?? false;
      },
    }),
    [version],
  );

  const ctx = useMemo<WallContextValue>(
    () => ({
      wall: instanceRef.current,
      index,
      slideIndex,
    }),
    [index, slideIndex, version],
  );

  return (
    <WallContext.Provider value={ctx}>
      <div
        ref={wrapperRef}
        className={className}
        style={{ height: '100%', width: '100%', ...style }}
        {...domProps}
      >
        {children}
      </div>
    </WallContext.Provider>
  );
});

WallRoot.displayName = 'Wall';

export type WallComponent = typeof WallRoot & {
  Section: typeof WallSection;
  Slide: typeof WallSlide;
};

/** React port of wall.js — fullpage container with compound Section / Slide. */
export const Wall = WallRoot as WallComponent;
Wall.Section = WallSection;
Wall.Slide = WallSlide;

export type { WallOptions };
