<template>
	<view class="education-page">
		<view class="tab-wrap">
			<view
				v-for="(item, i) in typeList"
				:key="i"
				class="tab-item"
				:class="{ active: currentType === item.value }"
				@click="handleClick(item)"
			>
				<text>{{ item.label }}</text>
			</view>
		</view>
		<view class="education-list">
			<view
				v-for="(item, i) in list"
				:key="i"
				class="list-item"
				@click="handleRoute(item)"
			>
				<image
					v-if="currentType === 'image' && item.url"
					:src="item.url"
					mode="aspectFill"
					style="width: 120rpx; height: 120rpx; margin-right: 20rpx"
				/>
				<view class="item-detail">
					<view class="title">{{ item.name }}</view>
					<view class="time">{{ item.updateTime }}</view>
				</view>
			</view>
		</view>
		<uv-load-more :status="loadStatus" @loadmore="getPageData" />
	</view>
</template>
<script setup>
import { onMounted } from 'vue';
import educationHook from '@/hooks/education';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

const { list, getMaterialData } = educationHook();

const pageIndex = ref(0);
const pageSize = ref(10);
const currentType = ref('news');
const loadStatus = ref('nomore');
const loading = ref(false);

const typeList = ref([
	{ label: '新闻', value: 'news' },
	{ label: '图文', value: 'image' },
	{ label: '音频', value: 'voice' },
	{ label: '视频', value: 'video' },
]);

const handleClick = (item) => {
	if (loading.value) {
		return;
	}
	if (currentType.value !== item.value) {
		list.value = [];
		currentType.value = item.value;
	}
	pageIndex.value = 0;
	getData(true);
};

const getData = async (fresh) => {
	loading.value = true;
	loadStatus.value = 'loading';
	getMaterialData(
		{
			offset: pageIndex.value,
			count: pageSize.value,
			type: currentType.value,
		},
		fresh,
	).then((res) => {
		loading.value = false;
		if (!res) {
			loadStatus.value = 'nomore';
			return;
		}
		const { list: listData } = res;
		loadStatus.value =
			listData.length >= pageSize.value ? 'loadmore' : 'nomore';
	});
};

const getPageData = () => {
	getData();
};

const handleRoute = (item) => {
	uni.navigateTo({
		url: `/pages/subpackage/thridParty/thridParty?url=${item.url}`,
	});
};

onMounted(() => {
	getData();
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
.education-page {
	padding: 13px;
	.tab-wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.tab-item {
			padding: 10rpx 40rpx;
			background: #f4f4f5;
			&.active {
				background: #53c21d;
				color: white;
			}
		}
	}
	.education-list {
		margin-top: 40rpx;
		.list-item {
			padding: 20rpx;
			display: flex;
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
			border-radius: 10px;
			& ~ .list-item {
				margin-top: 40rpx;
			}
			.item-detail {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;
			}
		}
	}
}
</style>
