# wall.js API

## Install

```bash
pnpm add wall.js
# or: npm install wall.js / yarn add wall.js
```

```js
import { Wall } from 'wall.js'
// or
import Wall from 'wall.js'
```

Framework bindings:

- React → [REACT.md](./REACT.md) (`@wall.js/react`)
- Vue → [VUE.md](./VUE.md) (`@wall.js/vue`)
- Svelte → [SVELTE.md](./SVELTE.md) (`@wall.js/svelte`)

CDN (IIFE, global `Wall`):

```html
<script src="https://unpkg.com/wall.js@2/dist/wall.iife.js"></script>
<script>
  const wall = new Wall('#wall')
</script>
```

## Markup

```html
<div id="wall">
  <section>…</section>
  <section>…</section>
  <section>
    <div data-wall-slide>…</div>
    <div data-wall-slide>…</div>
  </section>
</div>
```

- **Sections**: direct children of the wrapper (usually `<section>`).
- **Slides**: elements with `data-wall-slide` inside a section (horizontal).
- **Section nav**: any element with `data-wall-section-nav`; its children become jump links (1-based order).
- **Slide arrows**: `data-wall-slide-arrow` (you style them; wall.js raises their z-index).
- **Lazy images**: `data-wall-origin` holds the real `src`; applied when the section/slide becomes active.
- **Per-element duration**: `data-wall-animate-duration` — seconds if `< 20`, otherwise milliseconds.

```html
<ul data-wall-section-nav>
  <li>One</li>
  <li>Two</li>
</ul>

<section>
  <img src="placeholder.png" data-wall-origin="real.png" alt="" />
</section>

<section data-wall-animate-duration="1.2">…</section>
```

## Constructor

```ts
new Wall(wrapper: string | HTMLElement, options?: WallOptions)
```

Throws if the wrapper is missing or has no element children.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `duration` | `number` | `700` | Animation duration in **ms** |
| `easing` | `string` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | CSS / WAAPI easing |
| `loop` | `boolean` | `false` | Enables both loop directions when the specific flags are omitted |
| `loopToBottom` | `boolean` | follows `loop` | From first section, `prev` → last |
| `loopToTop` | `boolean` | follows `loop` | From last section, `next` → first |
| `lockDocumentScroll` | `boolean` | `true` | Sets `overflow: hidden` on `html`/`body` (restored on `destroy`) |
| `currentClass` | `string` | `'current'` | Active section / slide class |
| `animatingClass` | `string` | `'animating'` | Class while transitioning |
| `sectionNavItemActiveClass` | `string` | `'active'` | Active class for nav children |
| `swipeThreshold` | `number` | `60` | Minimum swipe distance (px) |
| `wheelThreshold` | `number` | `20` | Minimum `\|deltaY\|` to change page |
| `wheelSkip` | `boolean` | `true` | Hard flicks multi-hop (still shows intermediates) |
| `wheelSkipUnit` | `number` | `320` | Accumulated px needed **per extra** section |
| `wheelSkipMax` | `number` | `3` | Max sections per wheel gesture |
| `wheelSkipWindow` | `number` | `90` | ms window to coalesce a flick |
| `skipDuration` | `number` | `260` | ms for intermediate hops in a chain |
| `swipeSkip` | `boolean` | `true` | Long vertical swipes multi-hop |
| `swipeSkipUnit` | `number` | `280` | Swipe px needed per extra section |
| `swipeSkipMax` | `number` | `3` | Max sections per swipe |
| `keyboard` | `boolean` | `true` | Arrow / Page / Home / End keys |
| `wheel` | `boolean` | `true` | Wheel / trackpad |
| `touch` | `boolean` | `true` | Pointer swipe |
| `wrapperZIndex` | `number` | `1` | Wrapper `z-index` |

## Instance

### Navigation

