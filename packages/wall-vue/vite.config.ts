import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: r('./src/index.ts'),
      name: 'WallVue',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'wall-vue.js' : 'wall-vue.cjs'),
    },
    rollupOptions: {
      external: ['vue', 'wall.js'],
      output: {
        globals: {
          vue: 'Vue',
          'wall.js': 'Wall',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
