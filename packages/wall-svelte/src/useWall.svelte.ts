import { getContext } from 'svelte';
import { WALL_CONTEXT_KEY, type WallContextValue } from './context.js';

/** Access the nearest `<Wall>` context. Throws outside of a Wall tree. */
export function useWall(): WallContextValue {
  const ctx = getContext<WallContextValue | undefined>(WALL_CONTEXT_KEY);
  if (!ctx) {
    throw new Error('[ @wall.js/svelte ] useWall() must be used within <Wall>');
  }
  return ctx;
}

/** Soft variant — returns `null` outside of `<Wall>`. */
export function useWallOptional(): WallContextValue | null {
  return getContext<WallContextValue | undefined>(WALL_CONTEXT_KEY) ?? null;
}
