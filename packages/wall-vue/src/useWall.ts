import { inject } from 'vue';
import { wallKey, type WallContextValue } from './context';

/** Access the nearest `<Wall>` context. Throws outside of a Wall tree. */
export function useWall(): WallContextValue {
  const ctx = inject(wallKey);
  if (!ctx) {
    throw new Error('[ @wall.js/vue ] useWall() must be used within <Wall>');
  }
  return ctx;
}

/** Soft variant — returns `null` outside of `<Wall>`. */
export function useWallOptional(): WallContextValue | null {
  return inject(wallKey, null);
}
