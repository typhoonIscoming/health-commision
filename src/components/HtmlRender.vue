<template>
	<view class="hr-root">
		<template v-for="(node, i) in nodes" :key="i">
			<text v-if="node.type === 'text'" :decode="true" class="hr-text">{{
				node.text
			}}</text>
			<image
				v-else-if="node.name === 'img'"
				class="hr-img"
				:style="node.attrs && node.attrs.style"
				:src="node.attrs && node.attrs.src"
				mode="widthFix"
				:lazy-load="true"
				@click="preview(node.attrs && node.attrs.src)"
			/>
			<view v-else-if="node.name === 'br'" class="hr-br"></view>
			<view
				v-else-if="
					node.name && node.name !== 'script' && node.name !== 'style'
				"
				:class="[
					'hr-node',
					`hr-${node.name}`,
					node.attrs && node.attrs.class,
				]"
				:style="node.attrs && node.attrs.style"
			>
				<HtmlRender v-if="node.children" :nodes="node.children" />
			</view>
		</template>
	</view>
</template>

<script setup>
defineOptions({ name: 'HtmlRender' });

defineProps({
	// parseHtml 返回的节点数组
	nodes: {
		type: Array,
		default: () => [],
	},
});

const preview = (src) => {
	if (!src) return;
	uni.previewImage({ urls: [src], current: src });
};
</script>

<style lang="scss">
.hr-root {
	display: block;
}
.hr-img {
	display: block;
	max-width: 100%;
}
.hr-br {
	height: 1em;
}
.hr-text {
	word-break: break-all;
}
.hr-span,
.hr-b,
.hr-strong,
.hr-i,
.hr-em,
.hr-u,
.hr-a,
.hr-small,
.hr-sub,
.hr-sup {
	display: inline;
}
.hr-b,
.hr-strong {
	font-weight: bold;
}
.hr-i,
.hr-em {
	font-style: italic;
}
.hr-u {
	text-decoration: underline;
}
.hr-a {
	color: #2a82e4;
}
.hr-p {
	margin: 10rpx 0;
}
.hr-h1,
.hr-h2,
.hr-h3,
.hr-h4 {
	font-weight: bold;
	margin: 16rpx 0;
}
</style>
