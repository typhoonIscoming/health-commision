<template>
	<view>
		<view v-if="loading || list.length !== 0" class="health-card page-gap">
			<Title title="健康科普">
				<view style="display: flex; align-items: center">
					<text style="color: #4a4a4a" @click="handleMore">
						更多
					</text>
					<uv-icon name="arrow-right" size="15"></uv-icon>
				</view>
			</Title>
			<view class="education-wrap">
				<view
					v-for="(item, i) in sortedList"
					:key="i"
					class="artical-item"
					@click="handleDetail(item)"
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
								<Video
									v-else-if="isVideo(media.DownloadUrl)"
									:src="media.DownloadUrl"
									:controls="false"
									:show-play-btn="false"
									:show-center-play-btn="false"
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
		</view>
	</view>
</template>
<script setup>
import { onMounted, computed } from 'vue';
import Title from './Title.vue';
import educationHook from '@/hooks/education';
import Video from '@/components/Video.vue';
import { isJSON } from '@/utils';

const { list, loading, getData } = educationHook();

// 对liest进行排序且最多5条数据
const sortedList = computed(() => {
	const result = [...list.value].sort((a, b) => {
		if (a.sfzd === '1' && b.sfzd !== '1') return -1;
		if (a.sfzd !== '1' && b.sfzd === '1') return 1;
		const dateA = new Date(a.fbrq).getTime();
		const dateB = new Date(b.fbrq).getTime();
		return dateB - dateA;
	});
	return result.slice(0, 5);
});

onMounted(() => {
	getData();
});

const handleMore = () => {
	uni.navigateTo({ url: '/pages/subpackage/education/education' });
};

const handleDetail = (item) => {
	uni.navigateTo({
		// url: `/pages/subpackage/thridParty/thridParty?url=${item.url}`,
		url: `/pages/subpackage/publicize/publicize?rowid=${item.rowid}`,
	});
};

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
.health-card {
	min-height: 200rpx;
	background: #ffffff;
	padding: 13px;
	border-radius: 20rpx;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	.artical-item {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0 10rpx;
		border-bottom: 1px solid #f0f0f0;
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
</style>
