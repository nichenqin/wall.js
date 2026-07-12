import { prefersReducedMotion, wait } from './utils';

export interface AnimateTransformOptions {
  duration: number;
  easing: string;
  signal?: AbortSignal;
}

/**
 * Animate `transform` with Web Animations API when available,
 * falling back to CSS transition.
 */
export async function animateTransform(
  el: HTMLElement,
  from: string,
  to: string,
  options: AnimateTransformOptions,
): Promise<void> {
  const duration = prefersReducedMotion() ? 0 : Math.max(0, options.duration);

  if (duration === 0) {
    el.style.transform = to;
    return;
  }

  if (typeof el.animate === 'function') {
    const animation = el.animate(
      [{ transform: from }, { transform: to }],
      {
        duration,
        easing: options.easing,
        fill: 'forwards',
      },
    );

    const abort = () => {
      try {
        animation.cancel();
      } catch {
        /* ignore */
      }
    };

    if (options.signal) {
      if (options.signal.aborted) {
        abort();
        el.style.transform = to;
        return;
      }
      options.signal.addEventListener('abort', abort, { once: true });
    }

    try {
      await animation.finished;
    } catch {
      /* cancelled */
    } finally {
      options.signal?.removeEventListener('abort', abort);
    }

    el.style.transform = to;
    animation.cancel();
    return;
  }

  // CSS transition fallback
  el.style.transition = 'none';
  el.style.transform = from;
  // force reflow
  void el.offsetWidth;
  el.style.transition = `transform ${duration}ms ${options.easing}`;
  el.style.transform = to;

  await Promise.race([
    new Promise<void>((resolve) => {
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'transform') return;
        el.removeEventListener('transitionend', onEnd);
        resolve();
      };
      el.addEventListener('transitionend', onEnd);
    }),
    wait(duration + 50),
  ]);

  el.style.transition = '';
}
