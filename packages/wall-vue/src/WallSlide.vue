<script setup lang="ts">
withDefaults(
  defineProps<{
    animateDuration?: number | string;
    class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>;
    style?: string | Record<string, string>;
  }>(),
  {},
);
</script>

<template>
  <div
    data-wall-slide=""
    :class="$props.class"
    :style="$props.style"
    :data-wall-animate-duration="
      animateDuration != null ? String(animateDuration) : undefined
    "
  >
    <slot />
  </div>
</template>
