import type { Component } from 'svelte';
import type { Direction, WallOptions } from 'wall.js';

export type WallContextValue = {
  get wall(): import('wall.js').Wall | null;
  get index(): number;
  get slideIndex(): number;
};

export declare const Wall: Component<
  WallOptions & {
    remountKey?: string | number;
    class?: string;
    style?: string;
    onchange?: (payload: {
      from: number;
      to: number;
      direction: Direction;
    }) => void;
    onslidechange?: (payload: {
      section: number;
      from: number;
      to: number;
      direction: Direction;
    }) => void;
    ondestroy?: () => void;
  }
>;

export declare const WallSection: Component<{
  animateDuration?: number | string;
  class?: string;
}>;

export declare const WallSlide: Component<{
  animateDuration?: number | string;
  class?: string;
}>;

export declare function useWall(): WallContextValue;
export declare function useWallOptional(): WallContextValue | null;

export type { Direction, WallOptions };
