import type { WallOptions } from 'wall.js';

export type WallOptionProps = WallOptions & {
  remountKey?: string | number;
};

const OPTION_KEYS: (keyof WallOptions)[] = [
  'duration',
  'easing',
  'loop',
  'loopToBottom',
  'loopToTop',
  'lockDocumentScroll',
  'currentClass',
  'animatingClass',
  'sectionNavItemActiveClass',
  'swipeThreshold',
  'keyboard',
  'wheel',
  'touch',
  'wrapperZIndex',
  'wheelThreshold',
  'wheelSkip',
  'wheelSkipUnit',
  'wheelSkipMax',
  'wheelSkipWindow',
  'skipDuration',
  'swipeSkip',
  'swipeSkipUnit',
  'swipeSkipMax',
];

export function pickWallOptions(props: WallOptionProps): WallOptions {
  const out: WallOptions = {};
  for (const key of OPTION_KEYS) {
    const value = props[key];
    if (value !== undefined) {
      // @ts-expect-error dynamic assign
      out[key] = value;
    }
  }
  return out;
}

export function optionsFingerprint(props: WallOptionProps): string {
  return JSON.stringify(pickWallOptions(props));
}
