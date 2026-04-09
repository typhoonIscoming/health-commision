<template>
	<view class="health-service page-gap">
		<view style="padding: 0 13px">
			<TitleRow title="健康服务记录" />
		</view>
		<view class="health-service-content" @click="handleRoute">
			<view class="health-title">体检报告</view>
			<view class="health-number">共有 {{ tjNumber }} 份报告</view>
			<image
				src="@/static/card/report1.png"
				mode="aspectFit"
				class="report-icon"
			/>
			<image
				src="@/static/card/report-people.png"
				mode="aspectFit"
				class="report-people"
			/>
		</view>
	</view>
</template>
<script setup>
import { ref, watch } from 'vue';
import TitleRow from './Title.vue';
import homeCardFee from '@/hooks/homeCardFee';
import homeCardHook from '@/hooks/homeCard';

const { list: resultList } = homeCardFee(true);
const { tjbgNum } = homeCardHook(true);

const tjNumber = ref(0);

watch(
	() => [tjbgNum.value, resultList.value],
	(list) => {
		tjNumber.value = list[0];
		// service.value = service.value.map((item) => {
		// 	if (item.name === 'tj') {
		// 		return { ...item, count: list[0] };
		// 	}
		// 	const oItem = list[1].find((fItem) => fItem.name === item.name);
		// 	return { ...item, count: oItem.count };
		// });
	},
	{ deep: true, immediate: true },
);

const handleRoute = () => {
	checkLogin.checkAuthInfo(() => {
		uni.navigateTo({
			url: `/pages/subpackage/physicalExamination/physicalExamination?type=tj`,
		});
	});
};
</script>
<style lang="scss">
.health-service {
	.health-service-content {
		background: #4dc9cb url('@/static/card/report.png') no-repeat center;
		background-size: contain;
		background-position-x: 60%;
		padding: 13px 20px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 20rpx;
		margin-top: 13px;
		min-height: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		.health-title {
			color: #ffffff;
			font-size: 36rpx;
		}
		.health-number {
			color: #ffffff;
			font-size: 28rpx;
			margin-top: 20rpx;
		}
		.report-icon {
			position: absolute;
			right: 120rpx;
			bottom: 20rpx;
			width: 180rpx;
			height: 180rpx;
		}
		.report-people {
			position: absolute;
			right: 10rpx;
			bottom: 20rpx;
			width: 200rpx;
			height: 260rpx;
		}
	}
}
</style>
