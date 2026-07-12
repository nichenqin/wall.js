export { Wall } from './wall';
export type {
  Direction,
  ResolvedWallOptions,
  WallEventHandler,
  WallEventMap,
  WallEventName,
  WallOptions,
} from './types';

import { Wall as WallClass } from './wall';

/** Default export for `import Wall from 'wall.js'`. */
export default WallClass;
