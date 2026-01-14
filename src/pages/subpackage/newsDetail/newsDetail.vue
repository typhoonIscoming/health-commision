<template>
	<view class="news-detail">
		<view v-if="loading" class="loading-status">
			<uv-loading-page :loading="true" loading-text="加载中..." font-size="24rpx"></uv-loading-page>
		</view>
		<view v-else-if="!news" class="empty-wrap flex-col" @click="handleReload">
			<view style="width:fit-content">
				<uv-icon name="empty-favor" size="60" color="#c4c6c9"></uv-icon>
			</view>
			<view class="empty-info">未查询到详细信息！</view>
		</view>
		<view v-else class="news-wrapper">
			<view class="news-title">
				{{ news.biaoti }}
			</view>
			<view class="news-author">
				<text style="margin-right: 0;">发布人：</text>
				<text style="margin-right: 20rpx;color: #0f62fb">{{ news.faburen }}</text>
				<text style="margin-right: 0;">发布时间：</text>
				<text>{{ news.fbrq }}</text>
			</view>
			<view class="news-content">
				{{ news.nrms }}
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getRowById } from '@/api';
import { to } from '@/utils';
import constants from '@/utils/constants';

const news = ref();
const loading = ref(false);
const rowId = ref();

const getData = async(rowid) => {
	const params = {
		appKey: constants.appKey,
		sign: constants.sign,
		worksheetId: 'ggxxgl',
		rowId: rowid,
	}
	loading.value = true;
	const [err, res] = await to(getRowById(params));
	loading.value = false;
	if (err || !res.success) {
		return
	}
	news.value = res.data;
}

const handleReload = () => {
	if (rowId.value && !news.value && !loading.value) {
		getData(rowId.value)
	}
}

onLoad((options) => {
	if (options.id) {
		rowId.value = options.id;
		getData(options.id)
	}
})
onPullDownRefresh(() => {
	if (rowId.value) {
		getData(rowId.value).finally(() => {
			uni.stopPullDownRefresh();
		})
	}
});
</script>
<style lang="scss">
.news-detail {
	padding: 13px;
	.news-title {
		font-size: 34rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.news-author {
		margin-bottom: 40rpx;
		color: #767a82;
		display: flex;
		align-items: center;
	}
	.news-content {
		text-indent: 2em;
		line-height: 1.8;
		font-size: 28rpx;
	}

	.empty-wrap{
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
