import EventEmitter from 'eventemitter3';
import type { StateRepository } from '../domain/interfaces';
import type { StoreRawState } from "../domain/schemaTypes";
import type { DataSource } from './interfaces';

export class StateRepositoryImpl extends EventEmitter implements StateRepository {
    dataSource: DataSource
    constructor (dataSource: DataSource) {
        super()
        this.dataSource = dataSource
        this.dataSource
    }
    giveState (state: StoreRawState) {
        this.dataSource.giveState(state)
    }
}
