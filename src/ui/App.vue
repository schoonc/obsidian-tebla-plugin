<template>
	<div class="root markdown-rendered">
		 <div class="bases-header" :class="$style['bases-header']">
			<div class="query-toolbar">
				<div class="query-toolbar-item bases-toolbar-result-count">
					<div :class="$style['results']" icon="list-filter">{{ store.state.items.length }} results</div>
				</div>
				<div class="query-toolbar-item">
					<OTextIconButton icon="plus" @click="store.addItem('', '')">New</OTextIconButton>
				</div>
			</div>
		 </div>
		<div class="el-table" dir="auto" style="overflow-x: auto;">
			<table :class="$style['table']">
				<thead>
					<tr>
						<th dir="auto">Question</th>
						<th dir="auto">Answer</th>
						<th dir="auto">Grade</th>
						<th dir="auto">
							<div>Review date</div>
							<button type="button" :class="$style['sort-link']" @click="store.sort('due')">Ascending</button>
						</th>
						<th dir="auto">
							<div>Stability</div>
							<button type="button" :class="$style['sort-link']" @click="store.sort('stability')">Unstable first</button>
						</th>
						<th dir="auto">
							<div>Difficulty</div>
							<button type="button" :class="$style['sort-link']" @click="store.sort('difficulty')">Difficult first</button>
						</th>
						<th dir="auto"></th>
					</tr>
				</thead>
				<tbody>
					<template v-if="store.state.items.length">
						<TableRow :key="item.itemId" v-for="item of store.state.items" :item="item" />
					</template>
					<tr v-else><td colspan="5">No elements.</td></tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { Store } from '../domain/store';
import TableRow from './components/TableRow.vue';
import OTextIconButton from './uiKit/OTextIconButton.vue';
const store = inject<Store>('store')!
</script>

<style lang="scss" module>
.table {
	width: 100%;
	margin: 0 !important;
	--table-column-min-width: 0;
}
.bases-header {
	border-bottom: none;
}
.results {
	font-size: var(--font-ui-smaller);
	color: var(--text-muted);
}
.sort-link {
	all: unset;
	font-weight: normal;
	color: var(--text-muted) !important;
	box-shadow: none !important;
	background-color: transparent !important;
	white-space: nowrap;
	font-size: var(--font-smallest);
	border-bottom: 1px dashed;
	&:hover {
		color: var(--text-normal) !important;
	}
	&:focus-visible {
		outline: 1px solid;
	}
}
</style>
