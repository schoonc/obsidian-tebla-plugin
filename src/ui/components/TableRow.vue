<template>
    <tr>
        <TableRowText :class="$style['question-td']" :item="item" field="question"/>
        <TableRowText :class="$style['answer-td']" :item="item" field="answer" maskable/>
        <td dir="auto" :class="$style['grade-td']">
            <div :class="$style['buttons']">
                <OButton v-for="grade of [3,1]" :key="grade" @click="store.gradeItem(item.itemId, grade)" :buttonText="store.gradeNumToGradeText[grade]"/>
            </div>
        </td>
        <td dir="auto" :class="$style['due-td']">
            <div title="Review date" :class="dueClass">{{ item.card.due.toLocaleString() }}</div>
            <div title="Last review date" :class="$style['last-review']">{{ item.card.last_review.toLocaleString() }}</div>
        </td>
        <td dir="auto" :class="$style['stability-td']">{{ item.card.stability }}</td>
        <td dir="auto" :class="$style['difficulty-td']">{{ item.card.difficulty }}</td>
        <td :class="$style['actions-td']">
            <div :class="$style['buttons']">
                <OClickableIcon @click="store.deleteItem(item.itemId)" icon="trash" title="Delete" />
            </div>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import { computed, inject, useCssModule } from 'vue';
import { Store } from '../../domain/store';
import OClickableIcon from '../uiKit/OClickableIcon.vue';
import OButton from '../uiKit/OButton.vue';
import TableRowText from './TableRowText.vue';
const store = inject<Store>('store')!
const props = defineProps({
    item: {
        type: Object,
        required: true,
    }
})
const $style = useCssModule()
const dueClass = computed(() => {
    const dueTime = props.item.card.due.getTime()
    const curDateTime = store.curDate.getTime()
    const hour = 60 * 60 * 1000
    return {
        [$style['due--overdue']]: dueTime <= curDateTime, 
        [$style['due--next']]: dueTime <= curDateTime + hour}
})
</script>

<style lang="scss" module>
.question-td {
    max-width: 0 !important;
}

.answer-td {
    max-width: 0 !important;
}

.grade-td {
    width: 0;
}

.due-td {
    width: 0;
    white-space: nowrap !important;
}
.due--overdue {
	font-weight: bold;
	color: var(--text-accent) !important;
}
.due--next {
	color: var(--text-accent) !important;
}
.last-review {
    color: var(--text-faint);
}

.difficulty-td {
    width: 0;
    white-space: nowrap !important;
}

.stability-td {
    width: 0;
    white-space: nowrap !important;
}

.actions-td {
    width: 0;
}

.buttons {
	display: flex;
	gap: var(--size-4-2);
}
</style>
