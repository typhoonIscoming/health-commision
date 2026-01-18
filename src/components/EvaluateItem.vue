<template>
	<view class="evaluateItem">
		<view class="header flex-center">
			<view class="evaluateItem-date flex">
				<text class="label">完成时间:</text>
				<text class="value">{{ info.ctime }}</text>
			</view>
			<uv-tags text="已完成" plain size="mini" type="warning"></uv-tags>
		</view>
		<view class="evaluateItem-title">
			{{ info.wjmbmc || '服务满意度调查' }}
		</view>
		<view style="padding: 20rpx 0">
			<uv-line></uv-line>
		</view>
		<view class="evaluateItem-footer flex-center flex-between">
			<text>{{ info.mbrq }}</text>
			<view class="flex-center cell-right">
				<text style="font-size: 24rpx">查看详情</text>
				<uv-icon name="arrow-right" color="#A6A6A6" size="15"></uv-icon>
			</view>
		</view>
	</view>
</template>
<script setup>
// 满意度调查组件
import { defineProps, computed } from 'vue';
const props = defineProps({
	item: {
		type: Object,
		default: () => ({}),
	},
});

const info = computed(() => props.item);
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
		align-items: center;
		.label, .value{
			color: #575757;
			line-height: 1;
		}
		.value{
			margin-left: 10rpx;
			
		}
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
