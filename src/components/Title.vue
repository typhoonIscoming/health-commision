<template>
	<view class="title-wrapper">
		<text style="font-weight: bold; font-size: 32rpx">
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
	padding-left: 20rpx;
	padding-right: 20rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 2px;
		height: 100%;
		background: #0f62fb;
		border-radius: 5px;
		overflow: hidden;
	}
}
</style>
