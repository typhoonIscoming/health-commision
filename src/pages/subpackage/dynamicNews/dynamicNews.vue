<template>
	<view class="dynamic-news">
		<view v-if="loading" class="loading-status">
			<uv-loading-page :loading="true" loading-text="加载中..." font-size="24rpx"></uv-loading-page>
		</view>
		<view v-else-if="!loading && !noticeList.length" class="empty-wrap">
			<view style="width:fit-content">
				<uv-icon name="empty-favor" size="60" color="#c4c6c9"></uv-icon>
			</view>
			<view class="empty-info">这里似乎空空如也~</view>
		</view>
		<view v-else class="news-list">
			<NewsItem v-for="(item, i) in noticeList" :key="i" :item="item" />
			<uv-load-more :status="loadStatus" @loadmore="getData" />
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import NewsItem from '@/components/NewsItem.vue';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import homeNoticebar from '@/hooks/home-noticebar';

const { noticeList, getList } = homeNoticebar();

const loadStatus = ref('');
const pageIndex = ref(1);
const pageSize = ref(5);
const loading = ref(false);

const getData = (fresh) => {
	if (loadStatus.value === 'noMore' || loading.value) {
		return;
	}
	loading.value = true;
	loadStatus.value = 'loading';
	getList({
		pageIndex: pageIndex.value,
		pageSize: pageSize.value,
		refresh: !!fresh,
	})
		.then((res) => {
			if (!isEmpty(res)) {
				const { total } = res;
				if (pageIndex.value * pageSize.value >= total) {
					loadStatus.value = 'noMore';
				} else {
					loadStatus.value = 'loadmore';
				}
				pageIndex.value = pageIndex.value + 1;
			} else {
				loadStatus.value = 'noMore';
			}
		})
		.finally(() => {
			loading.value = false;
			// uni.stopPullDownRefresh();
		});
};

onMounted(() => {
	pageIndex.value = 1;
	getData(true);
})

onPullDownRefresh(() => {
	pageIndex.value = 1;
	loadStatus.value = 'loadmore'
	getData(true).then(() => {
		uni.stopPullDownRefresh();
	})
});
onReachBottom(() => {
	getData();
});

</script>
<style lang="scss">
.dynamic-news {
	padding: 13px;
	.empty-wrap{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 100rpx;
	}
	.empty-info{
		color: #909399;
		text-align: center;
	}
}
</style>
