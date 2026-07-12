# wall.js

**Modern fullpage piling** — zero runtime dependency, TypeScript-first, destroyable.

Monorepo (Turborepo + pnpm):

| Package | Path | Description |
| --- | --- | --- |
| `wall.js` | `packages/wall` | Core library |
| `@wall.js/react` | `packages/wall-react` | React — `<Wall />` |
| `@wall.js/vue` | `packages/wall-vue` | Vue 3 — `<Wall>` |
| `@wall.js/svelte` | `packages/wall-svelte` | Svelte 5 — `<Wall>` |
| `@wall.js/site` | `apps/site` | Experience website (vanilla) |

The site **is** a live wall.js demo — scroll, swipe, or use arrow keys.

```bash
pnpm install
pnpm dev              # experience site
pnpm build            # all packages + site
pnpm build:packages   # core + framework bindings
pnpm typecheck
```

## Install

```bash
pnpm add wall.js

# framework bindings
pnpm add wall.js @wall.js/react
pnpm add wall.js @wall.js/vue
pnpm add wall.js @wall.js/svelte
```

CDN (core):

```html
<script src="https://unpkg.com/wall.js@2/dist/wall.iife.js"></script>
```

## Core quick start

```js
import { Wall } from 'wall.js'

const wall = new Wall('#wall', { duration: 700 })
wall.on('change', ({ from, to, direction }) => {
  console.log(from, '→', to, direction)
})
```

## React

```tsx
import { Wall } from '@wall.js/react'

<Wall duration={700}>
  <Wall.Section>One</Wall.Section>
  <Wall.Section>
    <Wall.Slide>A</Wall.Slide>
    <Wall.Slide>B</Wall.Slide>
  </Wall.Section>
</Wall>
```

## Vue

```vue
<script setup>
import { Wall, WallSection, WallSlide } from '@wall.js/vue'
</script>

<template>
  <Wall :duration="700">
    <WallSection>One</WallSection>
    <WallSection>
      <WallSlide>A</WallSlide>
      <WallSlide>B</WallSlide>
    </WallSection>
  </Wall>
</template>
```

## Svelte

```svelte
<script>
  import { Wall, WallSection, WallSlide } from '@wall.js/svelte'
</script>

<Wall duration={700}>
  <WallSection>One</WallSection>
  <WallSection>
    <WallSlide>A</WallSlide>
    <WallSlide>B</WallSlide>
  </WallSection>
</Wall>
```

## Docs

| Doc | |
| --- | --- |
| [API](./docs/API.md) | Core options, methods, events |
| [React](./docs/REACT.md) | `@wall.js/react` |
| [Vue](./docs/VUE.md) | `@wall.js/vue` |
| [Svelte](./docs/SVELTE.md) | `@wall.js/svelte` |
| [Migration](./docs/MIGRATION.md) | 0.x → 2.x |
| [Site](./docs/SITE.md) | Experience website |

## Scripts (root)

| Command | Description |
| --- | --- |
| `pnpm dev` | Site (Turbo) |
| `pnpm build` | All packages + site |
| `pnpm build:packages` | Core + React / Vue / Svelte |
| `pnpm typecheck` | `tsc` / `vue-tsc` / `svelte-check` |

## License

MIT © nichenqin
