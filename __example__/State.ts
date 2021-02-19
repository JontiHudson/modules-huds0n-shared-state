import { SharedState } from '@huds0n/shared-state';
import { createStoreRN } from '@huds0n/shared-state-store-rn';

type StateType = {
  sharedCounter: number;
};

export const SharedCounterState = new SharedState<StateType>({
  sharedCounter: 0,
});

SharedCounterState.initializeStorage(
  createStoreRN({ storeName: 'SharedCounterState', saveAutomatically: true }),
);
