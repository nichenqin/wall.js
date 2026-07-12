import type { DefineComponent, Ref, StyleValue } from 'vue';
import type { Direction, WallEventMap, WallOptions } from 'wall.js';

export type WallChangePayload = WallEventMap['change'];
export type WallSlideChangePayload = WallEventMap['slideChange'];

/** Public surface of the core Wall instance used in Vue context. */
export type WallInstance = {
  readonly wrapper: HTMLElement;
  readonly currentIndex: number;
  readonly sectionIndex: number;
  readonly currentSlideIndex: number;
  readonly isAnimating: boolean;
  readonly sectionCount: number;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  goTo: (index: number) => Promise<void>;
  goToSection: (oneBased: number | string) => Promise<void>;
  nextSlide: () => Promise<void>;
  prevSlide: () => Promise<void>;
  goToSlide: (index: number) => Promise<void>;
  stepBy: (delta: number) => Promise<void>;
  destroy: () => void;
};

export type WallContextValue = {
  wall: Ref<WallInstance | null>;
  index: Ref<number>;
  slideIndex: Ref<number>;
};

export type WallProps = WallOptions & {
  remountKey?: string | number;
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>;
  style?: StyleValue;
};

export type WallSectionProps = {
  animateDuration?: number | string;
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>;
  style?: StyleValue;
};

export type WallSlideProps = WallSectionProps;

export declare const Wall: DefineComponent<WallProps>;
export declare const WallSection: DefineComponent<WallSectionProps>;
export declare const WallSlide: DefineComponent<WallSlideProps>;

export declare function useWall(): WallContextValue;
export declare function useWallOptional(): WallContextValue | null;

export type { Direction, WallOptions };
