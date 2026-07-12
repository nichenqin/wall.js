import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: '.',
  publicDir: r('./public'),
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: r('./site-dist'),
    emptyOutDir: true,
  },
  // During dev, resolve to source for HMR; production uses built package.
  resolve: {
    alias: {
      'wall.js': r('../../packages/wall/src/index.ts'),
    },
  },
});
