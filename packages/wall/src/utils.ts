import type { ResolvedWallOptions, WallOptions } from './types';
import { DEFAULT_OPTIONS } from './types';

export function resolveOptions(options: WallOptions = {}): ResolvedWallOptions {
  const loop = options.loop ?? DEFAULT_OPTIONS.loop;
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    loop,
    loopToBottom: options.loopToBottom ?? loop,
    loopToTop: options.loopToTop ?? loop,
  };
}

export function toArray<T extends Element>(list: ArrayLike<T> | Iterable<T>): T[] {
  return Array.from(list);
}

export function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * `data-wall-animate-duration` accepts seconds (legacy, e.g. `1` or `0.8`)
 * or milliseconds when the value is clearly large (`>= 20`).
 */
export function parseDurationAttr(
  el: Element | null | undefined,
  fallbackMs: number,
): number {
  if (!el) return fallbackMs;
  const raw = el.getAttribute('data-wall-animate-duration');
  if (raw == null || raw === '') return fallbackMs;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return fallbackMs;
  return n >= 20 ? n : n * 1000;
}

export function atScrollTop(el: HTMLElement): boolean {
  return el.scrollTop <= 0;
}

export function atScrollBottom(el: HTMLElement): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= 1;
}

export function addClass(el: Element | null | undefined, className: string): void {
  if (el && className) el.classList.add(className);
}

export function removeClass(
  el: Element | null | undefined,
  className: string,
): void {
  if (el && className) el.classList.remove(className);
}

export function setTransform(el: HTMLElement, value: string): void {
  el.style.transform = value;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
