<template>
	<view class="dynamic-news">
		<view class="news-list">
			<NewsItem />
			<NewsItem />
			<NewsItem />
		</view>
		<uv-load-more :status="loadStatus" @loadmore="getData" />
	</view>
</template>
<script setup>
import { ref } from 'vue';
import NewsItem from '@/components/NewsItem.vue';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

const loadStatus = ref('noMore');

const getData = () => {
	console.log('加载更多数据');
	setTimeout(() => {
		loadStatus.value = 'noMore';
	}, 1500);
};

onPullDownRefresh(() => {
	console.log('下拉刷新数据');
	setTimeout(() => {
		uni.stopPullDownRefresh();
	}, 1500);
});
onReachBottom(() => {
	if (loadStatus.value === 'noMore') {
		return;
	}
	loadStatus.value = 'loading';
	getData();
});
</script>
<style lang="scss">
.dynamic-news {
	padding: 13px;
}
</style>
