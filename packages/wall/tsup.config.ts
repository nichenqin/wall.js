import { defineConfig } from 'tsup';

const banner = {
  js: '/* wall.js v2 — https://github.com/nichenqin/wall.js */',
};

export default defineConfig([
  {
    entry: { wall: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    target: 'es2020',
    treeshake: true,
    cjsInterop: true,
    outExtension({ format }) {
      return { js: format === 'cjs' ? '.cjs' : '.js' };
    },
    esbuildOptions(options) {
      options.banner = banner;
    },
  },
  {
    entry: { 'wall.iife': 'src/cdn.ts' },
    format: ['iife'],
    globalName: 'Wall',
    sourcemap: true,
    clean: false,
    minify: true,
    target: 'es2020',
    treeshake: true,
    outExtension() {
      return { js: '.js' };
    },
    esbuildOptions(options) {
      options.banner = banner;
    },
  },
]);
