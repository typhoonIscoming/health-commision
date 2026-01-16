<template>
	<view class="home" :style="{width: '100%', paddingBottom: `${paddingBottom}px`}">
		<NavBar title="自治区二次补偿信息服务" :opacity="opacity" />
		<Background />
		<HomeCard @onClick="handleDetail" />
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
		<NoticeBar />
		<UserCard ref="userCardModel" />
		<Satisfaction />
		<view style="margin-top: 20px"></view>
		<Questionnaire />
		<view style="margin-top: 20px"></view>
		<Psychological />
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
import UserCard from '@/components/UserCard.vue';
import NoticeBar from '@/components/NoticeBar.vue';
import Psychological from '@/components/Psychological.vue';
import { isEmpty } from '@/utils';

const opacity = ref(0);
const notice = ref('需要关注公众号，才能获得推送消息');
const paddingBottom = ref(60);
const userCardModel = ref();


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

const handleDetail = () => {
	userCardModel.value?.open();
}
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
}
</style>
