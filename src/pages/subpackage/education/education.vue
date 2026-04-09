<template>
	<view class="education-page">
		<view v-if="false" class="tab-wrap">
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
				v-for="(item, i) in mockList"
				:key="i"
				class="list-item"
				@click="handleRoute(item)"
			>
				<view class="item-detail">
					<view class="title">{{ item.name }}</view>
					<view class="time">{{ item.updateTime }}</view>
				</view>
				<image
					v-if="item.img"
					:src="item.img"
					mode="aspectFill"
					style="width: 200rpx; height: 120rpx; margin-right: 20rpx"
				/>
			</view>
		</view>
		<view style="margin-top: 40rpx">
			<uv-load-more :status="loadStatus" @loadmore="getPageData" />
		</view>
	</view>
</template>
<script setup>
import { onMounted } from 'vue';
import educationHook from '@/hooks/education';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

const { list, mockList, getMaterialData } = educationHook();

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
	// uni.navigateTo({
	// 	url: `/pages/subpackage/thridParty/thridParty?url=${item.url}`,
	// });
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
		margin-bottom: 40rpx;
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
		box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		padding: 20rpx;
		.list-item {
			display: flex;
			padding-bottom: 30rpx;
			border-bottom: 1px solid #f0f0f0;
			& ~ .list-item {
				margin-top: 30rpx;
			}
			.item-detail {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				.title {
					font-weight: 700;
					color: #3d3d3d;
					font-size: 28rpx;
				}
				.time {
					color: #999999;
					font-size: 24rpx;
					margin-top: 20rpx;
				}
			}
		}
	}
}
</style>
