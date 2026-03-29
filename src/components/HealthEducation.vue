<template>
	<view>
		<view class="education page-gap">
			<TitleRow title="健康宣教">
				<view style="display: flex; align-items: center">
					<text style="color: #4a4a4a" @click="handleMore">
						更多
					</text>
					<uv-icon name="arrow-right" size="15"></uv-icon>
				</view>
			</TitleRow>
			<view class="education-wrap">
				<view
					v-for="(item, i) in list"
					:key="i"
					class="artical-item"
					@click="handleDetail(item)"
				>
					<view class="artical-title">{{ item.name }}</view>
					<view v-if="item.updateTime" class="artical-time">
						{{ item.updateTime }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import TitleRow from './Title.vue';
import educationHook from '../hooks/education';
import { onMounted } from 'vue';
// import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

const { list, getMaterialData } = educationHook();

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
.education {
	background: white;
	padding-top: 30rpx;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	border-radius: 20rpx;
	.education-wrap {
		padding: 20rpx;
	}
	.artical-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 20rpx 0;
		.artical-title {
			flex: 1;
			font-size: 28rpx;
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.artical-time {
			margin-left: 20rpx;
		}
	}
}
</style>
