# `@wall.js/svelte`

Svelte 5 bindings for [wall.js](https://github.com/nichenqin/wall.js).

## Install

```bash
pnpm add wall.js @wall.js/svelte
```

## Usage

```svelte
<script lang="ts">
  import { Wall, WallSection, WallSlide } from '@wall.js/svelte'

  let wall = $state<Wall | null>(null)

  function onChange(payload: { from: number; to: number; direction: string }) {
    console.log(payload)
  }
</script>

<div style="height: 100dvh">
  <Wall
    bind:this={wall}
    duration={700}
    onchange={onChange}
  >
    <WallSection>
      <h1>Hello</h1>
      <button type="button" onclick={() => wall?.next()}>Next</button>
    </WallSection>

    <WallSection>
      <WallSlide>A</WallSlide>
      <WallSlide>B</WallSlide>
    </WallSection>
  </Wall>
</div>
```

```svelte
<script lang="ts">
  import { useWall } from '@wall.js/svelte'
  const ctx = useWall()
</script>

<p>Section {ctx.index + 1}</p>
<button type="button" onclick={() => ctx.wall?.goTo(0)}>Top</button>
```

## API

- Props: all core `WallOptions` + `remountKey` + DOM attributes
- Callbacks: `onchange`, `onslidechange`, `ondestroy`
- Component methods (via `bind:this`): `next`, `prev`, `goTo`, `getInstance`, …
- `useWall()` / `useWallOptional()`
