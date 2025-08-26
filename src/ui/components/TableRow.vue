<template>
    <tr>
        <TableRowText :item="item" field="question"/>
        <TableRowText :item="item" field="answer" maskable/>
        <td dir="auto">
            <div :class="$style['buttons']">
                <OButton v-for="grade of [3,1]" :key="grade" @click="store.gradeItem(item.itemId, grade)" :buttonText="store.gradeNumToGradeText[grade]"/>
            </div>
        </td>
        <td dir="auto" :class="dueTdClass">{{ item.card.due.toLocaleString() }}</td>
        <td>
            <div :class="$style['buttons']">
                <OButton @click="store.deleteItem(item.itemId)" icon="trash" tooltip="Delete" />
            </div>
        </td>
    </tr>
</template>

<script lang="ts" setup>
import { computed, inject, ref, useCssModule } from 'vue';
import { Store } from '../../domain/store';
import TableRowText from './TableRowText.vue';
import OButton from '../uiKit/OButton.vue';
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
        [$style['due']]: true, 
        [$style['overdue']]: dueTime <= curDateTime, 
        [$style['next']]: dueTime <= curDateTime + hour}
})
</script>

<style lang="scss" module>
.buttons {
	display: flex;
	gap: var(--size-4-2);
    justify-content: center;
}
.table {
	width: 100%;
}
.shrink-th {
	width: 0;
}
.answer-td {
	filter: blur(0.5rem);

	&--disclosed {
		filter: none;
	}
}
.due {
	white-space: nowrap !important;
    vertical-align: middle !important;
}
.overdue {
	font-weight: bold;
	color: var(--text-accent) !important;
}
.next {
	color: var(--text-accent) !important;
}
</style>
