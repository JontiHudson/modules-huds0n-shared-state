import { toArray } from './helpers';
import { StateCache } from './StateCache';
import type { Types } from './types';

export class EventRegister<S extends Types.State> {
  private stateCache: StateCache<S>;
  private subscribedEvents: Map<
    (keyof S)[] | symbol,
    (current: S, prev: Partial<S>) => void
  >;

  constructor(stateCache: StateCache<S>) {
    this.stateCache = stateCache;
    this.subscribedEvents = new Map();
  }

  add(
    callback: (current: S, prev: Partial<S>) => void,
    trigger: Types.UpdateKeys<S> | true,
  ) {
    const key = trigger === true ? Symbol('UPDATE_ALL') : toArray(trigger);
    this.subscribedEvents.set(key, callback);

    return () => this.subscribedEvents.delete(key);
  }

  triggerUpdated(updatedState?: Partial<S>) {
    this.subscribedEvents.forEach((callback, trigger) => {
      if (
        updatedState &&
        (typeof trigger === 'symbol' ||
          Object.keys(updatedState).some((key) => trigger.includes(key)))
      ) {
        callback(this.stateCache.current, this.stateCache.prev);
      }
    });
  }

  triggerRefresh(refreshKey?: keyof S | (keyof S)[] | true) {
    this.subscribedEvents.forEach((callback, trigger) => {
      if (
        refreshKey === true ||
        typeof trigger === 'symbol' ||
        toArray(refreshKey).some((key) => trigger.includes(key))
      ) {
        callback(this.stateCache.current, this.stateCache.current);
      }
    });
  }

  removeAll() {
    this.subscribedEvents.clear();
  }
}
