import type { WallEventHandler, WallEventMap, WallEventName } from './types';

export class Emitter {
  private listeners = new Map<WallEventName, Set<WallEventHandler<WallEventName>>>();

  on<E extends WallEventName>(event: E, handler: WallEventHandler<E>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(handler as WallEventHandler<WallEventName>);
    return () => this.off(event, handler);
  }

  off<E extends WallEventName>(event: E, handler: WallEventHandler<E>): void {
    this.listeners.get(event)?.delete(handler as WallEventHandler<WallEventName>);
  }

  emit<E extends WallEventName>(event: E, payload: WallEventMap[E]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const handler of set) {
      (handler as WallEventHandler<E>)(payload);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}
