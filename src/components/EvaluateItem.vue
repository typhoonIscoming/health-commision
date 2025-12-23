<template>
	<view class="evaluateItem">
		<view class="header flex-center">
			<view class="evaluateItem-date">2025-10-25 10:25:30</view>
			<uv-tags text="已完成" plain size="mini" type="warning"></uv-tags>
		</view>
		<view class="evaluateItem-title">
			第一人民医院张某三离休人员住院服务调查
		</view>
		<view style="padding: 20rpx 0">
			<uv-line></uv-line>
		</view>
		<view class="evaluateItem-footer flex-center flex-between">
			<text>2024-09-03 12:30:30</text>
			<view class="flex-center cell-right">
				<text style="font-size: 24rpx">查看更多</text>
				<uv-icon name="arrow-right" color="#A6A6A6" size="15"></uv-icon>
			</view>
		</view>
	</view>
</template>
<script setup>
// 满意度调查组件
import { defineProps } from 'vue';
const props = defineProps({
	item: {
		type: Object,
		default: () => ({}),
	},
});
</script>
<style lang="scss">
.evaluateItem {
	border-radius: 6px;
	background: #ffffff;
	padding: 20rpx;
	margin-bottom: 20rpx;
	.header {
		padding: 20rpx 0;
		justify-content: space-between;
	}
	&-date {
		color: #575757;
	}
	&-title {
		font-size: 28rpx;
		font-weight: bold;
	}
	&-footer {
		color: #a6a6a6;
	}
}
</style>
