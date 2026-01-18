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
				<view class="title">{{ title }}</view>
				<view class="desc flex-center">
					<text style="margin-right: 5px">北极星</text>
					<uv-tags text="富有商服" size="mini"></uv-tags>
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
						v-if="item.show"
						:label="item.controlName"
						:prop="item.alias"
						:borderBottom="false"
						labelWidth="auto"
					>
						<template v-if="item.type === 9">
							<uv-radio-group
								v-model="model[item.alias]"
								placement="column"
							>
								<uv-radio
									:customStyle="{ margin: '8px' }"
									v-for="(option, index) in item.options"
									:key="index"
									:label="option.value"
									:name="option.value"
								>
								</uv-radio>
							</uv-radio-group>
						</template>
						<template v-else-if="item.type === 10">
							<uv-checkbox-group
								v-model="model[item.alias]"
								shape="square"
								placement="column"
							>
								<uv-checkbox
									:customStyle="{ margin: '8px' }"
									v-for="(option, index) in item.options"
									:key="index"
									:label="option.value"
									:name="option.value"
								></uv-checkbox>
							</uv-checkbox-group>
						</template>
						<template v-else-if="item.type === 2">
							<uv-textarea
								v-model="model[item.alias]"
								placeholder="请输入内容"
							></uv-textarea>
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
import satisfactionHook from '@/hooks/satisfactionHook';
import parseHtml from '@/utils/html-paser.js';

const { addData, getWorksheet } = satisfactionHook();

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

const title = ref('');

const questionList = ref([]);

const handleBack = () => {
	uni.navigateBack();
};
const loading = ref(false);

const handleSubmit = async () => {
	const userInfo = uni.getStorageSync('b2cUserInfo')
	const data = questionList.value.map((item) => {
		let v = model.value[item.alias];
		if (item.alias === 'rywh') {
			v = userInfo.rowid
		}
		return {
			controlId: item.alias,
			value: Array.isArray(v) ? JSON.stringify(v) : v,
		};
	});
	console.log('data', data)
	// return
	loading.value = true;
	const [err, res] = await to(addData(data));
	loading.value = false;
	if (err) {
		uni.showToast({
			title: '提交失败',
			icon: 'error',
		});
	}
	uni.showToast({
		title: '提交成功',
		icon: 'success',
	});
	setTimeout(() => {
		uni.navigateBack();
	}, 2000);
};
// 提交
const submit = () => {
	if (loading.value) {
		return;
	}
	questionForm.value
		.validate()
		.then((valid) => {
			if (valid) {
				handleSubmit();
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

function extractTextFromHtml(html) {
	const nodes = parseHtml(html);
	let result = '';
	function walk(nodes) {
		nodes.forEach((node) => {
			if (node.type === 'text') {
				result += node.text.replace(/\u00a0/g, ''); // 去除 &nbsp;
			}
			if (node.children) {
				walk(node.children);
			}
		});
	}
	walk(nodes);
	return result
		.replace(/\s*\n\s*/g, '\n')
		.replace(/\&nbsp;/g, '')
		.trim();
}
const parseData = (config) => {
	const { controls, name } = config;
	title.value = name;
	const result = controls.map((item) => {
		const { alias, type, dataSource } = item;
		// 是否需要显示
		// 不显示的字段[问卷模板名称, 模板日期]
		const noShowAlias = ['wjmbmc', 'mbrq', 'rywh'];
		const show = !noShowAlias.includes(alias);
		// 是否是编辑字段
		const edit = type !== 10010; // 10010可以当做是label
		// 是否是多选
		return {
			id: uuid(),
			...item,
			controlName:
				type === 10010
					? extractTextFromHtml(dataSource)
					: item.controlName,
			show,
			edit,
			multiple: type === 10,
		};
	});
	questionList.value = result;
};

onMounted(() => {
	getWorksheet().then((data) => {
		if (isEmpty(data)) {
			return;
		}
		parseData(data);
	});
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
			padding: 10px;
			.uv-line {
				display: none;
			}
		}
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
	}
}
</style>
