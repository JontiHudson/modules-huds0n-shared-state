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

    function onUpdate(updatedState: Partial<S> | true) {
      if (
        updatedState === true ||
        updateKeys === undefined ||
        Object.keys(updatedState).some((key) => updateKeysArray.includes(key))
      ) {
        reRenderComponent();
      }
    }

    this.map.set(registerKey, onUpdate);
  }

  update(updatedState: Partial<S> | true) {
    this.map.forEach((onUpdate) => onUpdate(updatedState));
  }

  unregister(registerKey: RegisterKey) {
    this.map.delete(registerKey);
  }
}
