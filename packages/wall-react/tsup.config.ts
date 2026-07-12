import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'es2020',
  treeshake: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', 'wall.js'],
  esbuildOptions(options) {
    options.banner = {
      js: '/* @wall.js/react — https://github.com/nichenqin/wall.js */',
    };
  },
});
