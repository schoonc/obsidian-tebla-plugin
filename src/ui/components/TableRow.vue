<template>
    <tr>
        <TableRowText :class="$style['question-td']" :item="item" field="question"/>
        <TableRowText :class="$style['answer-td']" :item="item" field="answer" maskable/>
        <td dir="auto" :class="$style['grade-td']">
            <div :class="$style['buttons']">
                <OButton v-for="grade of [3,1]" :key="grade" @click="store.gradeItem(item.itemId, grade)" :buttonText="store.gradeNumToGradeText[grade]"/>
            </div>
        </td>
        <td dir="auto" :class="dueTdClass">{{ item.card.due.toLocaleString() }}</td>
        <td :class="$style['actions-td']">
            <div :class="$style['buttons']">
                <OButton @click="store.deleteItem(item.itemId)" icon="trash" tooltip="Delete" />
            </div>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import { computed, inject, useCssModule } from 'vue';
import { Store } from '../../domain/store';
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
const dueTdClass = computed(() => {
    const dueTime = props.item.card.due.getTime()
    const curDateTime = store.curDate.getTime()
    const hour = 60 * 60 * 1000
    return {
        [$style['due-date-td']]: true, 
        [$style['due-date-td--overdue']]: dueTime <= curDateTime, 
        [$style['due-date-td--next']]: dueTime <= curDateTime + hour}
})
</script>

<style lang="scss" module>
$maxHeight: 100px;
.question-td {
    max-width: 0 !important;
    max-height: $maxHeight;
}

.answer-td {
    max-width: 0 !important;
    max-height: $maxHeight;
}

.grade-td {
    width: 0;
    max-height: $maxHeight;
}

.due-date-td {
    width: 0;
    white-space: nowrap !important;
    max-height: $maxHeight;
}
.due-date-td--overdue {
	font-weight: bold;
	color: var(--text-accent) !important;
}
.due-date-td--next {
	color: var(--text-accent) !important;
}

.actions-td {
    width: 0;
    max-height: $maxHeight;
}

.buttons {
	display: flex;
	gap: var(--size-4-2);
}
</style>
