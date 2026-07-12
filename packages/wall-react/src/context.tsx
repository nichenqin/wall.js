import { createContext, useContext } from 'react';
import type { Wall as WallCore } from 'wall.js';

export type WallContextValue = {
  /** Imperative wall.js instance (null before mount / after unmount). */
  wall: WallCore | null;
  /** Bumps when the active section index changes. */
  index: number;
  /** Bumps when the active slide index changes. */
  slideIndex: number;
};

export const WallContext = createContext<WallContextValue | null>(null);

/**
 * Access the nearest `<Wall />` instance and indices.
 * Must be called under a `<Wall>` tree.
 */
export function useWall(): WallContextValue {
  const ctx = useContext(WallContext);
  if (!ctx) {
    throw new Error('[ @wall.js/react ] useWall() must be used within <Wall>');
  }
  return ctx;
}

/**
 * Soft variant — returns `null` outside of `<Wall>` instead of throwing.
 */
export function useWallOptional(): WallContextValue | null {
  return useContext(WallContext);
}
