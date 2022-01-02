import { toArray } from './helpers';
import { StateCache } from './StateCache';
import { State } from './types';

export class EventRegister<S extends State> {
  private stateCache: StateCache<S>;
  private subscribedEvents: Map<
    (keyof S)[],
    (current: S, prev: Partial<S>) => void
  >;

  constructor(stateCache: StateCache<S>) {
    this.stateCache = stateCache;
    this.subscribedEvents = new Map();
  }

  add(
    trigger: keyof S | (keyof S)[],
    callback: (current: S, prev: Partial<S>) => void,
  ) {
    const triggerArray = toArray(trigger);
    this.subscribedEvents.set(triggerArray, callback);

    return () => this.subscribedEvents.delete(triggerArray);
  }

  run(updatedState?: Partial<S>, refreshKey?: keyof S | (keyof S)[] | true) {
    this.subscribedEvents.forEach((callback, trigger) => {
      // @ts-ignore
      if (
        updatedState &&
        Object.keys(updatedState).some((key) => trigger.includes(key))
      ) {
        callback(this.stateCache.current, this.stateCache.prev);
      }

      if (
        refreshKey === true ||
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
