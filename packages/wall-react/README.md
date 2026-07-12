# `@wall.js/react`

React bindings for [wall.js](https://github.com/nichenqin/wall.js) — compound components, refs, and hooks.

## Install

```bash
pnpm add wall.js @wall.js/react react react-dom
```

## Usage

```tsx
import { useRef } from 'react'
import { Wall, useWall, type WallHandle } from '@wall.js/react'

function App() {
  const wallRef = useRef<WallHandle>(null)

  return (
    <div style={{ height: '100vh' }}>
      <Wall
        ref={wallRef}
        duration={700}
        onChange={({ from, to, direction }) => {
          console.log(from, '→', to, direction)
        }}
      >
        <Wall.Section className="hero">
          <h1>Hello</h1>
          <button type="button" onClick={() => wallRef.current?.next()}>
            Next
          </button>
        </Wall.Section>

        <Wall.Section>
          <Indicator />
        </Wall.Section>

        <Wall.Section>
          <Wall.Slide>One</Wall.Slide>
          <Wall.Slide>Two</Wall.Slide>
          <Wall.Slide>Three</Wall.Slide>
        </Wall.Section>
      </Wall>
    </div>
  )
}

function Indicator() {
  const { index, slideIndex, wall } = useWall()
  return (
    <p>
      Section {index + 1} · slide {slideIndex + 1}
      <button type="button" onClick={() => wall?.goTo(0)}>
        Top
      </button>
    </p>
  )
}
```

### Named imports (same components)

```tsx
import { Wall, WallSection, WallSlide } from '@wall.js/react'

<Wall>
  <WallSection>…</WallSection>
  <WallSection>
    <WallSlide>…</WallSlide>
  </WallSection>
</Wall>
```

## API

### `<Wall>`

| Prop | Type | Description |
| --- | --- | --- |
| `…WallOptions` | | All core options (`duration`, `easing`, `loop`, …) |
| `onChange` | `(payload) => void` | After section change |
| `onSlideChange` | `(payload) => void` | After slide change |
| `onDestroy` | `() => void` | After destroy |
| `remountKey` | `string \| number` | Force re-init (e.g. dynamic sections) |
| DOM props | | `className`, `style`, `id`, … on the wrapper `div` |

### `ref: WallHandle`

```ts
wallRef.current?.next()
wallRef.current?.goTo(2)
wallRef.current?.instance // raw wall.js Wall
```

### `useWall()`

Returns `{ wall, index, slideIndex }` from the nearest `<Wall>`.

### Markup mapping

| React | DOM |
| --- | --- |
| `<Wall>` | wrapper `div.wall-js` |
| `<Wall.Section>` | `<section>` |
| `<Wall.Slide>` | `<div data-wall-slide>` |

## Notes

- Parent should give the wall a definite height (`100vh` / `100dvh` / flex child).
- Changing option props re-creates the core instance (styles restored via `destroy()`).
- Structural children changes: bump `remountKey` after the new sections are in the DOM.
