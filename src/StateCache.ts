import { deepClone } from './helpers';
import { State } from './types';

export class StateCache<S extends State> {
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
      // @ts-ignore
      if (this.updateProp(key, partialState[key])) {
        updatedState[key] = partialState[key];
        updated = true;
      }
    }

    return updated ? updatedState : null;
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
      // @ts-ignore
      if (this.updateProp(key, resetData[key])) {
        updatedState[key] = resetData[key];
        updated = true;
      }
    }

    this.current = { ...resetData };

    return updated ? updatedState : null;
  }
}
