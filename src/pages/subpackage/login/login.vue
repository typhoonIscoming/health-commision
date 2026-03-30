<template>
	<view
		class="page-container"
		:style="{
			background: `url(${navBg})`,
			backgroundSize: '100% auto',
			backgroundRepeat: 'no-repeat',
			backgroundPositionY: `${0}px`,
			paddingBottom: `${safeInsetBottom}px`,
		}"
	>
		<NavBar :bgImage="navBg" />
		<view class="logo flex-col flex-center">
			<image
				src="@/static/home/login-logo.png"
				mode="heightFix"
				style="height: 60rpx"
			/>
			<image
				src="@/static/home/login-icon.png"
				mode="heightFix"
				style="height: 300rpx; width: 100%; margin-top: 20rpx"
			/>
		</view>
		<view class="login-form">
			<view v-if="loginStatus === 'fastLogin'" class="fast-login">
				<uv-button
					@click="handlePreLogin"
					shape="circle"
					color="#58B384"
				>
					微信快速登录
				</uv-button>
			</view>
			<view v-else-if="loginStatus === 'phoneLogin'" class="phone-login">
				<uv-form
					labelPosition="left"
					:model="model"
					:rules="rules"
					ref="form"
				>
					<uv-form-item prop="phone">
						<uv-input
							v-model="model.phone"
							type="digit"
							border="none"
							placeholder="请输入手机号"
						>
							<template #prefix>
								<text class="prefix">+86</text>
							</template>
						</uv-input>
					</uv-form-item>
					<uv-form-item prop="verify">
						<uv-input
							v-model="model.verify"
							type="digit"
							border="none"
							placeholder="请输入验证码"
						>
							<template #suffix>
								<view class="suffix">
									<text
										v-if="showCountDown"
										class="input-btn"
									>
										{{ count }} s
									</text>
									<text v-else @tap="getVerify">
										获取验证码
									</text>
								</view>
							</template>
						</uv-input>
					</uv-form-item>
				</uv-form>
				<view style="margin-top: 40rpx">
					<uv-button
						class="authorized-btn"
						color="var(--uni-primary-text-color)"
						shape="circle"
						@click="onLogin"
					>
						登录
					</uv-button>
				</view>
			</view>
		</view>
		<view class="other-login">
			<view
				class="login-item flex-center"
				style="gap: 10rpx"
				@tap="otherLogin"
			>
				<text>
					{{
						loginStatus === 'fastLogin' ? '验证码' : '微信快速'
					}}登录
				</text>
				<uv-icon
					name="arrow-rightward"
					color="var(--uni-primary-text-color)"
				/>
			</view>
		</view>
		<view v-if="showAgreementPop" class="agreement-pop">
			<view class="mask" />
			<view class="main">
				<view class="title">温馨提示</view>
				<view class="content">
					请您仔细阅读并充分理解相关条款，点击同意即代表您已阅读并同意
					<text @tap.stop="onToTermsOfService('serviceTerms')">
						《服务条款》
					</text>
				</view>
				<view class="btn-con">
					<view class="btn plain" @tap="showAgreementPop = false">
						取消
					</view>
					<view class="btn" @tap="onHandlePrivacyClick"> 同意 </view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="service-wrap">
				<label class="statement-label" @tap.stop="onHandlePrivacyClick">
					<uv-checkbox
						:checked="isPrivacy === 1"
						:size="20"
						activeColor="var(--uni-primary-text-color)"
						@change="onHandlePrivacyClick"
					></uv-checkbox>
					<view style="color: #999999" class="statement-content">
						若手机号未注册将进入注册流程，注册即视为同意
						<text @tap.stop="onToTermsOfService('serviceTerms')">
							《服务条款》
						</text>
					</view>
				</label>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, defineOptions } from 'vue';
