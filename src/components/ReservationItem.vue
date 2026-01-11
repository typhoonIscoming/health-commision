<template>
	<view class="reservation-item flex">
		<view class="left">
			<image src="../static/home/tjjl.png" mode="aspectFill" style="width: 60rpx;height:60rpx" />
		</view>
		<view class="right">
			<view class="row flex">
				<view class="title">体检机构名称：</view>
				<view class="value">新疆医科大学第六附属医院（建工医院）</view>
			</view>
			<view class="row flex">
				<view class="title">机构地址：</view>
				<view class="value">乌鲁木齐市天山区五星路24号</view>
			</view>
			<view class="row flex">
				<view class="title">预约日期：</view>
				<view class="value" style="font-size: 32rpx;font-weight: bold;">2026-01-20</view>
			</view>
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
	background: #f5faff;
	border-radius: 8px;
	margin-bottom: 20rpx;
	.row {
		margin-bottom: 20rpx;
		&:last-child {
			margin-bottom: 0;
		}
		.title {
			color: #808080;
			white-space: nowrap;
			width: 200rpx;
		}
		.value{
			word-break: break-all;
			flex: 1;
		}
	}
	.right{
		flex: 1;
		margin-left: 20rpx;
	}
}
</style>
