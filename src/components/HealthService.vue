<template>
	<view>
		<view v-if="showContent" class="health-service page-gap">
			<view style="padding: 0">
				<TitleRow title="健康服务记录" />
			</view>
			<view
				v-if="false"
				class="health-service-content"
				@click="handleRoute"
			>
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
			<view
				class="service-list flex align-center justify-between"
				style="margin-top: 20rpx"
			>
				<view class="service-item" @click="handleRouteTip">
					<uv-icon :name="tips" size="60"></uv-icon>
					<text class="service-name">就医温馨提示</text>
				</view>
				<view class="service-item" @click="handleRouteAppoint">
					<uv-icon :name="tijianyuyue" size="60"></uv-icon>
					<text class="service-name">体检预约</text>
				</view>
				<view class="service-item" @click="handleRoute">
					<uv-icon :name="tijianbaogao" size="60"></uv-icon>
					<text class="service-name">体检报告</text>
					<view class="service-badge">
						<uv-badge
							color="#ffffff"
							bgColor="#FF5900"
							:customStyle="{ padding: '5px', fontSize: '14px' }"
							max="99"
							:value="tjNumber"
						></uv-badge>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import TitleRow from './Title.vue';
import homeCardFee from '@/hooks/homeCardFee';
import homeCardHook from '@/hooks/homeCard';
import tips from '../static/main/tips.png';
import tijianyuyue from '../static/main/tijianyuyue.png';
import tijianbaogao from '../static/main/tijianbaogao.png';

const { list: resultList } = homeCardFee(true);
const { tjbgNum } = homeCardHook(true);

const tjNumber = ref(0);
const showContent = ref(false);

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
const handleRouteTip = () => {
	uni.navigateTo({
		url: `/pages/subpackage/tips/tips`,
	});
};
const handleRouteAppoint = () => {
	uni.navigateTo({
		url: `/pages/tabBar/appointment/appointment`,
	});
};
onMounted(() => {
	// 获取体检报告数量
	checkLogin.checkAuthInfo(() => {
		showContent.value = true;
	});
});
</script>
<style lang="scss">
.health-service {
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	background: #ffffff;
	padding: 13px;
	border-radius: 20rpx;
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

	.service-list {
		.service-item {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			gap: 10rpx;
			flex: 1;
			position: relative;
			.service-name {
				font-size: 32rpx;
				color: #3d3d3d;
				margin-top: 10rpx;
				font-weight: 700;
			}
			.service-badge {
				position: absolute;
				top: 0;
				right: 20%;
				transform: translate(25%, -50%);
				z-index: 1;
				border: 2px solid #ffffff;
				border-radius: 20rpx;
			}
		}
	}
}
</style>
