# `@wall.js/svelte`

Svelte 5 bindings for wall.js.

## Install

```bash
pnpm add wall.js @wall.js/svelte
```

## Usage

```svelte
<script lang="ts">
  import { Wall, WallSection, WallSlide } from '@wall.js/svelte'

  let wall = $state<Wall | null>(null)
</script>

<div style="height: 100dvh">
  <Wall
    bind:this={wall}
    duration={700}
    onchange={({ to }) => console.log(to)}
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

## API

| | |
| --- | --- |
| Components | `Wall`, `WallSection`, `WallSlide` |
| Props | All core `WallOptions` + `remountKey` |
| Callbacks | `onchange`, `onslidechange`, `ondestroy` |
| Methods | `next`, `prev`, `goTo`, `getInstance`, … (`bind:this`) |
| Helpers | `useWall()`, `useWallOptional()` |
