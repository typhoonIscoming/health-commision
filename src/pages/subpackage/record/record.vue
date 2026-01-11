<template>
	<view class="record">
		<uv-form
			labelPosition="left"
			:model="model"
			:rules="rules"
			labelWidth="auto"
			ref="recordForm"
		>
			<uv-form-item label="姓名" prop="name" borderBottom>
				<uv-input
					v-model="model.name"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="电话" prop="phone" borderBottom>
				<uv-input
					v-model="model.phone"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="性别" prop="gender" borderBottom>
				<uv-input
					v-model="model.gender"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="年龄" prop="age" borderBottom>
				<uv-input
					v-model="model.age"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="身份证号" prop="idCard" borderBottom>
				<uv-input
					v-model="model.idCard"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="生日" prop="birthday" borderBottom>
				<uv-input
					v-model="model.birthday"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="职级年限" prop="rankYears" borderBottom>
				<uv-input
					v-model="model.rankYears"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="记录状态" prop="recordStatus" borderBottom>
				<uv-input
					v-model="model.recordStatus"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="人员状态" prop="personStatus" borderBottom>
				<uv-input
					v-model="model.personStatus"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item
				label="公务员级别"
				prop="civilServantLevel"
				borderBottom
			>
				<uv-input
					v-model="model.civilServantLevel"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="待遇级别" prop="treatmentLevel" borderBottom>
				<uv-input
					v-model="model.treatmentLevel"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="卡类型" prop="cardType" borderBottom>
				<uv-input
					v-model="model.cardType"
					readonly
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
		</uv-form>
		<view class="button-wrapper" style="padding: 20px">
			<uv-button
				type="primary"
				:plain="false"
				hairline
				text="退出登录"
				:custom-style="{ color: 'white', borderRadius: '6px' }"
				@click="handleUnbind"
			></uv-button>
		</view>
	</view>
</template>
<script setup>
import { onShow } from '@dcloudio/uni-app';
import { ref, defineOptions } from 'vue';

defineOptions({
	options: {
		styleIsolation: 'shared',
	},
});

const recordForm = ref();
const model = ref({
	name: '',
	phone: '',
	gender: '',
	age: '',
	birthday: '',
	rankYears: '',
	recordStatus: '',
	personStatus: '',
	civilServantLevel: '',
	treatmentLevel: '',
	idCard: '',
	cardType: '二次补偿卡',
});
const rules = ref({});

// 解除绑定
const handleUnbind = () => {
	uni.setStorageSync('b2cAuth', null);
	uni.setStorageSync('b2cToken', null);
	uni.showToast({
		title: '绑定已解除',
		icon: 'none',
		duration: 2000,
		complete: () => {
			uni.reLaunch({
				url: '/pages/tabBar/index/index',
			});
		},
	});
}
// 获取用户信息
const fetchUserInfo = () => {
	const auth = uni.getStorageSync('b2cAuth') || {};
	model.value.name = auth.name || '';
	model.value.phone = auth.mob_num || '';
	model.value.age = auth.age || '';
	model.value.gender = auth.sex || '';
	// 生日优先取auth.birthday，否则根据car_id推算
	let birthday = auth.birthday;
	if (!birthday && auth.car_id) {
		const id = auth.car_id + '';
		if (id.length === 18) {
			birthday = id.substring(6, 10) + '-' + id.substring(10, 12) + '-' + id.substring(12, 14);
		} else if (id.length === 15) {
			birthday = '19' + id.substring(6, 8) + '-' + id.substring(8, 10) + '-' + id.substring(10, 12);
		}
	}
	model.value.birthday = birthday || '';
	model.value.rankYears = auth.zjnx || '';
	model.value.recordStatus = auth.jlzt || '';
	model.value.personStatus = auth.ryzt || '';
	model.value.civilServantLevel = auth.gwyjb || '';
	model.value.treatmentLevel = auth.dyjb || '';
	model.value.idCard = auth.car_id || '';
	console.log('用户信息：', auth, model.value);
}

onShow(() => {
	fetchUserInfo();
});
</script>
<style lang="scss">
.record {
	.uv-form-item {
		background: white;
		padding: 0 10px;
	}
	.uv-form-item__body {
		padding-left: 10px;
		padding-right: 10px;
	}
	.uv-form-item__body__left__content__label {
		color: #000000;
	}
}
</style>
