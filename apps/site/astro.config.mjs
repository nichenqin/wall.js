import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const wallSrc = fileURLToPath(
  new URL('../../packages/wall/src/index.ts', import.meta.url),
);

// https://astro.build/config
export default defineConfig({
  outDir: './site-dist',
  publicDir: './public',
  server: {
    port: 5173,
  },
  vite: {
    resolve: {
      alias: {
        // HMR against monorepo source during site dev
        'wall.js': wallSrc,
      },
    },
  },
});
