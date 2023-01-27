import { deepClone } from './helpers';
import type { Types } from './types';

export class StateCache<S extends Types.State> {
  default: S;
  current: S;
  prev: Partial<S>;

  constructor(defaultState: S) {
    this.default = defaultState;
    this.current = deepClone(defaultState);
    this.prev = {};
  }

  update(partialState: Partial<S>) {
    const updatedState: Partial<S> = {};
    let updated = false;

    for (const key in partialState) {
      const newValue = partialState[key];

      if (newValue && this.updateProp(key, newValue)) {
        updatedState[key] = newValue;
        updated = true;
      }
    }

    return updated ? updatedState : undefined;
  }

  updateProp<Key extends keyof S>(key: Key, newValue: S[Key]) {
    const { [key]: currentValue } = this.current;

    if (currentValue === newValue) {
      return false;
    }

    this.prev[key] = currentValue;
    this.current[key] = newValue;

    return true;
  }

  reset(resetData: S = deepClone(this.default)) {
    const updatedState: Partial<S> = {};
    let updated = false;

    for (const key in this.current) {
      if (this.updateProp(key, resetData[key])) {
        updatedState[key] = resetData[key];
        updated = true;
      }
    }

    this.current = { ...resetData };

    return updated ? updatedState : undefined;
  }
}
