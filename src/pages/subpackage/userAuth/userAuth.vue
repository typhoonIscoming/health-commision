<template>
	<view class="userAuth">
		<view class="form-wrap">
			<uv-form
				labelPosition="left"
				:model="model"
				:rules="rules"
				ref="form"
				label-width="100"
				:label-style="{ color: '#303030' }"
			>
				<uv-form-item prop="name" label="姓名" borderBottom>
					<uv-input
						v-model="model.name"
						border="none"
						placeholder="请输入姓名"
						:placeholderStyle="{ color: '#7C7C7C' }"
					>
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="phone" label="手机号码" borderBottom>
					<uv-input
						v-model="model.phone"
						type="number"
						border="none"
						placeholder="请输入手机号"
						:placeholderStyle="{ color: '#7C7C7C' }"
					>
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="idCard" label="身份证号" borderBottom>
					<uv-input
						v-model="model.idCard"
						type="idcard"
						border="none"
						placeholder="请输入身份证号"
						:placeholderStyle="{ color: '#7C7C7C' }"
					>
					</uv-input>
				</uv-form-item>
				<uv-form-item prop="recognition">
					<view class="flex recognition-box" @click="handleStartSoterAuthentication">
						<uni-icons
							custom-prefix="iconfont"
							type="icon-Gc_101_line-FaceRecognition"
							size="42rpx"
							color="#2D8AF8"
						/>
						<text style="margin-left: 10rpx;font-size: 28rpx;">请进行人脸识别</text>
						<view v-if="model.recognition" style="margin-left: 40rpx;"> 
							<text v-if="model.recognition === 'success'">
								<uni-icons
									type="checkmarkempty"
									size="30rpx"
									color="#2D8AF8"
								/>
							</text>
							<text v-else-if="model.recognition === 'fail'">
								<uni-icons
									type="closeempty"
									size="30rpx"
									color="#2D8AF8"
								/>
							</text>
						</view>
						<view class="arrow-wrap">
							<uni-icons type="right" size="20" color="#7c7c7c"></uni-icons>
						</view>
					</view>
				</uv-form-item>
			</uv-form>
			<view> 
				<uv-button
					type="primary"
					style="margin-top: 60rpx;"
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

const form = ref(null);
const model = ref({
	name: '',
	phone: '',
	idCard: '',
	recognition: '',
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
				if (v && v.length > 0) {
					c();
				} else {
					c(new Error('请进行人脸识别'));
				}
			},
			message: '请进行人脸识别',
			trigger: 'blur',
		},
	],
});

const handleSubmit = () => {
	form.value.validate((valid) => {
		if (valid) {
			uni.showToast({
				title: '提交成功',
				icon: 'success',
			});
		} else {
			uni.showToast({
				title: '表单填写有误',
				icon: 'error',
			});
		}
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
			// uni.showToast({
			// 	title: '人脸识别成功',
			// 	icon: 'success',
			// });
			handleBindUserInfo();
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
	bindUserAuth({
		name: model.value.name,
		mob_num: model.value.phone,
		car_id: model.value.idCard,
		open_id: uni.getStorageSync('b2cOpenid'),
	}).then((res) => {
		uni.setStorageSync('b2cAuth', res);
		if (!res || !res.responseInfos || res.responseInfos.code !== 'S200') {
			uni.showToast({
				title: '绑定失败',
				icon: 'error',
			});
			return;
		}
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
	}).catch((err) => {
		uni.showToast({
			title: err.message || '绑定失败',
			icon: 'error',
		});
	});
}
</script>
<style lang="scss">
.userAuth {
	.form-wrap {
		width: 90%;
		margin: 0 auto;
		.recognition-box{
			padding: 20rpx;
			color: #7C7C7C;
			border: 1px solid #E0E0E0;
			border-radius: 16rpx;
			width: 100%;
			margin-top: 10rpx;
			text-align: center;
			position: relative;
			.arrow-wrap{
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%) translateX(50%);
			}
		}
	}
}
</style>
