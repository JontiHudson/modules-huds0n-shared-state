import { useLayoutEffect, useRef, useState as useStateRN } from "react";

import Error from "@huds0n/error";

import { EventRegister } from "./EventRegister";
import { StateCache } from "./StateCache";
import type { Types } from "./types";

export class SharedState<S extends Types.State> {
  private _debugLabel: string | undefined;
  private _eventRegister: EventRegister<S>;
  private _stateCache: StateCache<S>;

  private _componentUnregister: symbol;
  private _componentUpdateId: symbol;

  constructor(defaultState: S, options: Types.Options = {}) {
    const { debugLabel } = options;

    this._debugLabel = debugLabel;

    this._stateCache = new StateCache(defaultState);
    this._eventRegister = new EventRegister(this._stateCache);

    this._componentUnregister = Symbol("shared_state_component_unregister");
    this._componentUpdateId = Symbol("shared_state_component_update_id");

    this.debugger(this);

    this.addListener = this.addListener.bind(this);
    this.debugger = this.debugger.bind(this);
    this.refresh = this.refresh.bind(this);
    this.register = this.register.bind(this);
    this.removeAllListeners = this.removeAllListeners.bind(this);
    this.reset = this.reset.bind(this);
    this.setProp = this.setProp.bind(this);
    this.setState = this.setState.bind(this);
    this.toString = this.toString.bind(this);
    this.unregister = this.unregister.bind(this);
    this.useProp = this.useProp.bind(this);
    this.useState = this.useState.bind(this);
  }

  get state() {
    return this._stateCache.current;
  }

  set state(object) {
    throw new Error({
      name: "State Error",
      code: "UPDATE_STATE_ERROR",
      message:
        "State cannot be mutated directly, use the setState() method instead.",
      severity: "MEDIUM",
    });
  }

  get prevState() {
    return this._stateCache.prev;
  }

  set prevState(object) {
    throw new Error({
      name: "State Error",
      code: "UPDATE_PREV_STATE_ERROR",
      message: "Prev state is read only.",
      severity: "MEDIUM",
    });
  }

  setState(partialState: Partial<S>) {
    try {
      const updatedState = this._stateCache.update(partialState);

      // Only send if a change has occured
      if (updatedState) {
        this._eventRegister.triggerUpdated(updatedState);
        this.debugger({ send: updatedState });
      }

      return updatedState;
    } catch (error) {
      throw Error.transform(error, {
        name: "State Error",
        code: "UPDATE_STATE_ERROR",
        message: "Update state error",
        severity: "HIGH",
      });
    }
  }

  setProp<K extends keyof S>(propName: K, newValue: S[K]) {
    // @ts-ignore
    this.setState({ [propName]: newValue });
  }

  refresh(refreshKey?: Types.UpdateKeys<S>) {
    try {
      this._eventRegister.triggerRefresh(refreshKey || true);
    } catch (error) {
      throw Error.transform(error, {
        name: "State Error",
        code: "REFRESH_STATE_ERROR",
        message: "Refresh state error",
        severity: "HIGH",
      });
    }
  }

  reset(resetData?: S) {
    try {
      const updatedState = this._stateCache.reset(resetData);

      if (updatedState) {
        this._eventRegister.triggerUpdated(updatedState);
      }

      this.debugger({
        resetState: this._stateCache.current,
      });
    } catch (error) {
      throw Error.transform(error, {
        name: "State Error",
        code: "RESET_STATE_ERROR",
        message: "Reset state error",
        severity: "HIGH",
      });
    }
  }

  // EVENT REGISTRATION

  addListener(
    callback: (current: S, prev: Partial<S>) => void,
    trigger?: Types.UpdateKeys<S>
  ) {
    return this._eventRegister.add(callback, trigger || true);
  }

  removeAllListeners() {
    this._eventRegister.removeAll();
  }

  // CLASS COMPONENT REGISTRATION

  register(component: React.Component, updateKeys?: Types.UpdateKeys<S>) {
    const removeListener = this.addListener(() => {
      component.setState({
        [this._componentUpdateId]: Symbol("shared_state_component_updater"),
      });
    }, updateKeys);

    // @ts-ignore
    component[this._componentUnregister] = removeListener;

    this.debugger({ register: { component, updateKeys } });
  }

  unregister(component: React.Component) {
    // @ts-ignore
    component[this._componentUnregister]?.();

    this.debugger({ unregister: { component } });
  }

  // FUNCTIONAL COMPONENT REGISTRATION

  useState(
    updateKeys?: Types.UpdateKeys<S>,
    shouldUpdate?: Types.ShouldUpdate<S>
  ): [S, Types.SetState<S>] {
    // Prevents updating unmounted component
    const isMounted = useRef(false);

    const [, setReRender] = useStateRN({});
    const reRenderComponent = () => {
      if (!shouldUpdate || shouldUpdate(this.state, this.prevState)) {
        // Required to stop React Warning: Cannot update a component from inside the function body of a different component
        setImmediate(() => {
          isMounted.current && setReRender({});
        });
      }
    };

    useLayoutEffect(() => {
      isMounted.current = true;

      const removeListener = this.addListener(reRenderComponent, updateKeys);

      this.debugger({ registerHook: { updateKeys } });

      return () => {
        removeListener();
      };
    }, []);

    const setValue = (partialState: Partial<S>) => {
      this.setState(partialState);
    };

    return [this.state, setValue];
  }

  useProp<K extends keyof S>(updateKey: K): [S[K], Types.SetProp<S, K>] {
    this.useState(updateKey);

    return [this.state[updateKey], (value) => this.setProp(updateKey, value)];
  }

  // DEBUGGING

  debugger(...log: any[]) {
    if (this._debugLabel) console.log(this._debugLabel, ...log);
  }

  toString() {
    return JSON.stringify(this.state, null, 2);
  }
}

export type { Types as SharedStateTypes } from "./types";
