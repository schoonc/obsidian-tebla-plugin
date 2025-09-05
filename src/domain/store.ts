import autoBind from 'auto-bind';
import EventEmitter from 'eventemitter3';
import { createEmptyCard, fsrs, FSRS, generatorParameters, type Grade } from 'ts-fsrs';
import { v4 as uuidv4 } from 'uuid';
import { type Reactive, reactive, shallowReactive, toRaw, watch } from 'vue';
import type { StateRepository, StoreEvents } from './interfaces';
import type { StoreRawState } from './schemaTypes';

type StoreReactiveState = Reactive<StoreRawState>

const gradeNumToGradeText = {
    1: 'Again',
    2: 'Hard',
    3: 'Good',
    4: 'Easy'
}

export class Store extends EventEmitter<StoreEvents> {
	gradeNumToGradeText = gradeNumToGradeText
	state: StoreReactiveState
	stateRepository: StateRepository
	curDate: Date
	curDateUpdaterIntervalId: ReturnType<typeof setInterval> | null
	fsrsInstance: FSRS
	initCalled: boolean
	destroyCalled: boolean
	unwatchState: (() => void) | null
	constructor(state: StoreRawState, stateRepository: StateRepository) {
		super()
		this.state = reactive(state)
		this.stateRepository = stateRepository
		this.curDate = new Date()
		this.curDateUpdaterIntervalId = null
        /* https://github.com/open-spaced-repetition/py-fsrs?tab=readme-ov-file#explanation-of-parameters */
        const params = generatorParameters(state.fsrsParams);
        this.fsrsInstance = fsrs(params);
		this.initCalled = false
		this.destroyCalled = false
		this.unwatchState = null
		const self = shallowReactive(this)
		return autoBind(self)
	}
	init () {
		if (this.initCalled) {
			return
		}
		this.initCalled = true
		this.unwatchState = this.watchState()
		this.curDateUpdaterIntervalId = setInterval(() => {
			this.curDate = new Date()
		}, 1000)
	}
	destroy () {
		if (this.destroyCalled) {
			return
		}
		this.destroyCalled = true
		this.unwatchState?.()
		if (this.curDateUpdaterIntervalId) {
			clearInterval(this.curDateUpdaterIntervalId)
		}
		this.curDateUpdaterIntervalId = null
	}
	watchState () {
		return watch(() => {
			return this.state
		}, () => {
			this.stateRepository.giveState(toRaw(this.state))
		}, {
			deep: true
		})
	}
	setState (state: StoreRawState) {
		this.unwatchState?.()
		this.state = reactive(state)
		this.unwatchState = this.watchState()
	}
	sort () {
		this.state.items.sort((a, b) => {
			return a.card.due.getTime() - b.card.due.getTime()
		})
	}
	addItem (question: string, answer: string) {
		const itemId = uuidv4()
		this.curDate = new Date()
		this.state.items.unshift({
			itemId,
			question,
			answer,
			card: createEmptyCard(this.curDate)
		})
		this.state.mainContentItemsOrder.push(itemId)
	}
	editItem (itemId: string, question: string, answer: string) {
		const item = this.getItem(itemId)
		if (!item) {
			this.emit('noItem')
			return
		}
		item.question = question
		item.answer = answer
	}
	getItem (itemId: string) {
		return this.state.items.find((item) => item.itemId === itemId)
	}
	deleteItem (itemId: string) {
		const item = this.getItem(itemId)
		if (!item) {
			this.emit('noItem')
			return
		}
		const stateItemIndex = this.state.items.findIndex((stateItem) => stateItem.itemId === itemId)
		this.state.items.splice(stateItemIndex, 1)
		const mainContentItemIndex = this.state.mainContentItemsOrder.findIndex((mainContentItem) => mainContentItem === itemId)
		this.state.mainContentItemsOrder.splice(mainContentItemIndex, 1)
	}
	gradeItem (itemId: string, grade: Grade) {
		const item = this.getItem(itemId)
		if (!item) {
			this.emit('noItem')
			return
		}
		const now = new Date()
		const recordLog = this.fsrsInstance.repeat(item.card, now)
		const recordLogItem = recordLog[grade]
		item.card = recordLogItem.card
	}
}