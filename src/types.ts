export declare namespace Types {
  export type State = Record<string, any>;
  export type Options = { debugLabel?: string };

  export type UpdateKeys<S extends State> = keyof S | (keyof S)[];
  export type OnUpdate<S extends State> = (
    current: S,
    prev: Partial<S>,
  ) => void;
  export type ListenerRemove = () => boolean;

  export type ShouldUpdate<S extends State> = (
    newState: S,
    prevState: Partial<S>,
  ) => boolean;
  export type SetState<S extends State> = (partialState: Partial<S>) => void;
  export type SetProp<S extends State, K extends keyof S> = (
    value: S[K],
  ) => void;
}
