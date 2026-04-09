<template>
	<view class="health-card page-gap">
		<Title title="健康科普">
			<view style="display: flex; align-items: center">
				<text style="color: #4a4a4a" @click="handleMore"> 更多 </text>
				<uv-icon name="arrow-right" size="15"></uv-icon>
			</view>
		</Title>
		<view class="education-wrap">
			<view
				v-for="(item, i) in mockList"
				:key="i"
				class="artical-item"
				@click="handleDetail(item)"
			>
				<view class="artical-content">
					<view class="artical-title">{{ item.name }}</view>
					<view v-if="item.updateTime" class="artical-time">
						{{ item.updateTime }}
					</view>
				</view>
				<view class="artical-img-wrap">
					<image
						:src="item.img"
						mode="aspectFill"
						class="artical-img"
						style="
							width: 200rpx;
							height: 120rpx;
							border-radius: 10rpx;
						"
					/>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref } from 'vue';
import Title from './Title.vue';
import educationHook from '@/hooks/education';

const { list, mockList, getMaterialData } = educationHook();

const pageIndex = ref(0);
const pageSize = ref(3);

onMounted(() => {
	getMaterialData({
		offset: pageIndex.value,
		count: pageSize.value,
		type: 'image', // image | news | voice | video
	});
});

const handleMore = () => {
	uni.navigateTo({ url: '/pages/subpackage/education/education' });
};

const handleDetail = (item) => {
	uni.navigateTo({
		// url: `/pages/subpackage/thridParty/thridParty?url=${item.url}`,
		url: `/pages/subpackage/publicize/publicize?url=${item.url}`,
	});
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
	}
}
</style>
