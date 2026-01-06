<template>
	<view class="reservation-item">
		<view class="row flex-between flex-center">
			<text class="title" style="color: #000000">预约体检服务</text>
			<uv-tags
				text="等待确认"
				shape="circle"
				size="mini"
				:type="tagType"
			>
			</uv-tags>
		</view>
		<view class="row flex-between flex-center">
			<text class="title">医院</text>
			<text class="value">第一人民医院</text>
		</view>
		<view class="row flex-between flex-center">
			<text class="title">科室</text>
			<text class="value">体检科</text>
		</view>
		<view class="row flex-between flex-center">
			<text class="title">服务</text>
			<text class="value">体检</text>
		</view>
		<view class="row flex-between flex-center">
			<text class="title">时间</text>
			<text class="value">2025-10-01 10:00</text>
		</view>
	</view>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
	status: {
		type: Number,
		default: 0,
	}
});
const tagType = computed(() => {
	const s = props.status;
	switch (s) {
		case 0: return 'primary'
		case 1: return 'warning'
		case 2: return 'success'
		case 3: return 'error'
		default: return 'primary'
	}
});

</script>
<style lang="scss">
.reservation-item {
	padding: 20rpx;
	background-color: #ffffff;
	border-radius: 6px;
	margin-bottom: 20rpx;
	.row {
		margin-bottom: 20rpx;
		&:last-child {
			margin-bottom: 0;
		}
		.title {
			color: #808080;
		}
	}
}
</style>
