<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue';
import {
  Wall as WallCore,
  type WallEventMap,
  type WallOptions,
} from 'wall.js';
import { wallKey, type WallInstance } from './context';
import { optionsFingerprint, pickWallOptions, type WallOptionProps } from './options';

export type WallChangePayload = WallEventMap['change'];
export type WallSlideChangePayload = WallEventMap['slideChange'];

const props = withDefaults(
  defineProps<
    WallOptionProps & {
      class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>;
      style?: string | Record<string, string>;
    }
  >(),
  {},
);

const emit = defineEmits<{
  change: [payload: WallChangePayload];
  slideChange: [payload: WallSlideChangePayload];
  destroy: [];
}>();

const root = ref<HTMLElement | null>(null);
const wall = ref<WallInstance | null>(null);
const index = ref(0);
const slideIndex = ref(0);

const fingerprint = computed(() => optionsFingerprint(props));

function create(): void {
  if (!root.value) return;

  wall.value?.destroy();
  wall.value = null;

  let instance: WallCore;
  try {
    instance = new WallCore(root.value, pickWallOptions(props) as WallOptions);
  } catch (err) {
    console.error('[ @wall.js/vue ] failed to create Wall', err);
    return;
  }

  wall.value = instance as WallInstance;
  index.value = instance.currentIndex;
  slideIndex.value = instance.currentSlideIndex;

  instance.on('change', (payload) => {
    index.value = payload.to;
    slideIndex.value = instance.currentSlideIndex;
    emit('change', payload);
  });
  instance.on('slideChange', (payload) => {
    slideIndex.value = payload.to;
    emit('slideChange', payload);
  });
  instance.on('destroy', () => {
    emit('destroy');
  });
}

onMounted(create);

onBeforeUnmount(() => {
  wall.value?.destroy();
  wall.value = null;
});

watch(
  () => [fingerprint.value, props.remountKey] as const,
  () => {
    create();
  },
);

provide(wallKey, { wall, index, slideIndex });

defineExpose({
  get instance() {
    return wall.value;
  },
  next: () => wall.value?.next() ?? Promise.resolve(),
  prev: () => wall.value?.prev() ?? Promise.resolve(),
  goTo: (i: number) => wall.value?.goTo(i) ?? Promise.resolve(),
  goToSection: (n: number | string) =>
    wall.value?.goToSection(n) ?? Promise.resolve(),
  nextSlide: () => wall.value?.nextSlide() ?? Promise.resolve(),
  prevSlide: () => wall.value?.prevSlide() ?? Promise.resolve(),
  goToSlide: (i: number) => wall.value?.goToSlide(i) ?? Promise.resolve(),
  stepBy: (delta: number) => wall.value?.stepBy(delta) ?? Promise.resolve(),
  destroy: () => wall.value?.destroy(),
  get currentIndex() {
    return wall.value?.currentIndex ?? 0;
  },
  get sectionIndex() {
    return wall.value?.sectionIndex ?? 1;
  },
  get currentSlideIndex() {
    return wall.value?.currentSlideIndex ?? 0;
  },
  get sectionCount() {
    return wall.value?.sectionCount ?? 0;
  },
  get isAnimating() {
    return wall.value?.isAnimating ?? false;
  },
});
</script>

<template>
  <div
    ref="root"
    class="wall-js-vue"
    :class="props.class"
    :style="[{ height: '100%', width: '100%' }, props.style]"
  >
    <slot />
  </div>
</template>
