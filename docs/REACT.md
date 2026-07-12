# `@wall.js/react`

React port of wall.js — not a React rewrite of the animation engine. The core stays vanilla; this package mounts it on a wrapper and exposes compound components.

## Install

```bash
pnpm add wall.js @wall.js/react
# peer: react >= 18, react-dom >= 18
```

## Quick start

```tsx
import { useRef } from 'react'
import { Wall, type WallHandle } from '@wall.js/react'

export function Page() {
  const ref = useRef<WallHandle>(null)

  return (
    <div style={{ height: '100dvh' }}>
      <Wall
        ref={ref}
        duration={700}
        onChange={({ to }) => console.log('section', to)}
      >
        <Wall.Section>
          <h1>Intro</h1>
          <button type="button" onClick={() => ref.current?.next()}>
            Next
          </button>
        </Wall.Section>

        <Wall.Section>
          <Wall.Slide>A</Wall.Slide>
          <Wall.Slide>B</Wall.Slide>
        </Wall.Section>

        <Wall.Section>End</Wall.Section>
      </Wall>
    </div>
  )
}
```

## Components

### `<Wall>`

Creates the wrapper `div`, constructs `new Wall(el, options)` on mount, calls `destroy()` on unmount.

- Spreads all [core options](./API.md) as props (`duration`, `easing`, `loop`, …).
- `onChange` / `onSlideChange` / `onDestroy` callbacks.
- `remountKey` — change this to re-init after dynamic children updates.
- Forwards DOM props (`className`, `style`, `id`, …).

### `<Wall.Section>` / `<WallSection>`

Renders `<section>`. Optional `animateDuration` → `data-wall-animate-duration`.

### `<Wall.Slide>` / `<WallSlide>`

Renders `<div data-wall-slide>`. Optional `animateDuration`.

## Hooks

```tsx
import { useWall } from '@wall.js/react'

function Dots() {
  const { wall, index } = useWall()
  return (
    <button type="button" onClick={() => wall?.goTo(0)}>
      Section {index + 1}
    </button>
  )
}
```

`useWallOptional()` returns `null` outside a `<Wall>` tree instead of throwing.

## Ref (`WallHandle`)

```ts
ref.current.next()
ref.current.prev()
ref.current.goTo(2)
ref.current.goToSection(3) // 1-based
ref.current.nextSlide()
ref.current.instance // wall.js Wall | null
```

## Lifecycle notes

1. Core is created in `useEffect` after the section DOM exists.
2. Option prop changes re-create the instance (previous `destroy()` restores styles).
3. Adding/removing sections at runtime: update children, then bump `remountKey`.
4. Always give the wall (or a parent) a definite height (`100vh` / flex).

## Monorepo

```
packages/wall         # wall.js core
packages/wall-react   # @wall.js/react
apps/site             # vanilla experience site (not React)
```
