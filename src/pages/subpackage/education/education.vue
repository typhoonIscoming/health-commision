<template>
	<view class="education-page">
		<view class="education-list">
			<view
				v-for="(item, i) in list"
				:key="i"
				class="list-item"
				@click="handleRoute(item)"
			>
				<view class="artical-content">
					<view class="artical-title">{{ item.wzbt }}</view>
					<view v-if="item.utime" class="artical-time">
						{{ item.utime }}
					</view>
				</view>
				<view
					v-if="mediaList(item.wztwsc).length"
					class="artical-img-wrap"
				>
					<swiper circular style="width: 100%; height: 100%">
						<swiper-item
							v-for="(media, index) in mediaList(item.wztwsc)"
							:key="index"
							style="width: 100%; height: 100%"
						>
							<image
								v-if="isImage(media.thumbnail_full_path)"
								:src="media.thumbnail_full_path"
								mode="aspectFill"
								class="artical-img"
								style="
									width: 100%;
									height: 100%;
									border-radius: 10rpx;
								"
							/>
							<video
								v-else-if="isVideo(media.DownloadUrl)"
								:src="media.DownloadUrl"
								controls
								class="artical-img"
								style="
									width: 100%;
									height: 100%;
									border-radius: 10rpx;
								"
							/>
						</swiper-item>
					</swiper>
				</view>
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

const { loading, getData } = educationHook();

const pageIndex = ref(0);
const pageSize = ref(10);
const loadStatus = ref('nomore');
const list = ref([]);

const getPageData = async (fresh) => {
	if (loading.value) return;
	loadStatus.value = 'loading';
	getData({ pageIndex: pageIndex.value, pageSize: pageSize.value })
		.then((res) => {
			loading.value = false;
			if (!res) {
				loadStatus.value = 'nomore';
				return;
			}
			const hasNextPage =
				Array.isArray(res) && res.length >= pageSize.value;
			loadStatus.value = hasNextPage ? 'loadmore' : 'nomore';
			if (hasNextPage) {
				pageIndex.value += 1;
			}
			let result = [];
			if (fresh) {
				result = res;
			} else {
				result = list.value.concat(res);
			}
			// 根据sfzd字段排在最前面，然后再根据fbrq日期字段排序
			list.value = result.sort((a, b) => {
				if (a.sfzd === '1' && b.sfzd !== '1') return -1;
				if (a.sfzd !== '1' && b.sfzd === '1') return 1;
				const dateA = new Date(a.fbrq).getTime();
				const dateB = new Date(b.fbrq).getTime();
				return dateB - dateA;
			});
		})
		.catch((err) => {
			loading.value = false;
			loadStatus.value = 'nomore';
			console.error(err);
		});
};

const handleRoute = (item) => {
	uni.navigateTo({
		url: `/pages/subpackage/publicize/publicize?rowid=${item.rowid}`,
	});
};

onMounted(() => {
	getPageData();
});
onReachBottom(() => {
	if (loadStatus.value === 'noMore') {
		return;
	}
	loadStatus.value = 'loading';
	getPageData();
});

onPullDownRefresh(() => {
	if (loading.value) return;
	pageIndex.value = 0;
	getPageData(true).finally(() => {
		uni.stopPullDownRefresh();
	});
});

const mediaList = (dataStr) => {
	const data = isJSON(dataStr) ? JSON.parse(dataStr) : [];
	return Array.isArray(data) ? data : [];
};
// 根据url地址判断是图片还是视屏
const isImage = (url) => {
	const result = /\.(jpg|jpeg|png|gif|bmp|webp)/i.test(url);
	return result;
};

const isVideo = (url) => {
	return /\.(mp4|avi|mov|wmv|flv|mkv)/i.test(url);
};
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
		.list-item {
			display: flex;
			border-radius: 10px;
			justify-content: space-between;
			padding: 20rpx;
			box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);
			& ~ .list-item {
				margin-top: 30rpx;
			}

			.artical-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}
			.artical-title {
				font-weight: 700;
				color: #3d3d3d;
				font-size: 28rpx;
			}
			.artical-time {
				color: #999999;
				font-size: 24rpx;
				margin-top: 20rpx;
			}
			.artical-img-wrap {
				width: 240rpx;
				height: 120rpx;
			}
		}
	}
}
</style>
