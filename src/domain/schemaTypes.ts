import * as z from "zod";
import type { FileJsonItemSchema, FileJsonSchema, FileMainContentItemSchema, FileMainContentItemsSchema, FSRSCardSchema, FSRSParametersSchema, FSRSStepsSchema, FSRSStepUnitSchema, FSRSTimeUnitSchema, ItemIdSchema, ItemSchema, StoreRawStateSchema } from './schema';

export type FSRSTimeUnit = z.infer<typeof FSRSTimeUnitSchema>
export type FSRSStepUnit = z.infer<typeof FSRSStepUnitSchema>
export type FSRSSteps = z.infer<typeof FSRSStepsSchema>
export type FSRSCard = z.infer<typeof FSRSCardSchema>
export type FSRSParameters = z.infer<typeof FSRSParametersSchema>
export type ItemId = z.infer<typeof ItemIdSchema>
export type FileMainContentItems = z.infer<typeof FileMainContentItemsSchema>
export type FileMainContentItem = z.infer<typeof FileMainContentItemSchema>
export type FileJsonItem = z.infer<typeof FileJsonItemSchema>
export type FileJson = z.infer<typeof FileJsonSchema>
export type Item = z.infer<typeof ItemSchema>
export type StoreRawState = z.infer<typeof StoreRawStateSchema>
