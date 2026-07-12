# Migrating from wall.js 0.x → 2.x

## Breaking changes

1. **Duration unit**: options use **milliseconds**.  
   `sectionAnimateDuration: 1` → `duration: 1000`.

2. **Easing**: string CSS easings only (or any string WAAPI accepts).  
   Named JS helpers (`easeIn`, `easeOut`, …) are removed.

3. **Package entry**:  
   - ESM: `import Wall from 'wall.js'`  
   - CJS: `require('wall.js')`  
   - CDN: `dist/wall.iife.js` (global `Wall`)

4. **Document scroll**: still locked by default (`lockDocumentScroll: true`), but fully restored on `destroy()`.

5. **Node**: requires modern browsers / ES2020. IE and legacy vendor prefixes are not supported.

## Compatible APIs

These still work:

- `new Wall('#wall', options)`
- `prevSection()` / `nextSection()` / `goToSection(n)` (1-based)
- `prevSlide()` / `nextSlide()`
- `data-wall-slide`, `data-wall-section-nav`, `data-wall-slide-arrow`, `data-wall-origin`, `data-wall-animate-duration`
- `current` / `animating` / nav `active` classes (configurable)

## Recommended 2.x pattern

```js
import Wall from 'wall.js'

const wall = new Wall('#wall', {
  duration: 700,
  easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
})

wall.on('change', ({ to }) => {
  history.replaceState(null, '', `#s${to + 1}`)
})

// later, in SPA route leave:
wall.destroy()
```

## Internal rewrite (why things feel different)

| 0.x | 2.x |
| --- | --- |
| Reorder section array + z-index stack | Stable DOM + index state |
| `requestAnimationFrame` + JS easing | Web Animations API (+ CSS fallback) |
| `mousewheel` / `keyCode` | `wheel` / `KeyboardEvent.key` / Pointer Events |
| No teardown | `AbortController` + `destroy()` |
| Babel 6 + Webpack 3 | TypeScript + tsup |
