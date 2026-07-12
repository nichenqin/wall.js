import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';

export type WallSectionProps = ComponentPropsWithoutRef<'section'> & {
  /**
   * Per-section animation duration.
   * Seconds if `< 20`, otherwise milliseconds (same as core `data-wall-animate-duration`).
   */
  animateDuration?: number | string;
};

export const WallSection = forwardRef<ElementRef<'section'>, WallSectionProps>(
  function WallSection({ animateDuration, children, ...rest }, ref) {
    return (
      <section
        ref={ref}
        data-wall-animate-duration={
          animateDuration != null ? String(animateDuration) : undefined
        }
        {...rest}
      >
        {children}
      </section>
    );
  },
);

WallSection.displayName = 'Wall.Section';
