<script lang="ts">
  import { onDestroy, setContext } from 'svelte';
  import {
    Wall as WallCore,
    type WallEventMap,
    type WallOptions,
  } from 'wall.js';
  import { WALL_CONTEXT_KEY, type WallContextValue } from './context.js';
  import { optionsFingerprint, pickWallOptions } from './options.js';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = WallOptions &
    Omit<HTMLAttributes<HTMLDivElement>, 'onchange' | 'children'> & {
      remountKey?: string | number;
      children?: Snippet;
      onchange?: (payload: WallEventMap['change']) => void;
      onslidechange?: (payload: WallEventMap['slideChange']) => void;
      ondestroy?: () => void;
    };

  let {
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
    remountKey,
    children,
    onchange,
    onslidechange,
    ondestroy,
    class: className = '',
    style = '',
    ...dom
  }: Props = $props();

  let el = $state<HTMLDivElement | null>(null);
  let wall = $state<WallCore | null>(null);
  let index = $state(0);
  let slideIndex = $state(0);

  const optionProps = $derived({
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
  } satisfies WallOptions);

  const fingerprint = $derived(optionsFingerprint(optionProps));

  setContext<WallContextValue>(WALL_CONTEXT_KEY, {
    get wall() {
      return wall;
    },
    get index() {
      return index;
    },
    get slideIndex() {
      return slideIndex;
    },
  });

  $effect(() => {
    void fingerprint;
    void remountKey;
    const node = el;
    if (!node) return;

    let instance: WallCore;
    try {
      instance = new WallCore(node, pickWallOptions(optionProps));
    } catch (err) {
      console.error('[ @wall.js/svelte ] failed to create Wall', err);
      return;
    }

    wall = instance;
    index = instance.currentIndex;
    slideIndex = instance.currentSlideIndex;

    const offChange = instance.on('change', (payload) => {
      index = payload.to;
      slideIndex = instance.currentSlideIndex;
      onchange?.(payload);
    });
    const offSlide = instance.on('slideChange', (payload) => {
      slideIndex = payload.to;
      onslidechange?.(payload);
    });
    const offDestroy = instance.on('destroy', () => {
      ondestroy?.();
    });

    return () => {
      offChange();
      offSlide();
      offDestroy();
      instance.destroy();
      if (wall === instance) wall = null;
    };
  });

  onDestroy(() => {
    wall?.destroy();
    wall = null;
  });

  export function next() {
    return wall?.next() ?? Promise.resolve();
  }
  export function prev() {
    return wall?.prev() ?? Promise.resolve();
  }
  export function goTo(i: number) {
    return wall?.goTo(i) ?? Promise.resolve();
  }
  export function goToSection(n: number | string) {
    return wall?.goToSection(n) ?? Promise.resolve();
  }
  export function nextSlide() {
    return wall?.nextSlide() ?? Promise.resolve();
  }
  export function prevSlide() {
    return wall?.prevSlide() ?? Promise.resolve();
  }
  export function goToSlide(i: number) {
    return wall?.goToSlide(i) ?? Promise.resolve();
  }
  export function stepBy(delta: number) {
    return wall?.stepBy(delta) ?? Promise.resolve();
  }
  export function destroy() {
    wall?.destroy();
  }

  export function getInstance() {
    return wall;
  }
</script>

<div
  bind:this={el}
  class={['wall-js-svelte', className].filter(Boolean).join(' ')}
  style="height:100%;width:100%;{typeof style === 'string' ? style : ''}"
  {...dom}
>
  {@render children?.()}
</div>
