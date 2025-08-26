import type { StoreRawState } from "../domain/schemaTypes";

export interface DataSource {
    giveData (data: string): void
    giveState (storeRawState: StoreRawState): void
}

export interface DataSourceEvents {
    'state': (state: StoreRawState) => void
    'data': (data: string) => void
}