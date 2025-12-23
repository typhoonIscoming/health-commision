<template>
	<view class="news-item" @click="handleRoute">
		<view class="news-item-title">
			2024年自治区医疗保障局基金监管飞行检查启动会在乌鲁木齐市召开
		</view>
		<view class="news-author" style="margin-top: 10px">
			<text>作者：</text>
			<text>王培生</text>
		</view>
		<view class="news-source">
			<text>来源：</text>
			<text class="source">自治区医疗保障局</text>
		</view>
	</view>
</template>
<script setup>
const handleRoute = () => {
	uni.navigateTo({
		url: `/pages/subpackage/newsDetail/newsDetail`,
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
	.news-source {
		.source {
			color: #0f62fb;
		}
	}
}
</style>
