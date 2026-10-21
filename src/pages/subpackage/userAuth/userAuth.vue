<template>
	<view class="userAuth">
		<NavBar title="用户认证">
			<template v-slot:left>
				<view
					class="flex flex-center"
					@click="
						uni.navigateTo({ url: '/pages/subpackage/login/login' })
					"
				>
					<uv-icon name="arrow-left"></uv-icon>
				</view>
			</template>
		</NavBar>
		<view class="user-auth-tip flex flex-center" style="padding: 0 10rpx">
			<image
				src="@/static/home/verify.png"
				mode="aspectFit"
				style="width: 30rpx; height: 30rpx"
			/>
			<text
				style="
					margin-left: 10rpx;
					color: var(--uni-primary-text-color);
					font-size: 28rpx;
				"
			>
				用于身份认证，请填写您的真实信息
			</text>
		</view>
		<view class="form-wrap">
			<uv-form
				labelPosition="left"
				:model="model"
				:rules="rules"
				ref="form"
				label-width="100"
				:label-style="{ color: '#303030' }"
			>
				<view class="base-info-wrap">
					<uv-form-item prop="name" label="姓名" borderBottom>
						<uv-input
							v-model="model.name"
							:clearable="false"
							placeholderClass="place-holder"
							inputAlign="right"
							border="none"
							placeholder="请输入姓名"
							placeholderStyle="color: #7C7C7C"
							@change="model.recognition = ''"
						>
						</uv-input>
					</uv-form-item>
					<uv-form-item prop="phone" label="手机号码" borderBottom>
						<uv-input
							v-model="model.phone"
							:clearable="false"
							placeholderClass="place-holder"
							inputAlign="right"
							type="number"
							border="none"
							placeholder="请输入手机号"
							placeholderStyle="color: #7C7C7C"
						>
						</uv-input>
					</uv-form-item>
					<uv-form-item prop="verify" label="手机验证码" borderBottom>
						<uv-input
							v-model="model.verify"
							:clearable="false"
							placeholderClass="place-holder"
							inputAlign="right"
							type="number"
							border="none"
							placeholder="请输入手机验证码"
							placeholderStyle="color: #7C7C7C"
						>
							<template v-slot:suffix>
								<uv-button
									v-if="showCountDown"
									type="primary"
									size="mini"
									shape="circle"
									color="#58B384"
								>
									{{ count }} s
								</uv-button>
								<uv-button
									v-else
									:text="verifyText"
									type="primary"
									size="mini"
									shape="circle"
									color="#58B384"
									@click="handleGetVerifyCode"
								>
									发送验证码
								</uv-button>
							</template>
						</uv-input>
					</uv-form-item>
					<uv-form-item label="证件类型" borderBottom>
						<uv-input
							v-model="model.idCardType"
							readonly
							placeholderClass="place-holder"
							inputAlign="right"
							type="idcard"
							border="none"
							placeholder="请选择证件类型"
							placeholderStyle="color: #7C7C7C"
						>
						</uv-input>
						<template v-slot:right>
							<uv-icon name="arrow-right"></uv-icon>
						</template>
					</uv-form-item>
					<uv-form-item prop="idCard" label="证件号码">
						<uv-input
							v-model="model.idCard"
							clearable
							placeholderClass="place-holder"
							inputAlign="right"
							type="idcard"
							border="none"
							placeholder="请输入身份证号"
							placeholderStyle="color: #7C7C7C"
							@change="model.recognition = ''"
						>
						</uv-input>
					</uv-form-item>
				</view>
				<view class="face-verify-wrap">
					<uv-form-item prop="recognition">
						<view
							class="flex-col flex-between flex-center"
							style="width: 100%"
						>
							<image
								src="@/static/home/verify-icon.png"
								mode="aspectFit"
								style="width: 140rpx; height: 140rpx"
							/>
							<view>
								<uv-button
									type="primary"
									:loading="faceVerifyLoading"
									loadingText="识别中..."
									color="#68D7AA"
									shape="circle"
									style="margin-top: 30rpx"
									:customStyle="{
										padding: '10rpx 50rpx',
										lineHeight: '1',
										fontSize: '24rpx',
										height: '60rpx',
									}"
									@click="handleStartSoterAuthentication"
								>
									{{
										model.recognition === 'success'
											? '识别成功'
											: '人脸识别'
									}}
								</uv-button>
							</view>
						</view>
					</uv-form-item>
				</view>
			</uv-form>

			<view style="margin-top: 60rpx">
				<uv-button
					:loading="bindLoading"
					type="primary"
					color="#58B384"
					shape="circle"
					@click="handleSubmit"
				>
					提交
				</uv-button>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import {
	bindUserAuth,
	getMobileVerifyCode,
	faceRecognition,
} from '@/api/index.js';
import { isEmpty, to } from '@/utils';
import constants from '@/utils/constants';

