<template>
	<view class="font-size-adjuster" :style="fontStyle">
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
import { computed } from 'vue';
import useFontSizeStore, { FONT_SIZE_OPTIONS } from '@/store/fontSize';

const fontSizeStore = useFontSizeStore();
const options = FONT_SIZE_OPTIONS;
const selected = computed(() => fontSizeStore.selected);
const currentLabel = computed(
	() => options.find((item) => item.key === selected.value)?.label || '正常',
);
const fontStyle = computed(() => fontSizeStore.fontStyle);

const handleSelect = (key) => {
	fontSizeStore.setFontSize(key);
};
</script>

<style lang="scss" scoped>
.font-size-adjuster {
	padding: 20rpx 16px;
	margin: 20rpx 16px 0;
	background: rgba(255, 255, 255, 0.92);
	border-radius: 18rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
	font-size: var(--app-font-size-text, 13px);
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
	font-size: var(--app-font-size-subtitle, 14px);
	font-weight: 600;
}

.font-size-current {
	color: #58b383;
	font-size: var(--app-font-size-tip, 12px);
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
	font-size: var(--app-font-size-tip, 12px);
	transition: all 0.2s ease;
}

.font-size-option.active {
	background: rgba(88, 179, 131, 0.12);
	border-color: #58b383;
	color: #58b383;
	font-weight: 600;
}
</style>
