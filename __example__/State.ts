import { SharedState } from "@huds0n/shared-state";
import { SharedStateStore } from "@huds0n/shared-state-store-rn";

type StateType = {
  sharedCounter: number;
};

export const SharedCounterState = new SharedState<StateType>({
  sharedCounter: 0,
});

new SharedStateStore(SharedCounterState, {
  storeName: "SharedCounterState",
  saveAutomatically: true,
});
