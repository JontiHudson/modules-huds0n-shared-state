import {
  useMemo,
  useLayoutEffect,
  useRef,
  useState as useStateRN,
} from 'react';

import Error from '@huds0n/error';

import { ComponentRegister } from './ComponentRegister';
import { EventRegister } from './EventRegister';
import { StateCache } from './StateCache';
import * as Types from './types';

export namespace SharedState {
  export type CreateStateStoreFunction<
    S extends State
  > = Types.CreateStateStoreFunction<S>;
  export type Options = Types.Options;
  export type ListenerRemoveFn = Types.ListenerRemoveFn;

  export type SetStateFn<S extends State> = Types.SetStateFn<S>;
  export type SetPropFn<S extends State, K extends keyof S> = Types.SetPropFn<
    S,
    K
  >;

  export type State = Types.State;
  export type UpdateKeys<S extends State> = Types.UpdateKeys<S>;
  export type UpdateTesterFn<S extends State> = Types.UpdateTesterFn<S>;
}

export class SharedState<S extends SharedState.State> {
  private _debugLabel: string | undefined;
  private _componentRegister: ComponentRegister<S>;
  private _eventRegister: EventRegister<S> | undefined;
  private _stateCache: StateCache<S> | undefined;
  private _stateStore: Types.StateStore<S> | undefined;
  private _isInitialized = false;

  constructor(
    defaultState: S | null = null,
    options: SharedState.Options = {},
  ) {
    const { debugLabel } = options;

    this._debugLabel = debugLabel;
    this._componentRegister = new ComponentRegister();

    if (defaultState) {
      this.initialize(defaultState);
    }

    this.debugger(this);

    this.addListener = this.addListener.bind(this);
    this.debugger = this.debugger.bind(this);
    this.initialize = this.initialize.bind(this);
    this.initializeOnMount = this.initializeOnMount.bind(this);
    this.initializeStorage = this.initializeStorage.bind(this);
    this.refresh = this.refresh.bind(this);
    this.register = this.register.bind(this);
    this.removeAllListeners = this.removeAllListeners.bind(this);
    this.reset = this.reset.bind(this);
    this.save = this.save.bind(this);
    this.setProp = this.setProp.bind(this);
    this.setState = this.setState.bind(this);
    this.toString = this.toString.bind(this);
    this.unregister = this.unregister.bind(this);
    this.useProp = this.useProp.bind(this);
    this.useState = this.useState.bind(this);
  }

  private throwUninitialized(): never {
    throw new Error({
      name: 'State Error',
      code: 'UNINITIALIZED_STATE_ERROR',
      message: 'State has not been initialized.',
      severity: 'MEDIUM',
    });
  }

  get isInitialized() {
    return this._isInitialized;
  }

  get state() {
    return (this._stateCache || this.throwUninitialized()).current;
  }

  set state(object) {
    throw new Error({
      name: 'State Error',
      code: 'UPDATE_STATE_ERROR',
      message:
        'State cannot be mutated directly, use the setState() method instead.',
      severity: 'MEDIUM',
    });
  }

  get prevState() {
    return (this._stateCache || this.throwUninitialized()).prev;
  }

  set prevState(object) {
    throw new Error({
      name: 'State Error',
      code: 'UPDATE_PREV_STATE_ERROR',
      message: 'Prev state is read only.',
      severity: 'MEDIUM',
    });
  }

  initialize(initialState: S) {
    if (!this._isInitialized) {
      this._stateCache = new StateCache(initialState);
      this._eventRegister = new EventRegister(this._stateCache);

      this._componentRegister.update(true);

      this._isInitialized = true;
    } else {
      this.reset(initialState);
    }
  }

  setState(partialState: Partial<S>) {
    try {
      const updatedState = (
        this._stateCache || this.throwUninitialized()
      ).update(partialState);

      // Only send if a change has occured
      if (updatedState) {
        this._componentRegister.update(updatedState);
        (this._eventRegister || this.throwUninitialized()).run(updatedState);
        this.debugger({ send: updatedState });

        if (this._stateStore?.saveAutomatically) {
          this.save();
        }
      }

      return updatedState;
    } catch (error) {
      throw Error.transform(error, {
        name: 'State Error',
        code: 'UPDATE_STATE_ERROR',
        message: 'Update state error',
        severity: 'HIGH',
      });
    }
  }

  setProp<K extends keyof S>(propName: K, newValue: S[K]) {
    // @ts-ignore
    this.setState({ [propName]: newValue });
  }

