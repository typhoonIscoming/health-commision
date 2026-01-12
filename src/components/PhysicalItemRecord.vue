<template>
	<view class="PhysicalItemRecord flex">
		<view class="left">
			<view class="row">
				<text class="label">医院机构：</text>
				<text>{{ info.yymc }}</text>
			</view>
			<view class="row">
				<text class="label">补偿类型：</text>
				<text>{{ info.jzlb }}</text>
			</view>
			<view class="row">
				<text class="label">结算日期：</text>
				<text>{{ info.jsrq }}</text>
			</view>
		</view>
		<view class="right flex-col flex-center">
			<view>
				<text class="count">{{ info.bcje }}</text>
				<text class="unit">元</text>
			</view>
			<view class="label">{{ info.bcsqzt }}</view>
		</view>
	</view>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});

const info = computed(() => props.item);
</script>
<style lang="scss">
.PhysicalItemRecord {
	padding: 20rpx;
	border-radius: 6px;
	background: #f5faff;
	margin-top: 20rpx;
	.left {
		flex: 1;
		padding-right: 20rpx;
		.row {
			& ~ .row {
				margin-top: 20rpx;
			}
		}
		.label {
			font-weight: bold;
		}
	}
	.right {
		min-width: 200rpx;
		justify-content: center;
		padding-left: 20rpx;
		position: relative;
		&::before {
			content: '';
			width: 1px;
			height: 80%;
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			// background: #f1a532;
			border-left: 1px dashed #f1a532;
		}
		.count {
			font-size: 48rpx;
			color: #ff7002;
			font-weight: bold;
		}
		.unit {
			color: #a1a2a2;
			margin-left: 10rpx;
		}
		.label {
			color: #ff7002;
		}
	}
}
</style>
