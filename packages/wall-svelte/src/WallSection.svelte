<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLElement> & {
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

<section
  class={className}
  data-wall-animate-duration={animateDuration != null ? String(animateDuration) : undefined}
  {...rest}
>
  {@render children?.()}
</section>
