export type State = Record<string, any>;
export type Options = { debugLabel?: string };

export type UpdateKeys<S extends State> = keyof S | (keyof S)[];
export type UpdateEvent<S extends State> = (
  current: S,
  prev: Partial<S>,
) => void;
export type ListenerRemoveFn = () => boolean;

export type UpdateTesterFn<S extends State> = (
  newState: S,
  prevState: Partial<S>,
) => boolean;
export type SetStateFn<S extends State> = (partialState: Partial<S>) => void;
export type SetPropFn<S extends State, K extends keyof S> = (
  value: S[K],
) => void;

export type CreateStateStoreFunction<S> = (getState: () => S) => StateStore<S>;

export interface StateStore<S extends State> {
  readonly storeName: string;
  readonly saveAutomatically: boolean;

  delete(): Promise<boolean>;
  retrieve(): Promise<S | null>;
  save(): Promise<boolean>;
}

export type RegisterKey = React.Component | Symbol;
export type UpdateFunction<S extends State> = (
  updateProps?: Partial<S>,
  rerender?: keyof S | (keyof S)[] | true,
) => void;
