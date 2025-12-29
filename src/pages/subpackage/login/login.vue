<template>
	<view class="page-container">
		<view class="logo">
			<image src="@/static/home/logo.png" mode="heightFix" />
		</view>
		<view class="login-form">
			<view v-if="loginStatus === 'fastLogin'" class="fast-login">
				<button
					open-type="getPhoneNumber"
					class="authorized-btn"
					@getphonenumber="onGetPhoneNumberLogin"
				>
					手机号快速登录
				</button>
			</view>
			<view v-else-if="loginStatus === 'phoneLogin'" class="phone-login">
				<uv-form labelPosition="left" :model="model" :rules="rules" ref="form">
					<uv-form-item prop="phone">
						<uv-input v-model="model.phone" type="digit" border="none" placeholder="请输入手机号">
							<template #prefix>
								<text class="prefix">+86</text>
							</template>
						</uv-input>
					</uv-form-item>
					<uv-form-item prop="verify">
						<uv-input v-model="model.verify" type="digit" border="none" placeholder="请输入验证码">
							<template #suffix>
								<view class="suffix">
									<text v-if="showCountDown" class="input-btn"> {{ count }} s </text>
									<text v-else @tap="getVerify">获取验证码</text>
								</view>
							</template>
						</uv-input>
					</uv-form-item>
				</uv-form>
				<view>
					<button class="authorized-btn" @tap="onLogin">
						登录
					</button>
				</view>
			</view>
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
import { ref, defineOptions } from 'vue';

defineOptions({
	options: {
		styleIsolation: 'shared'
	},
})

const loginStatus = ref('fastLogin');

const model = ref({
	phone: '',
	verify: '',
});
const rules = ref({});
const count = ref();
// 显示倒计时
const showCountDown = ref(false);

let timer = null;

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

const startInterval = () => {
	const entryTime = parseInt(new Date().getTime() / 1000); // 进入页面得当前时间
	let currentTime = 0; // 当前时间
	const maxtime = 60; // 传入秒钟 = 最多走几秒
	count.value = maxtime;
	showCountDown.value = true;
	timer = setInterval(() => {
		currentTime = parseInt(new Date().getTime() / 1000); // 在定时器里面每隔一秒记录当前时间；
		const TimeDifference = currentTime - entryTime; // 时间差
		const mytime = maxtime - TimeDifference; // 传入的秒数 - 已经走掉的秒数  = 当前还剩多少秒数
		if (TimeDifference <= maxtime) {
			// 如果已经走掉的秒数 小于等于  传入的秒数
			count.value = Math.floor(mytime % 60);
		} else {
			clearInterval(timer);
			timer = null;
			showCountDown.value = false;
		}
	}, 1000);
};

// 获取验证码
const getVerify = () => {
	startInterval();
}

const onLogin = () => {}
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
	.phone-login{
		.uv-form-item{
			padding: 0 10px;
			&~.uv-form-item{
				margin-top: 40rpx;
			}
			border: 1px solid #e1e1e1;
			border-radius: 14rpx;
		}
		.prefix{
			position: relative;
			margin-right: 10px;
			&::before{
				content: '';
				position: absolute;
				right: -8px;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 1px;
				height: 30rpx;
				background: #e1e1e1;
			}
		}
		.suffix{
			color: #F81A1A;
		}
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
