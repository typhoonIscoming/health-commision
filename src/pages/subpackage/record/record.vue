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
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="电话" prop="phone" borderBottom>
				<uv-input
					v-model="model.phone"
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="性别" prop="gender" borderBottom>
				<uv-input
					v-model="model.gender"
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="年龄" prop="age" borderBottom>
				<uv-input
					v-model="model.age"
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="生日" prop="birthday" borderBottom>
				<uv-input
					v-model="model.birthday"
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="职级年限" prop="rankYears" borderBottom>
				<uv-input
					v-model="model.rankYears"
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="记录状态" prop="recordStatus" borderBottom>
				<uv-input
					v-model="model.recordStatus"
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="人员状态" prop="personStatus" borderBottom>
				<uv-input
					v-model="model.personStatus"
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
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="待遇级别" prop="treatmentLevel" borderBottom>
				<uv-input
					v-model="model.treatmentLevel"
					border="none"
					inputAlign="right"
					color="#808080"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="卡类型" prop="cardType" borderBottom>
				<uv-input
					v-model="model.cardType"
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
				text="解除绑定"
				:custom-style="{ color: 'white', borderRadius: '6px' }"
				@click="handleUnbind"
			></uv-button>
		</view>
	</view>
</template>
<script setup>
import { ref, defineOptions } from 'vue';

defineOptions({
	options: {
		styleIsolation: 'shared',
	},
});

const recordForm = ref();
const model = ref({
	name: '张三',
	phone: '13415134375',
	gender: '男',
	age: '28',
	birthday: '1996-05-12',
	rankYears: '5',
	recordStatus: '正常',
	personStatus: '在职',
	civilServantLevel: '科员',
	treatmentLevel: '三级',
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
