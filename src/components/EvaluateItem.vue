<template>
	<view class="evaluateItem">
		<view class="icon-wrap flex flex-center">
			<uv-icon :name="hospitalIcon" color="#ffffff" size="20"></uv-icon>
			<view
				class="hospital-name"
				style="font-weight: bold; font-size: 14px; margin-left: 10rpx"
			>
				新疆医科大学附属肿瘤医院
			</view>
		</view>
		<view class="tijian-content">
			<view class="header flex-center">
				<view class="evaluateItem-date flex">
					<text class="label">就诊类型:</text>
					<text class="value">体检</text>
				</view>
			</view>
			<view class="header flex-center">
				<view class="evaluateItem-date flex">
					<text class="label">就诊时间:</text>
					<text class="value">{{ info.ctime }}</text>
				</view>
			</view>
			<view class="evaluateItem-title">
				<view class="evaluate-type">
					{{ info.wjmbmc || '服务满意度调查' }}
				</view>
			</view>
			<!-- <view style="padding: 20rpx 0">
				<uv-line></uv-line>
			</view>
			<view class="evaluateItem-footer flex-center flex-between">
				<text>{{ info.mbrq }}</text>
				<view class="flex-center cell-right">
					<text style="font-size: 24rpx">查看详情</text>
					<uv-icon
						name="arrow-right"
						color="#A6A6A6"
						size="15"
					></uv-icon>
				</view>
			</view> -->
		</view>
	</view>
</template>
<script setup>
// 满意度调查组件
import { defineProps, computed } from 'vue';
import hospitalIcon from '@/static/card/hospital-icon.png';

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
	box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.1);
	.tijian-content {
		padding-left: 50rpx;
	}
	.header {
		justify-content: space-between;
		margin-top: 20rpx;
	}
	&-date {
		align-items: center;
		.label,
		.value {
			color: #999999;
			line-height: 1;
		}
		.value {
			margin-left: 10rpx;
			color: #3d3d3d;
			font-weight: bold;
		}
	}
	&-title {
		font-size: 28rpx;
		margin-top: 40rpx;
		.evaluate-type {
			border-radius: 8px;
			background: #007aff;
			color: #ffffff;
			padding: 16rpx 32rpx;
			display: inline-block;
		}
	}
	&-footer {
		color: #a6a6a6;
	}
}
</style>
