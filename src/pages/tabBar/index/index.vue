<template>
	<view class="home" :style="{width: '100%', paddingBottom: `${paddingBottom}px`}">
		<NavBar title="自治区二次补偿信息服务" :opacity="opacity" />
		<Background />
		<HomeCard />
		<view style="margin-bottom: 30rpx;position: relative;">
			<uv-notice-bar :text="notice"></uv-notice-bar>
		</view>
		<view class="satisfaction-wrapper page-gap card-radius flex-center">
			<view class="content flex-center">
				<text>服务完成满意度调查提醒</text>
				<view class="fill-btn">立即填写</view>
			</view>
			<text class="time">2025-12-01</text>
		</view>
		<HomeHealthRecord />
		<view class="publicize-wrapper page-gap card-radius flex-center">
			<view
				class="publicize-content flex-center"
				@click="handleRouteList"
			>
				<view class="type">宣传教育</view>
				<view class="title">2024年自治区医疗保障</view>
			</view>
			<text class="time">2025-12-01</text>
		</view>
		<Satisfaction />
		<view style="margin-top: 20px"></view>
		<Questionnaire />
		<Tabbar />
	</view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { onShow, onPageScroll, onLoad } from '@dcloudio/uni-app';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import NavBar from '@/components/NavBar.vue';
import Background from '@/components/Background.vue';
import HomeCard from '@/components/HomeCard.vue';
import HomeHealthRecord from '@/components/HomeHealthRecord';
import Satisfaction from '@/components/Satisfaction';
import Questionnaire from '@/components/Questionnaire.vue';
import Tabbar from '@/components/Tabbar.vue';
import { isEmpty } from '@/utils';

const opacity = ref(0);
const notice = ref('需要关注公众号，才能获得推送消息');
const paddingBottom = ref(60);

// 跳转新闻列表页面
const handleRouteList = () => {
	uni.navigateTo({
		url: `/pages/subpackage/dynamicNews/dynamicNews`,
	});
};

onMounted(() => {
	const sysInfo = uni.getWindowInfo();
	const { safeAreaInsets } = sysInfo;
	if (isEmpty(safeAreaInsets)) return;
	paddingBottom.value = paddingBottom.value + safeAreaInsets.bottom;
});

onPageScroll((e) => {
	const { scrollTop } = e;
	const result = Math.min(40, scrollTop);
	opacity.value = (result / 40).toFixed(1);
});
</script>

<style lang="scss">
.home {
	padding-bottom: 16px;
	.satisfaction-wrapper {
		margin-bottom: 40rpx;
		padding: 20rpx;
		background: white;
		position: relative;
		z-index: 1;
		.content {
			flex: 1;
		}
		.fill-btn {
			color: #2a82e4;
			margin-left: 20rpx;
		}
	}
	.publicize-wrapper {
		margin-top: 40rpx;
		margin-bottom: 40rpx;
		padding: 20rpx;
		background: #e8f3ff;
		.publicize-content {
			flex: 1;
			padding-right: 20rpx;
		}
		.type {
			margin-right: 10rpx;
		}
		.title {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>
