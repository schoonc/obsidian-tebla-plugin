import { State as FsrsState } from 'ts-fsrs';
import * as z from "zod";
import { CURRENT_FILE_STRUCTURE_VERSION, OLDER_FILE_STRUCTURE_VERSIONS } from './constants';

export const FSRSTimeUnitSchema = z.union([z.literal('m'), z.literal('h'), z.literal('d')])

export const FSRSStepUnitSchema = z.templateLiteral([ z.number(), FSRSTimeUnitSchema]);

export const FSRSStepsSchema = z.union([z.array(FSRSStepUnitSchema), z.array(FSRSStepUnitSchema).readonly()])

/* See Card type from 'ts-fsrs' */
export const FSRSCardSchema = z.object({
	due: z.date(),
	stability: z.number(),
	difficulty: z.number(),
	elapsed_days: z.number(),
	scheduled_days: z.number(),
	learning_steps: z.number(),
	reps: z.number(),
	lapses: z.number(),
	state: z.enum(FsrsState),
	last_review: z.optional(z.date()),
})

/* See FSRSParameters type from 'ts-fsrs' */
export const FSRSParametersSchema = z.object({
	request_retention: z.number(),
	maximum_interval: z.number(),
	w: z.union([z.array(z.number()), z.array(z.number()).readonly()]),
	enable_fuzz: z.boolean(),
	enable_short_term: z.boolean(),
	learning_steps: FSRSStepsSchema,
	relearning_steps: FSRSStepsSchema,
})

export const ItemIdSchema = z.uuidv4()

export const FileMainContentItemSchema = z.object({
	itemId: ItemIdSchema,
	question: z.string(),
	answer: z.string(),
})

export const FileMainContentItemsSchema = z.array(FileMainContentItemSchema)

export const FileJsonItemSchema = z.object({
	itemId: ItemIdSchema,
	card: FSRSCardSchema,
})
export const FileJsonSchema = z.object({
	version: z.union([z.literal(CURRENT_FILE_STRUCTURE_VERSION), ...OLDER_FILE_STRUCTURE_VERSIONS.map(v=>z.literal(v))]),
    items: z.array(FileJsonItemSchema),
    fsrsParams: FSRSParametersSchema,
})

export const ItemSchema = z.object({
	itemId: ItemIdSchema,
	question: z.string(),
	answer: z.string(),
	card: FSRSCardSchema,
})

export const StoreRawStateSchema = z.object({
    version: z.union([z.literal(CURRENT_FILE_STRUCTURE_VERSION), ...OLDER_FILE_STRUCTURE_VERSIONS.map(v=>z.literal(v))]),
    mainContentItemsOrder: z.array(ItemIdSchema),
    items: z.array(ItemSchema),
    fsrsParams: FSRSParametersSchema,
});