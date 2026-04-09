<template>
	<view class="questionnaire question">
		<NavBar title="问卷调查" :bgImage="pageBg" :opacity="opacity">
			<template v-slot:left>
				<uv-icon
					name="arrow-left"
					size="20"
					@click="handleBack"
				></uv-icon>
			</template>
		</NavBar>
		<image
			:src="pageBg"
			mode="widthFix"
			class="page-bg__base"
			:style="{
				position: 'absolute',
				top: `${0}px`,
				left: 0,
				width: '100%',
			}"
		/>
		<!-- <Background /> -->
		<view class="question-header">
			<view class="header-content">
				<view style="display: flex; align-items: center">
					<uv-icon :name="evaluateIcon" size="20"></uv-icon>
					<text class="title" style="margin-left: 10rpx">
						{{ title }}
					</text>
				</view>
				<view class="desc flex-center">
					<text style="margin-right: 5px">
						感谢您的评价，我们会努力做到更好！
					</text>
					<!-- <uv-tags text="富有商服" size="mini"></uv-tags>
					<text style="margin-left: 5px">提供服务</text> -->
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
						<view style="width: 100%">
							<view>
								<template v-if="item.type === 9">
									<uv-radio-group
										v-model="model[item.alias]"
										placement="column"
										:disabled="disabled"
									>
										<uv-radio
											:customStyle="{ margin: '8px' }"
											v-for="(
												option, index
											) in item.options"
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
										:disabled="disabled"
									>
										<uv-checkbox
											:customStyle="{ margin: '8px' }"
											v-for="(
												option, index
											) in item.options"
											:key="index"
											:label="option.value"
											:name="option.value"
										></uv-checkbox>
									</uv-checkbox-group>
								</template>
								<template v-else-if="item.type === 2">
									<uv-textarea
										v-model="model[item.alias]"
										:disabled="disabled"
										placeholder="请输入内容"
									></uv-textarea>
								</template>
							</view>
							<view
								v-if="showInput(item.alias, model[item.alias])"
								class="reason"
								style="width: 100%; margin-top: 10px"
							>
								<uv-textarea
									v-model="model[`${item.alias}_other`]"
									:disabled="disabled"
									placeholder="请输入不满意原因"
								></uv-textarea>
							</view>
						</view>
					</uv-form-item>
				</view>
				<uv-button
					type="primary"
					text="提交"
					shape="circle"
					:color="disabled ? '#95C2AB' : '#58B384'"
					:disabled="disabled"
					customStyle="margin-top: 10px"
					@click="submit"
				></uv-button>
			</uv-form>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { onPageScroll, onLoad } from '@dcloudio/uni-app';
import NavBar from '@/components/NavBar.vue';
import Background from '@/components/Background.vue';
import { uuid, isEmpty } from '@/utils';
import satisfactionHook from '@/hooks/satisfactionHook';
import parseHtml from '@/utils/html-paser.js';
import questionBg from '@/static/main/evaluateBg.jpg';
import pageBg from '@/static/main/evaluateBg.png';
import evaluateIcon from '@/static/main/evaluateIcon.png';

const { addData, getWorksheet, getRowDetail } = satisfactionHook();

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
// 原始的表单配置
const originQuestionList = ref([]);

const rowId = ref('');

const openType = ref();

const disabled = computed(() => {
	if (openType.value === 'detail' || model.value['sftx'] == 1) {
		return true;
	}
	return false;
});

const handleBack = () => {
	uni.navigateBack();
};
const loading = ref(false);

const handleSubmit = async () => {
	const userInfo = uni.getStorageSync('b2cUserInfo');
	const data = questionList.value.map((item) => {
		let v = model.value[item.alias];
		if (item.alias === 'rywh') {
			v = userInfo.rowid;
		}
		// 如果当前type=9(单选)，如果选择的是不满意
		if (item.type === 9) {
			const findOption = item.options.find((oItem) => oItem.value === v);
			if (!isEmpty(findOption) && findOption.key === 'other') {
				// 查询填写的不满意原因
				const unlikereason = model.value[`${item.alias}_other`] || '';
				v = `${findOption.key}:${unlikereason}`;
			}
		}
		return {
			controlId: item.alias,
			value: Array.isArray(v) ? JSON.stringify(v) : v,
			valueType: 1,
		};
	});
	loading.value = true;
	const result = data.concat([{ controlId: 'sftx', value: 1 }]);
	const [err, res] = await to(addData(result, rowId.value));
	loading.value = false;
	if (err || !res) {
		uni.showToast({
			title: '提交失败',
			icon: 'error',
		});
		return;
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
// 判断是否显示当前不满意的输入框
const showInput = (alias, value) => {
	const findItem = originQuestionList.value.find(
		(item) => item.alias === alias,
	);
	if (!isEmpty(findItem) && !isEmpty(findItem.options)) {
		const isOther = findItem.options.find((item) => item.value === value);
		if (
			!isEmpty(isOther) &&
			(isOther.key === 'other' || isOther.value === '不满意')
		) {
			return true;
		}
	}
	return false;
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
	const result = controls
		.filter((item) => {
			const { type } = item;
			return [10, 9, 2].includes(type);
		})
		.map((item) => {
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
	originQuestionList.value = controls;
	// console.log('解析满意度调查表单', controls);
	return result;
};

onMounted(() => {
	getWorksheet().then((data) => {
		if (isEmpty(data)) {
			return;
		}
		const result = parseData(data);
		if (rowId.value) {
			getDetailData(rowId.value, result);
		}
	});
});

onPageScroll((e) => {
	const { scrollTop } = e;
	const result = Math.min(40, scrollTop);
	opacity.value = (result / 40).toFixed(1);
});

// 获取详细信息
const getDetailData = (id, config) => {
	getRowDetail(id).then((res) => {
		model.value = res.data;
		config.forEach((item) => {
			const { type, alias, options } = item;
			const v = res.data[alias];
			if (type === 9 && !isEmpty(v)) {
				// 如果当前的值不属于options
				const findItem = options.find((oItem) => oItem.value === v);
				const other = options.find((oItem) => oItem.key === 'other');
				const otherReg = '其他:';
				const real = v.indexOf(otherReg) > -1;
				if (isEmpty(findItem) && real) {
					// 如果当前值是[其他:***]
					// 那么就是选择的不满意
					model.value[alias] = other.value;
					model.value[`${alias}_other`] =
						v.slice(otherReg.length) || '';
				}
			}
		});
		// console.log('满意度调查的详细数据', res.data, config);
	});
};

onLoad((options) => {
	if (options.id) {
		rowId.value = options.id;
	}
	if (options.type) {
		openType.value = options.type;
	}
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
			color: #4e8a6c;
			margin-bottom: 10rpx;
			width: 6em;
			display: flex;
			align-items: center;
		}
		.desc {
			color: #7cb296;
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
		/* 重写样式 */
		.uv-radio-group {
			.uv-radio__icon-wrap {
				display: none;
				&.uv-radio__icon-wrap--disabled--checked
					+ .uv-radio__label-wrap {
					background: #c2e7d6;
				}
			}
			.uv-radio__label-wrap {
				padding: 8px;
				border-radius: 6px;
				background: #f3f3f3;
				text-align: center;
				color: #5b5b5b;
				border: 1px solid #e5e5e5;
				text {
					color: #5b5b5b !important;
				}
				&.uv-radio__label-wrap--active {
					border-color: #58b384;
					background: #e6f7f1;
				}
			}
		}
	}
}
</style>
