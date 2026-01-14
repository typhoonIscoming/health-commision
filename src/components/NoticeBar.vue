<template>
	<view class="publicize-wrapper page-gap">
		<view>
			<Title title="新闻公告">
				<text style="color: #4a4a4a" @click="handleMore">更多</text>
			</Title>
		</view>
		<view class="notice">
			<uv-notice-bar
				:text="notice"
				:icon="false"
				bgColor="#ffffff"
				color="#1c274c"
				direction="column"
				fontSize="13"
				@click="handleDetail"
			></uv-notice-bar>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import Title from './Title.vue';
import homeNoticebar from '@/hooks/home-noticebar';

const { noticeList, getList } = homeNoticebar();

const notice = computed(() => {
	return noticeList.value.map((item) => item.biaoti);
});

const loadStatus = ref('');
const pageIndex = ref(1);
const pageSize = ref(5);
const loading = ref(false);

const handleDetail = (i) => {
	const item = noticeList.value[i];
	uni.navigateTo({
		url: `/pages/subpackage/newsDetail/newsDetail?id=${item.rowid}`,
	});
};

const getData = (fresh) => {
	if (loadStatus.value === 'noMore') {
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
		});
};

const handleMore = () => {
	// 跳转新闻列表页面
	uni.navigateTo({
		url: `/pages/subpackage/dynamicNews/dynamicNews`,
	});
};

onMounted(() => {
	pageIndex.value = 1;
	getData();
});
</script>
<style lang="scss">
.publicize-wrapper {
	margin-top: 40rpx;
	margin-bottom: 40rpx;
	padding: 20rpx 0;
	// background: white;
	background: #e8f3ff;
	.notice {
		margin-top: 40rpx;
		padding: 0 20rpx;
	}
}
</style>
