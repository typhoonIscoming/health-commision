<template>
	<view class="physical-item">
		<view class="physical-item-title">成人健康体检表</view>
		<view class="physical-item-address">昌吉市大西渠镇卫生院</view>
		<view class="physical-item-date flex-center flex-between">
			<uv-tags
				text="体检日期：2025-12-01"
				plain
				color="#0F62FB"
				borderColor="#0F62FB"
				shape="circle"
			></uv-tags>
			<uv-tags
				text="查看报告"
				type="warning"
				shape="circle"
				@click="handleRoute"
			></uv-tags>
		</view>
	</view>
</template>
<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});

const handleRoute = () => {
	uni.navigateTo({
		url: `/pages/subpackage/physicalDetail/physicalDetail`,
	});
};
</script>
<style lang="scss">
.physical-item {
	padding: 20rpx;
	border-radius: 6px;
	background: #fff;
	margin-top: 20rpx;
	&-title {
		font-size: 30rpx;
		font-weight: bold;
	}
	&-address {
		padding: 20rpx 0;
		color: #383838;
	}
}
</style>