const success = 'success';
const fail = 'fail';
const verifyText = ref('获取验证码');
const form = ref(null);
const model = ref({
	name: '',
	phone: '',
	idCard: '',
	idCardType: '身份证',
	verify: '',
	recognition: success, // success | fail
});
const rules = ref({
	name: [
		{
			required: true,
			message: '请输入姓名',
			trigger: 'blur',
		},
	],
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
	idCard: [
		{
			required: true,
			message: '请输入身份证号',
			trigger: 'blur',
		},
		{
			pattern:
				/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0|1|2][1-9])|10|20|30|31)\d{3}([0-9Xx])$/,
			message: '请输入正确的身份证号',
			trigger: 'blur',
		},
	],
	recognition: [
		{
			validator: (_, v, c) => {
				console.log('人脸识别结果', v);
				if (!v) {
					c(new Error('请进行人脸识别'));
					return;
				}
				if (v && v === 'success') {
					c();
				} else {
					c(new Error('人脸识别未通过，请重新识别'));
				}
			},
			trigger: 'blur',
		},
	],
});
const showCountDown = ref(false);
const count = ref(60);
let timer = null;

const faceVerifyLoading = ref(false);
const bindLoading = ref(false);

const handleSubmit = () => {
	form.value
		.validate()
		.then((valid) => {
			if (valid) {
				// 绑定用户信息
				handleBindUserInfo();
			}
		})
		.catch(() => {
			uni.showToast({
				title: '表单填写有误',
				icon: 'error',
			});
		});
};
// 人脸识别
const handleStartSoterAuthentication = async () => {
	if (model.value.recognition === success) {
		return;
	}
	model.value.recognition = '';
	// 人脸识别之前先校验用户信息
	form.value.validateField(['name', 'idCard'], (result) => {
		console.log('校验用户信息结果', result);
		if (isEmpty(result)) {
			handleFaceRecognition();
		}
	});
};
// 获取人脸识别方法必须得verifyId
const getVerifyId = async () => {
	if (faceVerifyLoading.value) {
		return;
	}
	const params = {
		real_name: model.value.name,
		id_card: model.value.idCard,
		openid: uni.getStorageSync('b2cOpenid'),
	};
	faceVerifyLoading.value = true;
	const [err, res] = await to(faceRecognition(params));
	faceVerifyLoading.value = false;
	if (err) {
		uni.showToast({
			icon: 'none',
			title: err.message || '获取verifyId失败',
		});
		return;
	}
	return res?.verify_id;
};
// 获取到verifyId后才能进行人脸识别
const handleFaceRecognition = async () => {
	const verifyId = await getVerifyId();
	if (!verifyId) {
		return;
	}
	// 这里可以调用实际的人脸识别逻辑，例如 uni.startSoterAuthentication
	wx.requestFacialVerify({
		verifyId,
		success: (res) => {
			console.log('人脸识别成功', res);
			model.value.recognition = success;
		},
		fail: (err) => {
			console.log('人脸识别失败', err);
			model.value.recognition = fail;
			uni.showToast({
				title: '人脸识别失败',
				icon: 'error',
			});
		},
	});
};