| Method | Description |
| --- | --- |
| `next()` / `nextSection()` | Next section |
| `prev()` / `prevSection()` | Previous section |
| `goTo(index)` | Jump to **0-based** section index |
| `goToSection(n)` | Jump to **1-based** section index (v1 compatible) |
| `nextSlide()` | Next horizontal slide in current section |
| `prevSlide()` | Previous horizontal slide |
| `goToSlide(index)` | **0-based** slide index in current section |
| `stepBy(delta)` | Jump `delta` sections (e.g. `+3` / `-2`); used by multi-skip |
| `destroy()` | Remove listeners, restore styles, emit `destroy` |

All navigation methods return `Promise<void>` and no-op while animating.

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `currentIndex` | `number` | 0-based section index |
| `sectionIndex` | `number` | 1-based section index |
| `currentSlideIndex` | `number` | 0-based slide index |
| `sectionCount` | `number` | Number of sections |
| `isAnimating` | `boolean` | Transition in progress |
| `wrapper` | `HTMLElement` | Root element |
| `options` | `ResolvedWallOptions` | Resolved options (readonly snapshot) |

### Events

```ts
const off = wall.on('change', ({ from, to, direction }) => {
  // direction: 'up' | 'down'
})

wall.on('slideChange', ({ section, from, to, direction }) => {
  // direction: 'left' | 'right'
})

wall.on('destroy', () => {})

off() // or wall.off('change', handler)
```

| Event | Payload |
| --- | --- |
| `change` | `{ from, to, direction }` — section change after animation |
| `slideChange` | `{ section, from, to, direction }` |
| `destroy` | `undefined` |

## Recipes (app layer — not core)

URL hash, analytics, title updates, etc. belong in your app. Use events:

### Sync section ↔ `location.hash`

```ts
import { Wall } from 'wall.js'

const wall = new Wall('#wall')
const hashes = ['top', 'features', 'api', 'slides', 'install']

// page → URL
wall.on('change', ({ to }) => {
  history.replaceState(null, '', `#${hashes[to]}`)
})

// URL → page (deep link + back/forward)
function applyHash() {
  const i = hashes.indexOf(location.hash.slice(1))
  if (i >= 0) void wall.goTo(i)
}
window.addEventListener('hashchange', applyHash)
applyHash()
```

Markup: give sections matching `id`s and link with `<a href="#api">`.

The experience site does the same via `apps/site/hash-sync.ts` (`bindSectionHash` + `bindHashLinks`).

### Analytics / document title

```ts
wall.on('change', ({ to }) => {
  document.title = `wall.js — ${hashes[to]}`
  // gtag('event', 'section_view', { section: hashes[to] })
})
```

## Behavior notes

1. **Nested scroll**: if the active section/slide can scroll, wall.js only changes page when the scroll position is at the top or bottom edge.
2. **Reduced motion**: when `prefers-reduced-motion: reduce`, duration is forced to `0`.
3. **Keyboard**: ignored while focus is in `input` / `textarea` / `select` / `contenteditable`.
4. **DOM order**: sections keep their original order; only transforms change (no array reverse / re-append).

## CSS hooks

```css
.wall-js { /* added on the wrapper */ }

section.current { /* active section */ }
section.animating { /* during transition */ }

[data-wall-slide].current { }
[data-wall-section-nav] > .active { }
```

Page height is typically:

```css
html, body, #wall { height: 100%; }
/* or 100dvh for mobile browser chrome */
```

## Migration from 0.x

| 0.x | 2.x |
| --- | --- |
| `sectionAnimateDuration: 1` (seconds) | `duration: 1000` (ms) |
| `easeFunction: 'easeIn'` | `easing: 'ease-in'` (CSS string) |
| Custom JS easing functions | Use CSS / WAAPI easing strings |
| No `destroy` | `destroy()` required for SPAs |
| `goToSection` 1-based | Still 1-based; prefer `goTo` (0-based) |
| Mutated `defaultOptions` | Options are copied; safe across instances |
| Webpack UMD `wall.min.js` | ESM / CJS / IIFE via `exports` |

See also [Migration](./MIGRATION.md).
