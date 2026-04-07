<template>
	<view class="userAuth">
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
							placeholderClass="place-holder"
							inputAlign="right"
							border="none"
							placeholder="请输入姓名"
							placeholderStyle="color: #7C7C7C"
						>
						</uv-input>
					</uv-form-item>
					<uv-form-item prop="phone" label="手机号码" borderBottom>
						<uv-input
							v-model="model.phone"
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
							placeholderClass="place-holder"
							inputAlign="right"
							type="number"
							border="none"
							placeholder="请输入手机验证码"
							placeholderStyle="color: #7C7C7C"
						>
							<template v-slot:suffix>
								<uv-code
									ref="uCode"
									@change="codeChange"
									seconds="20"
									changeText="X秒重新获取"
								></uv-code>
								<uv-button
									:text="verifyText"
									type="primary"
									size="mini"
									shape="circle"
									color="#58B384"
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
							placeholderClass="place-holder"
							inputAlign="right"
							type="idcard"
							border="none"
							placeholder="请输入身份证号"
							placeholderStyle="color: #7C7C7C"
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
							<!-- <view
								style="
									font-weight: bold;
									font-size: 32rpx;
									margin: 40rpx 0;
								"
							>
								为确保信息安全，需由本人进行验证
							</view> -->
							<image
								src="@/static/home/verify-icon.png"
								mode="aspectFit"
								style="width: 140rpx; height: 140rpx"
							/>
							<view>
								<uv-button
									type="primary"
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
									人脸识别
								</uv-button>
							</view>
							<!-- <view
								class="flex recognition-box"
								@click="handleStartSoterAuthentication"
							>
								<uni-icons
									custom-prefix="iconfont"
									type="icon-Gc_101_line-FaceRecognition"
									size="42rpx"
									color="#2D8AF8"
								/>
								<text
									style="margin-left: 10rpx; font-size: 28rpx"
								>
									请进行人脸识别
								</text>
								<view
									v-if="model.recognition"
									style="margin-left: 40rpx"
								>
									<text
										v-if="model.recognition === 'success'"
									>
										<uni-icons
											type="checkmarkempty"
											size="30rpx"
											color="#2D8AF8"
										/>
									</text>
									<text
										v-else-if="model.recognition === 'fail'"
									>
										<uni-icons
											type="closeempty"
											size="30rpx"
											color="#2D8AF8"
										/>
									</text>
								</view>
								<view class="arrow-wrap">
									<uni-icons
										type="right"
										size="20"
										color="#7c7c7c"
									></uni-icons>
								</view>
							</view> -->
						</view>
					</uv-form-item>
				</view>
			</uv-form>

			<view style="margin-top: 60rpx">
				<uv-button
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
import { ref } from 'vue';
import faceVerify from '@/utils/faceVerify';
import { bindUserAuth } from '@/api/index.js';

const verifyText = ref('获取验证码');
const form = ref(null);
const model = ref({
	name: '测试用户',
	phone: '16601762764',
	idCard: '654127198106222012',
	idCardType: '身份证',
	verify: '',
	recognition: 'success',
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
	// recognition: [
	// 	{
	// 		validator: (_, v, c) => {
	// 			console.log('人脸识别结果', v);
	// 			if (!v) {
	// 				c(new Error('请进行人脸识别'));
	// 				return;
	// 			}
	// 			if (v && v === 'success') {
	// 				c();
	// 			} else {
	// 				c(new Error('人脸识别未通过，请重新识别'));
	// 			}
	// 		},
	// 		trigger: 'blur',
	// 	},
	// ],
});

const codeChange = (text) => {
	verifyText.value = text;
};

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
const handleStartSoterAuthentication = () => {
	// faceVerify({ name: model.value.name, idCard: model.value.idCard }).then((res) => {
	// 	model.value.recognition = 'success';
	// 	console.log('人脸识别成功', res);
	// }).catch((err) => {
	// 	console.log('人脸识别失败', err);
	// 	uni.showToast({
	// 		title: err.message || '人脸识别失败',
	// 		icon: 'error',
	// 	});
	// });
	model.value.recognition = '';
	uni.startSoterAuthentication({
		requestAuthModes: ['facial'],
		challenge: '123456',
		authContent: '请进行人脸识别',
		success: (res) => {
			console.log('人脸识别成功', res);
			model.value.recognition = 'success';
		},
		fail: (err) => {
			console.log('人脸识别失败', err);
			model.value.recognition = 'fail';
			uni.showToast({
				title: '人脸识别失败',
				icon: 'error',
			});
		},
	});
};
// 绑定用户信息
const handleBindUserInfo = () => {
	// TODO 调用绑定用户信息接口
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
			res = mockBindUserInfo(params);
			console.log('bindUserAuth', res);
			if (!res || res.code !== 'S200') {
				uni.showToast({
					title: '绑定失败',
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
			mockBindUserInfo();
			// uni.showToast({
			// 	title: err.message || '绑定失败',
			// 	icon: 'error',
			// });
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