import { fastLogin, checkUserAuth, getMobileVerifyCode } from '@/api';
import { isEmpty, to } from '@/utils';
import constants from '@/utils/constants';
import NavBar from '@/components/NavBar.vue';
import navBg from '@/static/home/login-nav.jpg';
import safeInset from '@/hooks/safeInset';

const { safeInsetBottom } = safeInset();

defineOptions({
	options: {
		styleIsolation: 'shared',
	},
});

const loginStatus = ref('fastLogin'); // fastLogin-快速登录，phoneLogin-手机号登录

const model = ref({
	phone: '',
	verify: '',
});
const rules = ref({
	phone: [
		{
			required: true,
			message: '请输入手机号',
			trigger: 'blur',
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: '请输入正确的手机号',
			trigger: 'blur',
		},
	],
	// verify: [
	// 	{
	// 		required: true,
	// 		message: '请输入验证码',
	// 		trigger: 'blur',
	// 	},
	// ],
});
const count = ref();
// 显示倒计时
const showCountDown = ref(false);
const showAgreementPop = ref(false);
const isPrivacy = ref(0); // 是否同意隐私协议，1已同意，0未同意
const form = ref();

let timer = null;

const otherLogin = () => {
	loginStatus.value =
		loginStatus.value === 'fastLogin' ? 'phoneLogin' : 'fastLogin';
};

const onGetPhoneNumberLogin = (e) => {
	if (!e.detail.code) {
		// eslint-disable-next-line no-console
		console.log('手机授权获取code失败：', e.detail);
		uni.showToast({ icon: 'none', title: '手机授权获取失败' });
		return;
	}
	handleLogin(e.detail.code);
};
const handlePreLogin = () => {
	if (isPrivacy.value !== 1) {
		showAgreementPop.value = true;
		return;
	}
	// #ifdef MP-WEIXIN
	wx.login({
		success: (loginRes) => {
			console.log('微信登录成功：', loginRes);
			if (!isEmpty(loginRes.code)) {
				handleLogin(loginRes.code);
			} else {
				uni.showToast({ icon: 'none', title: '登录失败，请稍后重试' });
			}
		},
		fail: (err) => {
			// eslint-disable-next-line no-console
			console.log('获取登录code失败：', err);
			uni.showToast({ icon: 'none', title: '登录失败，请稍后重试' });
		},
	});
	// #endif
	// #ifndef MP-WEIXIN
	handleH5Login();
	uni.navigateTo({
		url: '/pages/subpackage/userAuth/userAuth',
	});
	// #endif
};
// H5模拟登录
const handleH5Login = () => {
	uni.setStorageSync('b2cWechatCode', '0f360Sll2Mxl6h4gOfol2czfS5060Slm');
	uni.setStorageSync('b2cOpenid', 'oAHxr7e4Accb6y1zO4ot2Co7JAVg');
	uni.setStorageSync('b2cToken', {
		expires: +new Date(),
		token: 'b49a39b1-581c-4bbe-8c12-3505ef7d14a7',
	});
};
const handleLogin = (code) => {
	fastLogin({
		js_code: code,
		appKey: constants.appKey,
		sign: constants.sign,
		login_type: 'weixin',
	})
		.then((res) => {
			uni.setStorageSync('b2cWechatCode', code);
			console.log('快速登录成功：', res);
			// eslint-disable-next-line no-console
			if (!isEmpty(res.token)) {
				handleFastLoginCheck(res);
			} else {
				uni.showToast({ icon: 'none', title: '登录失败，请稍后重试' });
			}
		})
		.catch((err) => {
			// eslint-disable-next-line no-console
			console.log('快速登录失败：', err);
		});
};
const handleFastLoginCheck = async (data) => {
	// 检查用户是否已经授权，如果没有授权，就跳转授权页
	const [err, res] = await to(
		checkUserAuth({ open_id: data.openid, token: data.token }),
	);
	if (!isEmpty(err)) {
		return;
	}
	let { user_id } = res;
	// #ifdef H5
	user_id = 'oAHxr7e4Accb6y1zO4ot2Co7JAVg';
	// #endif
	uni.setStorageSync('b2cOpenid', data.openid);
	uni.setStorageSync('b2cToken', { expires: +new Date(), token: data.token });
	if (!user_id) {
		// 未认证，跳转认证页
		uni.showToast({ icon: 'none', title: '请先完成用户认证' });
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/subpackage/userAuth/userAuth',
			});
		}, 1000);
		return;
	}
	uni.showToast({ icon: 'none', title: '登录成功' });
	// 这里默认填入数据以防本地认证状态丢失（userAuth.vue--204行）
	// 如果已经绑定，这里的res就是返回的身份信息
	uni.setStorageSync('b2cAuth', res);
	setTimeout(() => {
		uni.reLaunch({
			url: '/pages/tabBar/index/index',
		});
	}, 1000);
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
	if (isEmpty(model.value.phone)) {
		uni.showToast({ icon: 'none', title: '请输入手机号' });
		return;
	}
	getMobileVerifyCode({
		手机号: model.value.phone,
		time: new Date().getTime(),
	})
		.then(() => {
			uni.showToast({ icon: 'none', title: '验证码已发送' });
			// 开始倒计时
			startInterval();
		})
		.catch((err) => {
			// eslint-disable-next-line no-console
			console.log('获取验证码失败：', err);
			uni.showToast({
				icon: 'none',
				title: '获取验证码失败，请稍后重试',
			});
		});
};

