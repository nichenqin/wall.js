import type { InjectionKey, Ref } from 'vue';
import type { Wall as WallCore } from 'wall.js';

/**
 * Public Wall surface used in Vue context.
 * (Class private fields make full `Wall` unassignable through Vue refs.)
 */
export type WallInstance = Pick<
  WallCore,
  | 'wrapper'
  | 'options'
  | 'currentIndex'
  | 'sectionIndex'
  | 'currentSlideIndex'
  | 'isAnimating'
  | 'sectionCount'
  | 'on'
  | 'off'
  | 'next'
  | 'prev'
  | 'goTo'
  | 'goToSection'
  | 'nextSection'
  | 'prevSection'
  | 'nextSlide'
  | 'prevSlide'
  | 'goToSlide'
  | 'stepBy'
  | 'destroy'
>;

export type WallContextValue = {
  wall: Ref<WallInstance | null>;
  index: Ref<number>;
  slideIndex: Ref<number>;
};

export const wallKey: InjectionKey<WallContextValue> = Symbol('wall.js');
