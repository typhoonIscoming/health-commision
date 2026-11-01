<template>
	<view class="font-size-adjuster" :style="panelStyle">
		<view class="font-size-header">
			<text class="font-size-title">页面字体</text>
			<text class="font-size-current">{{ currentLabel }}</text>
		</view>
		<view class="font-size-options">
			<view
				v-for="item in options"
				:key="item.key"
				class="font-size-option"
				:class="{ active: item.key === selected }"
				@click="handleSelect(item.key)"
			>
				<text>{{ item.label }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue';

const STORAGE_KEY = 'health-commision-font-size';
const options = [
	{
		key: 'extra-large',
		label: '特大号',
		sizes: {
			title: '20px',
			subtitle: '18px',
			text: '16px',
			tip: '15px',
		},
	},
	{
		key: 'large',
		label: '大号',
		sizes: {
			title: '18px',
			subtitle: '16px',
			text: '15px',
			tip: '14px',
		},
	},
	{
		key: 'medium',
		label: '中号',
		sizes: {
			title: '16px',
			subtitle: '15px',
			text: '14px',
			tip: '13px',
		},
	},
	{
		key: 'normal',
		label: '正常',
		sizes: {
			title: '15px',
			subtitle: '14px',
			text: '13px',
			tip: '12px',
		},
	},
	{
		key: 'small',
		label: '小',
		sizes: {
			title: '13px',
			subtitle: '12px',
			text: '11px',
			tip: '10px',
		},
	},
];

const emit = defineEmits(['change']);
const getSavedKey = () => {
	const savedKey = uni.getStorageSync(STORAGE_KEY);
	return options.some((item) => item.key === savedKey) ? savedKey : 'normal';
};
const selected = ref(getSavedKey());
const currentConfig = computed(
	() => options.find((item) => item.key === selected.value) || options[3],
);
const currentLabel = computed(() => currentConfig.value.label);
const panelStyle = computed(() => ({
	'--font-size-title': currentConfig.value.sizes.title,
	'--font-size-subtitle': currentConfig.value.sizes.subtitle,
	'--font-size-text': currentConfig.value.sizes.text,
	'--font-size-tip': currentConfig.value.sizes.tip,
}));

const handleSelect = (key) => {
	selected.value = key;
	console.log('handleSelect', key);
	uni.setStorageSync(STORAGE_KEY, key);
	emit('change', currentConfig.value);
};

emit('change', currentConfig.value);
</script>

<style lang="scss" scoped>
.font-size-adjuster {
	padding: 20rpx 16px;
	margin: 20rpx 16px 0;
	background: rgba(255, 255, 255, 0.92);
	border-radius: 18rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
	font-size: var(--font-size-text);
	position: relative;
	z-index: 999;
}

.font-size-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.font-size-title {
	color: #333;
	font-size: var(--font-size-subtitle);
	font-weight: 600;
}

.font-size-current {
	color: #58b383;
	font-size: var(--font-size-tip);
}

.font-size-options {
	display: flex;
	gap: 12rpx;
	flex-wrap: wrap;
}

.font-size-option {
	flex: 1;
	min-width: 100rpx;
	padding: 16rpx 10rpx;
	border: 1px solid #e4e6eb;
	border-radius: 12rpx;
	text-align: center;
	background: #f7f7f7;
	color: #666;
	font-size: var(--font-size-tip);
	transition: all 0.2s ease;
}

.font-size-option.active {
	background: rgba(88, 179, 131, 0.12);
	border-color: #58b383;
	color: #58b383;
	font-weight: 600;
}
</style>