  refresh() {
    try {
      this._componentRegister.update(true);
    } catch (error) {
      throw Error.transform(error, {
        name: 'State Error',
        code: 'REFRESH_STATE_ERROR',
        message: 'Refresh state error',
        severity: 'HIGH',
      });
    }
  }

  reset(resetData?: S) {
    try {
      const updatedState = (
        this._stateCache || this.throwUninitialized()
      ).reset(resetData);

      if (updatedState) {
        this._componentRegister.update(updatedState);
        (this._eventRegister || this.throwUninitialized()).run(updatedState);
      }

      if (this._stateStore) {
        resetData ? this._stateStore.save() : this._stateStore.delete();
      }

      this.debugger({
        resetState: (this._stateCache || this.throwUninitialized()).current,
      });
    } catch (error) {
      throw Error.transform(error, {
        name: 'State Error',
        code: 'RESET_STATE_ERROR',
        message: 'Reset state error',
        severity: 'HIGH',
      });
    }
  }

  // EVENT REGISTRATION

  addListener(
    trigger: keyof S | (keyof S)[],
    callback: (current: S, prev: Partial<S>) => void,
  ) {
    return (this._eventRegister || this.throwUninitialized()).add(
      trigger,
      callback,
    );
  }

  removeAllListeners() {
    (this._eventRegister || this.throwUninitialized()).removeAll();
  }

  // CLASS COMPONENT REGISTRATION

  register(component: React.Component, updateKeys?: SharedState.UpdateKeys<S>) {
    const sharedStateId = Symbol('shared_state_id');

    function reRenderComponent() {
      component.setState({ [sharedStateId]: Symbol('shared_state_updater') });
    }

    this._componentRegister.register(component, updateKeys, reRenderComponent);

    this.debugger({ register: { component, updateKeys } });
  }

  unregister(component: React.Component) {
    this._componentRegister.unregister(component);

    this.debugger({ unregister: { component } });
  }

  // FUNCTIONAL COMPONENT REGISTRATION

  useState(
    updateKey?: SharedState.UpdateKeys<S>,
    shouldUpdate?: SharedState.UpdateTesterFn<S>,
  ): [S, SharedState.SetStateFn<S>] {
    const componentId = Symbol('hook_id');

    const [, setReRender] = useStateRN({});
    const reRenderComponent = () => {
      if (!shouldUpdate || shouldUpdate(this.state, this.prevState)) {
        setReRender({});
      }
    };

    useLayoutEffect(() => {
      this._componentRegister.register(
        componentId,
        updateKey,
        reRenderComponent,
      );
      this.debugger({ registerHook: { componentId, updateKey } });

      return () => {
        this._componentRegister.unregister(componentId);
        this.debugger({ unregisterHook: { componentId } });
      };
    }, []);

    const setValue = (partialState: Partial<S>) => {
      this.setState(partialState);
    };

    return [this.state, setValue];
  }

  useProp<K extends keyof S>(
    updateKey: K,
  ): [S[K], SharedState.SetPropFn<S, K>] {
    this.useState(updateKey);

    return [
      this.state[updateKey],
      (value, callback) => this.setProp(updateKey, value),
    ];
  }

  initializeOnMount(
    initialState: S | (() => S),
    updateKey?: SharedState.UpdateKeys<S>,
  ) {
    const uninitialized = useRef(true);

    const _initialState =
      typeof initialState === 'function'
        ? useMemo(initialState as () => S, [])
        : initialState;

    if (uninitialized.current) {
      this.initialize(_initialState);
      uninitialized.current = false;
    }

    return this.useState(updateKey);
  }

  // STORAGE PERSIST
  async initializeStorage(
    createStore: SharedState.CreateStateStoreFunction<S>,
  ) {
    this._stateStore = this._stateStore || createStore(() => this.state);

    try {
      const retrievedState = await this._stateStore.retrieve();

      if (!retrievedState) {
        return false;
      }
      this.initialize(retrievedState);
      return true;
    } catch (error) {
      const storageError = Error.transform(error, {
        name: 'State Error',
        code: 'STORAGE_ERROR',
        message: 'Error loading from storage',
        severity: 'HIGH',
      });

      this._isInitialized && this.reset();
      storageError.handle();
      return false;
    }
  }

  save() {
    if (this._stateStore) {
      this.debugger(`Storing ${this._stateStore.storeName}`);

      return this._stateStore.save();
    }
    return Promise.resolve(false);
  }

  // DEBUGGING

  debugger(...log: any[]) {
    if (this._debugLabel) console.log(this._debugLabel, ...log);
  }

  toString() {
    return JSON.stringify(this.state, null, 2);
  }
}