// 绑定用户信息
const handleBindUserInfo = () => {
	if (bindLoading.value) {
		return;
	}
	// TODO 调用绑定用户信息接口
	bindLoading.value = true;
	const params = {
		name: model.value.name,
		mob_num: model.value.phone,
		car_id: model.value.idCard,
		open_id: uni.getStorageSync('b2cOpenid'),
		token: uni.getStorageSync('b2cToken')?.token,
		xcx_code: uni.getStorageSync('b2cWechatCode'),
	};
	bindUserAuth(params)
		.then((res) => {
			// res = res ? res : mockBindUserInfo(params);
			console.log('bindUserAuth', res);
			if (!res || res.code !== 'S200') {
				uni.showToast({
					title: res?.msg || '绑定失败',
					icon: 'error',
				});
				return;
			}
			uni.setStorageSync('b2cAuth', res);
			uni.showToast({
				title: '绑定成功',
				icon: 'success',
				duration: 2000,
			});
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/tabBar/index/index',
				});
			}, 2000);
		})
		.catch((err) => {
			// mockBindUserInfo();
			uni.showToast({
				title: err.message || '绑定失败',
				icon: 'error',
			});
		})
		.finally(() => {
			bindLoading.value = false;
		});
};
// 模拟绑定数据
const mockBindUserInfo = (params) => {
	const temp = {
		code: 'S200',
		name: model.value.name,
		mob_num: model.value.phone,
		car_id: model.value.idCard,
		...params,
	};
	return temp;
};
// 获取短信验证码
const handleGetVerifyCode = async () => {
	if (isEmpty(model.value.phone)) {
		uni.showToast({ icon: 'none', title: '请输入手机号' });
		return;
	}
	const [err, res] = await to(
		getMobileVerifyCode({
			mob: model.value.phone,
			// mob: '18227337736',
			appkey: constants.appKey,
			sign: constants.sign,
		}),
	);
	if (err) {
		uni.showToast({ icon: 'none', title: err.message || '获取验证码失败' });
		return;
	}
	startInterval();
	uni.showToast({ icon: 'none', title: '验证码已发送' });
};

const startInterval = (initTime) => {
	const entryTime = parseInt(new Date().getTime() / 1000); // 进入页面得当前时间
	let currentTime = 0; // 当前时间
	const maxtime = initTime || 60; // 传入秒钟 = 最多走几秒
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
			uni.removeStorageSync('b2cVerifyCodeEntryTime');
		}
		uni.setStorageSync('b2cVerifyCodeEntryTime', count.value);
	}, 1000);
};

onMounted(() => {
	// 进入页面查看是否之前的倒计时还没有完成
	const remainingTime = uni.getStorageSync('b2cVerifyCodeEntryTime');
	if (remainingTime > 0) {
		count.value = remainingTime;
		showCountDown.value = true;
		startInterval(remainingTime);
	}
});
</script>
<style lang="scss">
.userAuth {
	padding: 20rpx;
	min-height: 100vh;
	background-color: #f7f7f7;
	.form-wrap {
		margin-top: 30rpx;
		.base-info-wrap {
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 20rpx;
		}
		.uv-form-item__body__left__content__label {
			color: #3d3d3d !important;
			font-weight: bold;
		}
		.uv-form-item__body__right__message {
			text-align: right;
		}
		.place-holder {
			color: red;
		}
		.uni-input-input {
			// color: #999999;
			&:placeholder {
				color: #999999;
			}
		}
		.face-verify-wrap {
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 0 20rpx 20rpx;
			margin-top: 30rpx;
			.uv-form-item__body__right__message {
				display: inline-block;
				margin-left: 0 !important;
				text-align: center;
				width: 100%;
			}
		}
		.recognition-box {
			padding: 20rpx;
			color: #7c7c7c;
			border: 1px solid #e0e0e0;
			border-radius: 16rpx;
			width: 100%;
			margin-top: 10rpx;
			text-align: center;
			position: relative;
			.arrow-wrap {
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%) translateX(50%);
			}
		}
	}
}
</style>
