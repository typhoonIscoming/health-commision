<template>
	<view class="title-wrapper">
		<text
			class="title-text"
			style="font-weight: bold; font-size: 32rpx; color: #3d3d3d"
		>
			{{ props.title }}
		</text>
		<slot />
	</view>
</template>
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
	title: {
		type: String,
		default: '',
	},
});
</script>
<style lang="scss">
.title-wrapper {
	position: relative;
	// padding-left: 20rpx;
	// padding-right: 20rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	.title-text {
		position: relative;
		&::before {
			content: '';
			position: absolute;
			left: 2px;
			bottom: 0;
			width: 60rpx;
			height: 4px;
			background: #58b384;
			border-radius: 5px;
			overflow: hidden;
		}
	}
}
</style>
