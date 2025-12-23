<template>
	<view class="questionnaire question">
		<NavBar title="问卷调查" :opacity="opacity">
			<template v-slot:left>
				<uv-icon
					name="arrow-left"
					size="20"
					@click="handleBack"
				></uv-icon>
			</template>
		</NavBar>
		<Background />
		<view class="question-header">
			<view class="header-content">
				<view class="title">新冠肺炎防控调查问卷</view>
				<view class="desc flex-center">
					<text style="margin-right: 5px">北极星</text>
					<uv-tags text="富有商服" size="mini"></uv-tags>
				</view>
				<view style="color: rgba(0, 0, 0, 0.6); margin-top: 10px">
					2025-12-08 12:30:45
				</view>
			</view>
		</view>
		<view class="form-wrapper" v-if="questionList.length">
			<uv-form
				:model="model"
				:rules="rules"
				labelPosition="top"
				ref="questionForm"
			>
				<view
					v-for="(item, i) in questionList"
					:key="item.id"
					:id="item.id"
				>
					<uv-form-item
						:label="i + 1 + '、' + item.question"
						:prop="item.key"
						borderBottom
					>
						<template v-if="item.type === 'radio'">
							<uv-radio-group
								v-model="model[item.key]"
								placement="column"
							>
								<uv-radio
									:customStyle="{ margin: '8px' }"
									v-for="(option, index) in item.options"
									:key="index"
									:label="option"
									:name="option"
								>
								</uv-radio>
							</uv-radio-group>
						</template>
						<template v-else-if="item.type === 'checkbox'">
							<uv-checkbox-group
								v-model="model[item.key]"
								shape="circle"
								placement="column"
							>
								<uv-checkbox
									:customStyle="{ margin: '8px' }"
									v-for="(option, index) in item.options"
									:key="index"
									:label="option"
									:name="option"
								></uv-checkbox>
							</uv-checkbox-group>
						</template>
					</uv-form-item>
				</view>
				<uv-button
					type="primary"
					text="提交"
					customStyle="margin-top: 10px"
					@click="submit"
				></uv-button>
			</uv-form>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import NavBar from '@/components/NavBar.vue';
import Background from '@/components/Background.vue';
import { uuid, isEmpty } from '@/utils';

const normal = {
	trigger: 'change',
	validator: (_, v, c) => {
		if (isEmpty(v) || (Array.isArray(v) && v.length === 0)) {
			c(new Error('请选择内容'));
		} else {
			c();
		}
	},
};
const opacity = ref(0);

const questionForm = ref();
const model = ref({});
const rules = ref({});

const temp = [
	{
		id: uuid(),
		question:
			'您对门诊服务服务台人员的服务效率和服务态度是否满意？（单选）',
		type: 'radio',
		options: ['非常满意', '满意', '一般', '不满意', '非常不满意'],
		key: 'efficiency',
	},
	{
		id: uuid(),
		question: '您对这里看病过程，等候或者排队的时间满意吗？（单选）',
		type: 'radio',
		options: ['满意', '一般', '不满意'],
		key: 'waitingTime',
	},
	{
		id: uuid(),
		question: '您对门诊挂号处人员的服务效率和服务态度是否满意（多选）',
		type: 'checkbox',
		options: ['非常满意', '满意', '一般', '不满意', '非常不满意'],
		key: 'outpatient',
	},
];
const questionList = ref([]);

const handleBack = () => {
	uni.navigateBack();
};

// 提交
const submit = () => {
	console.log('提交问卷内容：', model.value);
	questionForm.value
		.validate((valid) => {
			console.log('验证结果：', valid);
			if (valid) {
				uni.showToast({
					title: '提交成功',
					icon: 'success',
				});
			}
		})
		.catch((err) => {
			if (isEmpty(err)) return;
			const firstError = err[0];
			if (!firstError) return;
			const findItem = questionList.value.find(
				(item) => item.key === firstError.field,
			);
			if (isEmpty(findItem)) return;
			wx.pageScrollTo({
				selector: `#${findItem.id}`,
				offsetTop: -100,
			});
			// uni.showToast({
			// 	title: '请完善问卷内容',
			// 	icon: 'none',
			// });
		});
};

onMounted(() => {
	setTimeout(() => {
		questionList.value = temp;
		temp.forEach((item) => {
			rules.value[item.key] = [normal];
			model.value[item.key] = item.type === 'checkbox' ? [] : '';
		});
		console.log('问卷调查页面加载完成', model.value);
	}, 500);
});

onPageScroll((e) => {
	const { scrollTop } = e;
	const result = Math.min(40, scrollTop);
	opacity.value = (result / 40).toFixed(1);
});
</script>
<style lang="scss">
.question {
	padding-bottom: env(safe-area-inset-bottom);
	&-header {
		min-height: 200rpx;
		padding: 15px;
		.title {
			font-size: 40rpx;
			font-weight: bold;
			color: #333333;
			margin-bottom: 10rpx;
			width: 6em;
		}
	}
	.form-wrapper {
		padding: 15px;
		.uv-form-item {
			background: #ffffff;
			border-radius: 8px;
			margin-bottom: 20rpx;
			padding-bottom: 10px;
			overflow: hidden;
			.uv-form-item__body {
				padding-bottom: 0;
			}
			.uv-form-item__body__right__message {
				margin-left: 10px !important;
			}
			.uv-form-item__body__left {
				width: 100% !important;
				padding-left: 10px;
				padding-right: 10px;
			}
			.uv-form-item__body__left__content {
				padding-right: 0% !important;
			}
			.uv-line {
				display: none;
			}
		}
	}
}
</style>
