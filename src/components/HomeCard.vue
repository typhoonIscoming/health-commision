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
					<text class="name">{{ userInfo ? userInfo.name : '去登录' }}</text>
					<view v-if="userInfo" class="status">已绑定</view>
				</view>
				<view class="phone">{{ userInfo?.mob_num }}</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { defineProps } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { isEmpty } from '@/utils';
const props = defineProps({
	size: {
		type: [Number, String],
		default: 70,
	},
});
const emits = defineEmits(['onClick']);

const userInfo = ref(null);

const handleDetail = () => {
	if (isEmpty(userInfo.value)) {
		uni.showModal({
			title: '提示',
			content: '请先完成登录后操作',
			confirmText: '去登录',
			cancelText: '取消',
			success: (res) => {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/subpackage/login/login',
					});
				}
			},
		});
		return;
	}
	emits('onClick');
};
const handleOnShow = () => {
	// 可以在这里获取和更新用户信息
	const auth = uni.getStorageSync('b2cAuth');
	if (isEmpty(auth)) {
		userInfo.value = null
		return;
	}
	userInfo.value = auth;
};
onShow(() => {
	// 可以在这里获取和更新用户信息
	handleOnShow();
});
</script>
<style lang="scss">
.home-card {
	margin-bottom: 30rpx;
	padding: 40rpx 0;
	.person-detail {
		margin-left: 16px;
		min-height: 80rpx;
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
