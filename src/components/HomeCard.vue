<template>
	<view class="home-card">
		<view class="page-gap flex-center" @click="handleDetail">
			<uv-avatar
				src="https://cdn.uviewui.com/uview/album/1.jpg"
				:size="props.size"
				style="border: 1px solid white"
			></uv-avatar>
			<view class="person-detail">
				<view class="name-wrapper flex-center">
					<text class="name">张三</text>
					<view class="status">已备案</view>
				</view>
				<view class="phone">18298786756</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
	size: {
		type: [Number, String],
		default: 70,
	},
});
const emits = defineEmits(['onClick']);

const handleDetail = () => {
	emits('onClick');
};
</script>
<style lang="scss">
.home-card {
	margin-bottom: 30rpx;
	padding: 40rpx 0;
	.person-detail {
		margin-left: 16px;
		.name {
			font-size: 28rpx;
			font-weight: bold;
		}
		.status {
			background: #c2d9f5;
			border: 1px solid #0f62fb;
			border-radius: 3px;
			color: #0f62fb;
			padding: 4rpx 10rpx;
			margin-left: 16rpx;
		}
		.phone {
			color: #808080;
			margin-top: 16rpx;
		}
	}
}
</style>