const onLogin = () => {
	console.log('---', form.value.validate);
	form.value
		.validate()
		.then((valid) => {
			console.log('validate---', valid);
			if (valid) {
				if (isPrivacy.value !== 1) {
					showAgreementPop.value = true;
					return;
				}
				loginByPhone();
			} else {
				uni.showToast({ icon: 'none', title: '请填写完整信息' });
				return false;
			}
		})
		.catch(() => {
			uni.showToast({ icon: 'none', title: '请填写完整信息' });
			return false;
		});
};
// 通过手机号登录
const loginByPhone = async () => {
	// #ifdef H5
	const token = {
		expires: 1769102486226,
		token: '9af286c4-3177-4099-9d3f-c2d7a49ba20e',
	};
	const info = {
		msg: '绑定成功',
		birthday: '1985-01-01',
		dyjb: '处级正职',
		gwyjb: '六级公务员',
		code: 'S200',
		zjnx: '退休厅级10年以上',
		mob_num: '+8616601762764',
		tx: 'https://www.2g2b.cn/file/mdpic/aa59881e-0936-4e06-a0b9-aa627b124541/cabace3c-e25e-4020-add2-14bae997e3ee/695fbdff1544a42694699177/20260123/dG0m5xfI06dg1S1V8x366Gc116b1e75a07aF5Nftfl7u657Z5he1eX2La9c8fr3E.jpeg?attname=fb1036faa4a0d0ed6496fcab03aa659b.jpeg&e=1769530858&token=mdstorage:0krx-13-v25KOIs4-9xiFv7s_HY=',
		sex: '男',
		jlzt: '正常',
		ryzt: '退休',
		user_id: 'U20248736652',
		ybbh: '62196250',
		name: '测试2',
		yhdw: '新疆维吾尔自治区商务厅',
		car_id: '65232219850101101X',
		age: '41',
	};
	uni.setStorageSync('b2cAuth', info);
	uni.setStorageSync('b2cToken', token);
	// #endif
	const [err, res] = await to(
		checkUserAuth({
			mob_num: model.value.phone,
		}),
	);
	if (!isEmpty(err) || isEmpty(res.user_id)) {
		return;
	}
	const { ybbh } = res;
	if (!ybbh) {
		// 未认证，跳转认证页
		uni.showToast({ icon: 'none', title: '请先完成用户认证' });
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/subpackage/userAuth/userAuth',
			});
		}, 1000);
		return;
	}
	uni.showToast({ icon: 'none', title: '登录成功' });
	setTimeout(() => {
		uni.reLaunch({
			url: '/pages/tabBar/index/index',
		});
	}, 1000);
};

