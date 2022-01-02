import { toArray } from './helpers';
import { RegisterKey, State, UpdateFunction, UpdateKeys } from './types';

export class ComponentRegister<S extends State> {
  map: Map<RegisterKey, UpdateFunction<S>>;

  constructor() {
    this.map = new Map<RegisterKey, UpdateFunction<S>>();
  }

  register(
    registerKey: RegisterKey,
    updateKeys: UpdateKeys<S> | undefined,
    reRenderComponent: () => void,
  ) {
    const updateKeysArray = toArray(updateKeys);

    const onUpdate: UpdateFunction<S> = (updatedState, refresh) => {
      if (
        updateKeys === undefined ||
        (updatedState &&
          Object.keys(updatedState).some((key) =>
            updateKeysArray.includes(key),
          )) ||
        (refresh &&
          (refresh === true ||
            toArray(refresh).some((key) => updateKeysArray.includes(key))))
      ) {
        reRenderComponent();
      }
    };

    this.map.set(registerKey, onUpdate);
  }

  refresh(refreshKeys?: keyof S | (keyof S)[]) {
    this.map.forEach((onUpdate) => onUpdate(undefined, refreshKeys || true));
  }

  update(updatedState: Partial<S>) {
    this.map.forEach((onUpdate) => onUpdate(updatedState));
  }

  unregister(registerKey: RegisterKey) {
    this.map.delete(registerKey);
  }
}
