import type { Wall as WallCore } from 'wall.js';

export const WALL_CONTEXT_KEY = 'wall.js';

export type WallContextValue = {
  /** Reactive getters — read inside components via context. */
  get wall(): WallCore | null;
  get index(): number;
  get slideIndex(): number;
};