const onHandlePrivacyClick = () => {
	isPrivacy.value = isPrivacy.value === 1 ? 0 : 1;
	showAgreementPop.value = false;
};
// 打开服务条款
const onToTermsOfService = () => {
	uni.navigateTo({
		url: '/pages/subpackage/agreement/agreement',
	});
};
</script>
<style lang="scss">
.page-container {
	padding-top: 100rpx;
	box-sizing: border-box;
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
	position: relative;
	/* #ifdef H5 */
	min-height: calc(100vh - env(safe-area-inset-bottom));
	/* #endif */
	min-height: 100vh;
	.logo {
		display: flex;
		width: 100%;
		justify-content: center;
		object-fit: contain;
		image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	.login-form {
		width: 90%;
		margin: 0 auto 40rpx;
	}
	.authorized-btn {
		width: 100%;
		margin: 0 auto;
		text-align: center;
	}
	.fast-login {
		margin-top: 60rpx;
	}
	.phone-login {
		.uv-form-item {
			border-radius: 40px;
			& ~ .uv-form-item {
				margin-top: 30rpx;
			}
			.uv-form-item__body {
				border: 1px solid #e1e1e1;
				border-radius: 40rpx;
				background: #ffffff;
				padding: 10px 20rpx;
				margin-bottom: 10px;
			}
			// border: 1px solid #e1e1e1;
			// background: #ffffff;
			position: relative;
		}
		.prefix {
			position: relative;
			margin-right: 10px;
			&::before {
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
		.suffix {
			color: var(--uni-primary-text-color);
		}
	}
	.other-login {
		display: flex;
		justify-content: center;
		.login-item {
			color: var(--uni-primary-text-color);
			font-size: 28rpx;
		}
	}
	.footer {
		position: absolute;
		left: 0;
		right: 0;
		bottom: calc(100rpx + env(safe-area-inset-bottom));
		margin: auto;
		width: 100%;
	}

	.agreement-pop {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		z-index: 9;
		.mask {
			position: fixed;
			top: 0;
			left: 0;
			display: block;
			background-color: rgba(0, 0, 0, 0.3);
			height: 100vh;
			width: 100vw;
			z-index: -1;
		}
		.main {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 75%;
			background-color: #fff;
			border-radius: 30rpx;
			padding: 30rpx 50rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.title {
				font-size: 32rpx;
			}
			.content {
				font-size: 24rpx;
				color: #999;
				padding: 30rpx 0;
				line-height: 1.5;
				> text {
					color: env(--uni-primary-text-color);
				}
			}
			.btn-con {
				display: flex;
				width: 100%;
				justify-content: space-between;
				.btn {
					padding: 10rpx 60rpx;
					border: 1rpx solid var(--uni-primary-text-color);
					border-radius: 40rpx;
					font-size: 26rpx;
					background-color: var(--uni-primary-text-color);
					color: #fff;
				}
				.btn.plain {
					border-color: #999;
					color: #000;
					background-color: #fff;
				}
			}
		}
	}
	.service-wrap {
		width: 90%;
		margin: 0 auto;
		.statement-label {
			display: flex;
			align-items: flex-start;

			&:active {
				background-color: none;
			}
			.statement-content {
				font-size: 28rpx;
			}
			text {
				color: env(--uni-primary-text-color);
				cursor: pointer;
				font-size: 28rpx;
			}
		}
		.check-box {
			transform: scale(1);
			color: #f81a1a;
		}
		:deep(uni-checkbox.check-box) {
			.uni-checkbox-input {
				background-color: #f81a1a !important;
				border-color: #d1d1d1 !important;
				margin-right: 20rpx;
				&:not(:empty) {
					border: 1px solid transparent !important;
				}
				&:empty {
					background-color: #fff !important;
				}
			}
		}
	}
}
</style>
