import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';

export type WallSlideProps = ComponentPropsWithoutRef<'div'> & {
  /**
   * Per-slide animation duration.
   * Seconds if `< 20`, otherwise milliseconds.
   */
  animateDuration?: number | string;
};

export const WallSlide = forwardRef<ElementRef<'div'>, WallSlideProps>(
  function WallSlide({ animateDuration, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-wall-slide=""
        data-wall-animate-duration={
          animateDuration != null ? String(animateDuration) : undefined
        }
        {...rest}
      >
        {children}
      </div>
    );
  },
);

WallSlide.displayName = 'Wall.Slide';
