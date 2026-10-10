<template>
	<view class="node-root">
		<template v-for="(item, i) in props.nodes" :key="i">
			<template v-if="item.children && item.children.length">
				<template v-if="item.name === 'a'">
					<navigator
						:key="i"
						target="self"
						:url="item.attrs && item.attrs.url"
						open-type="navigate"
						:class="[
							'rich-text-navigator',
							(item.attrs && item.attrs.class) || '',
						]"
					>
						<RichTextNode
							:nodes="item.children"
							:color="props.color"
						/>
					</navigator>
				</template>
				<view
					v-else
					:key="i"
					:class="(item.attrs && item.attrs.class) || 'next-level'"
				>
					{{ parseFilterNames(item) }}
					<RichTextNode :nodes="item.children" :color="props.color" />
				</view>
			</template>
			<template v-else-if="isBlock(item)" :key="i">
				<view
					:key="i"
					:class="(item.attrs && item.attrs.class) || ''"
				></view>
			</template>
			<template v-else :key="`${i}_else`">
				{{ parseFilterNames(item) }}
				<text
					:key="i"
					:class="(item.attrs && item.attrs.class) || ''"
					:style="props.color ? `color: ${props.color}` : ''"
				>
					{{ item.text }}
				</text>
			</template>
		</template>
	</view>
</template>

<script setup>
import { defineProps } from 'vue';

defineOptions({ name: 'RichTextNode' });

const props = defineProps({
	nodes: {
		type: Array,
		default: () => [],
	},
	color: {
		type: String,
		default: '',
	},
});

const isBlock = (item) => {
	const { type, name } = item;
	if (type === 'div' || name === 'div' || name === 'p') return true;
	return false;
};
const parseFilterNames = (item) => {
	console.log('==========', item);
	return '';
};
</script>

<style lang="scss">
.node-root {
	display: inline-block;
}
.rich-text-navigator {
	display: inline-block;
}
</style>
