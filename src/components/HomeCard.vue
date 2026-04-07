<template>
	<view
		class="home-card"
		:class="{ light: theme === 'light', dark: theme === 'dark' }"
	>
		<view
			class="page-gap user-wrapper"
			:class="[
				userInfo
					? 'has-user-info flex'
					: 'no-user-info flex-col flex-between flex-center',
			]"
			@click="handleDetail"
		>
			<uv-avatar
				:text="
					userInfo && userInfo.name ? userInfo.name.substr(0, 1) : ''
				"
				:src="initAvatar"
				:size="props.size"
				bg-color="rgb(152, 209, 238)"
				style="border: 1px solid transparent"
			></uv-avatar>
			<view class="person-detail" :class="{ 'has-login': userInfo }">
				<view class="name-wrapper flex-center">
					<text class="name">
						{{ userInfo ? userInfo.name : '登录/注册' }}
					</text>
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
import initAvatar from '@/static/home/avatar.png';

const props = defineProps({
	size: {
		type: [Number, String],
		default: 70,
	},
	theme: {
		type: String,
		default: 'light',
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
		userInfo.value = null;
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
	.user-wrapper {
		gap: 12rpx;
	}
	.has-user-info {
		.person-detail {
			margin-left: 16px;
		}
	}
	.no-user-info {
		.person-detail {
			.name {
				color: #4d4d4d;
			}
		}
	}
	.person-detail {
		&.has-login {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.name {
			font-size: 16px;
			font-weight: bold;
			color: #ffffff;
		}
		.status {
			background: #58b383;
			border: 1px solid transparent;
			border-radius: 20px;
			color: #ffffff;
			padding: 4rpx 10rpx;
			margin-left: 16rpx;
			font-size: 24rpx;
		}
		.phone {
			color: #eeeeee;
			margin-top: 16rpx;
		}
	}

	&.dark {
		.person-detail {
			.name,
			.phone {
				color: #3d3d3d;
			}
			.phone {
			}
		}
	}
}
</style>
