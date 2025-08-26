import { CURRENT_FILE_STRUCTURE_VERSION } from "./constants"
import type { StoreRawState } from "./schemaTypes"
import { generatorParameters } from 'ts-fsrs'

export const getDefaultState = (): StoreRawState => {
    return {
        version: CURRENT_FILE_STRUCTURE_VERSION,
        mainContentItemsOrder: [],
        items: [],
        fsrsParams: generatorParameters(),
    }
}