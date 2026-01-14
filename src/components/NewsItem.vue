<template>
	<view class="news-item" @click="handleRoute">
		<view class="news-item-title">
			{{ info.biaoti }}
		</view>
		<view class="news-author" style="margin-top: 10px">
			<text>作者：</text>
			<text style="color: #0f62fb">{{ info.faburen }}</text>
		</view>
		<view class="news-source">
			<text>发布时间：</text>
			<text class="source">{{ info.fbrq }}</text>
		</view>
	</view>
</template>
<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
	item: {
		type: Object,
		default: () => ({})
	},
});

const info = computed(() => props.item)

const handleRoute = () => {
	uni.navigateTo({
		url: `/pages/subpackage/newsDetail/newsDetail?id=${info.value.rowid}`,
	});
};
</script>
<style lang="scss">
.news-item {
	border-radius: 6px;
	padding: 20rpx;
	background: #fff;
	margin-top: 20rpx;
	&-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #121212;
	}
}
</style>
