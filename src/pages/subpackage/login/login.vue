<template>
	<view class="page-container">
		<view class="logo">
			<image src="@/static/home/logo.png" mode="heightFix" />
		</view>
		<view class="login-form">
			<button
				open-type="getPhoneNumber"
				class="authorized-btn"
				@getphonenumber="onGetPhoneNumberLogin"
			>
				手机号快速登录
			</button>
		</view>
		<view class="footer">
			<view class="other-login-text"> 其他登录方式 </view>
			<view class="other-login">
				<view
					v-if="loginStatus === 'phoneLogin'"
					class="login-item"
					@tap="otherLogin('fastLogin')"
				>
					<image
						src="../../../static/home/fast-login.png"
						mode="heightFix"
					/>
				</view>
				<view
					v-else-if="loginStatus === 'fastLogin'"
					class="login-item"
					@tap="otherLogin('phoneLogin')"
				>
					<image
						src="../../../static/home/mobile-phone.png"
						mode="heightFix"
					/>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref } from 'vue';

const loginStatus = ref('fastLogin');

const otherLogin = (type) => {
	loginStatus.value = type;
};

const onGetPhoneNumberLogin = (e) => {
	if (!e.detail.code) {
		// eslint-disable-next-line no-console
		console.log('手机授权获取code失败：', e.detail);
		uni.showToast({ icon: 'none', title: '手机授权获取失败' });
		return;
	}
};
</script>
<style lang="scss">
.page-container {
	padding-top: 100rpx;
	background: white;
	min-height: 100vh;
	box-sizing: border-box;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
	position: relative;
	/* #ifdef H5 */
	min-height: calc(100vh - constant(safe-area-inset-top));
	min-height: calc(100vh - 44px);
	/* #endif */
	.logo {
		display: flex;
		width: 100%;
		justify-content: center;
		height: 99rpx;
		margin-bottom: 101rpx;
		object-fit: contain;
		image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	.login-form {
		width: 90%;
		margin: 0 auto 10%;
	}
	.authorized-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		margin: 0 auto;
		text-align: center;
		background-color: #f81b1a;
		border: 1rpx solid #f81b1a;
		color: #fff;
		border-radius: 14rpx;
		font-size: 30rpx;
		margin-top: 80rpx;
	}
	.footer {
		position: absolute;
		left: 0;
		right: 0;
		bottom: calc(160rpx + env(safe-area-inset-bottom));
		margin: auto;
		width: 100%;
		.other-login-text {
			display: flex;
			justify-content: center;
			margin-bottom: 40rpx;
			color: #999;
			&::before {
				content: '——————';
				color: #e1e1e1;
				margin-right: 16rpx;
			}
			&::after {
				content: '——————';
				color: #e1e1e1;
				margin-left: 16rpx;
			}
		}
		.other-login {
			display: flex;
			justify-content: center;
			image {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 10rpx;
			}
		}
	}
}
</style>
