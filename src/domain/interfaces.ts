import type { StoreRawState } from "./schemaTypes"

export interface StateRepository {
    giveState (state: StoreRawState): void
}

export interface StoreEvents {
  'noItem': () => void;
}