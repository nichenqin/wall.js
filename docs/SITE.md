# Site (experience demo)

The marketing site under `apps/site` **is itself a wall.js instance**. Scrolling the homepage exercises the core library. It is **vanilla** (Vite + TS) — not the React port.

## Develop

From the monorepo root:

```bash
pnpm install
pnpm dev
# → http://localhost:5173  (turbo → @wall.js/site)
```

Dev resolves `wall.js` to `packages/wall/src` for HMR.

## Build

```bash
pnpm build:site
# → apps/site/site-dist/
```

Turbo builds `packages/wall` first (`dependsOn: ["^build"]`), then the site.

## Structure

```
apps/site/
  index.html
  styles.css
  main.ts          # new Wall('#wall') + chrome
  hash-sync.ts     # app-layer hash ↔ section (not core)
  vite.config.ts
```

## Interactive bits

- Section `id`s + **hash sync** (`hash-sync.ts`) — scroll updates `#features`; open `/#api` deep-links
- Top nav `<a href="#…">` intercepted by `bindHashLinks`
- `[data-wall-section-nav]` — right-side dots
- Slide section with `data-wall-slide` + arrow controls
- Progress bar driven by `wall.on('change')`

Hash binding is intentionally **not** in wall.js core — see [API recipes](./API.md#recipes-app-layer--not-core).
