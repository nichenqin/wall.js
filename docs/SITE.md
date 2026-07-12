# Site (experience demo)

The marketing site under `apps/site` **is itself a wall.js instance**, built with **Astro**. Scrolling the homepage exercises the core library.

## Develop

From the monorepo root:

```bash
pnpm install
pnpm dev
# → http://localhost:5173  (turbo → @wall.js/site → astro dev)
```

Dev resolves `wall.js` to `packages/wall/src` for HMR (see `astro.config.mjs`).

## Build

```bash
pnpm build:site
# → apps/site/site-dist/
```

Turbo builds `packages/wall` first (`dependsOn: ["^build"]`), then Astro.

## Structure

```
apps/site/
  astro.config.mjs
  public/                 # favicon, logos
  src/
    pages/index.astro     # fullpage markup + Astro <Code> blocks
    scripts/client.ts     # new Wall('#wall') + chrome
    scripts/hash-sync.ts  # app-layer hash ↔ section
    styles/global.css
```

## Interactive bits

- Section `id`s + **hash sync** (`hash-sync.ts`)
- Top nav `<a href="#…">` via `bindHashLinks`
- `[data-wall-section-nav]` dots
- Horizontal `data-wall-slide` section
- Progress bar + active nav from `wall.on('change')`
- Syntax highlighting via Astro `<Code>` (build-time Shiki)

Hash binding is **not** in wall.js core — see [API recipes](./API.md#recipes-app-layer--not-core).
