<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement> & {
    animateDuration?: number | string;
    children?: Snippet;
  };

  let {
    animateDuration,
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<div
  class={className}
  data-wall-slide=""
  data-wall-animate-duration={animateDuration != null ? String(animateDuration) : undefined}
  {...rest}
>
  {@render children?.()}
</div>
