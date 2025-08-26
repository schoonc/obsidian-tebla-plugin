import { EventEmitter } from "eventemitter3"
import { StoreRawStateSchema } from "../domain/schema"
import type { FileJson, FileJsonItem, StoreRawState } from "../domain/schemaTypes"
import type { DataSource, DataSourceEvents } from "./interfaces"
import { isIsoDateString } from "./misc"

export class FileDataSource extends EventEmitter<DataSourceEvents> implements DataSource {
    static dataToState(data: string): StoreRawState {
        const match = data.match(/^---(.*?)^---.*?(## Question%%[^\r\n]+%%.*)?```json(.*?)```/sm)
        if (!match) {
            throw new Error()
        }
        const [, frontmatter, itemsText, jsonText] = match
        if (!frontmatter.includes('isTebla')) {
            throw new Error()
        }
        const mainContentItems = new Map()
        if (itemsText) {
            const itemsMatch = itemsText.matchAll(/^## Question%%([^\r\n]+?)%%(.*?)^## Answer(?:(?:(.*?)(?:^---))|(.*))/smg)
            for (let itemMatch of itemsMatch) {
                const parts = [...itemMatch].filter((part) => part !== undefined)
                let [, itemId, question, answer ] = parts
                question = question.trim()
                answer = answer.trim()
                mainContentItems.set(itemId, {
                    itemId,
                    question,
                    answer
                })
            }
        }
    
        const fileJson: FileJson = JSON.parse(jsonText, (key, value) => {
            return isIsoDateString(value) ? new Date(value) : value
        })
    
        const storeRawState: StoreRawState = {
            ...fileJson,
            mainContentItemsOrder: [...mainContentItems.values()].map((mainContentItem) => {
                return mainContentItem.itemId
            }),
            items: fileJson.items.map((item: FileJsonItem) => {
                const mainContentItem = mainContentItems.get(item.itemId)
                return {
                    ...item,
                    question: mainContentItem.question,
                    answer: mainContentItem.answer,
                }
            })
        }
    
        return StoreRawStateSchema.parse(storeRawState)
    }
	giveData (data: string): void {
        const state = FileDataSource.dataToState(data)
        this.emit('state', state)
    }

    /* Why such a structure? frontmatter - to quickly get information about the file. Cards simply as md text - so that [[]] links are visible
in the Obsidian system and it can automatically update them if needed. And JSON below - because it's a convenient format for a large volume of nested data (it would be
inconvenient to work with this in frontmatter) */
    static stateToData (storeRawState: StoreRawState): string {
        const frontmatter = `---
isTebla: true
---`

        const itemsMap = new Map()
        for (const item of storeRawState.items) {
            itemsMap.set(item.itemId, item)
        }
        const mainContentItems = storeRawState.mainContentItemsOrder.map((itemId) => {
            return `## Question%%${itemId}%%
${itemsMap.get(itemId).question}

## Answer
${itemsMap.get(itemId).answer}`
    }).join(`

---

`)

        const jsonState: FileJson = {
            version: storeRawState.version,
            fsrsParams: storeRawState.fsrsParams,
            items: storeRawState.items.map((item) => ({
                itemId: item.itemId,
                card: item.card
            }))
        }

        const jsonString = '```json\n' + JSON.stringify(jsonState, null, 2) + '```'

        return frontmatter + '\n\n' + mainContentItems + '\n\n' + jsonString
    }

    giveState (storeRawState: StoreRawState): void {
        const data = FileDataSource.stateToData(storeRawState)
        this.emit('data', data)
    }
}