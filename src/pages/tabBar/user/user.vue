<template>
	<view
		class="user"
		:style="{
			backgroundImage: `url(${navBg})`,
			backgroundSize: '100% auto',
			backgroundRepeat: 'no-repeat',
			backgroundPositionY: `${0}px`,
			paddingBottom: `${safeInsetBottom}px`,
		}"
	>
		<NavBar :bgImage="navBg">
			<template #left>
				<text class="nav-title" style="color: #fff">新疆保健服务</text>
			</template>
		</NavBar>
		<image
			:src="navBg"
			mode="widthFix"
			class="page-bg__base"
			:style="{
				position: 'absolute',
				top: `${0}px`,
				left: 0,
				width: '100%',
			}"
		/>
		<view class="user-info-wrap">
			<HomeCard theme="light" />
		</view>
		<view class="entry-wrapper">
			<view class="menus-wrapper">
				<uv-list>
					<uv-list-item
						v-for="(item, i) in menus"
						:key="i"
						clickable
						:border="i !== 0"
						show-arrow
						:thumb="item.icon"
						:title="item.name"
						@click="handleRoute(item.label)"
					>
						<template #header>
							<view
								class="service-row-icon"
								style="margin-right: 20rpx"
							>
								<image
									:src="item.iconName"
									mode="aspectFit"
									style="width: 40rpx; height: 40rpx"
								/>
							</view>
						</template>
						<template #footer>
							<view
								style="
									display: flex;
									align-items: center;
									justify-content: flex-end;
									color: #a7a7a7;
								"
							>
								{{ item.desc }}
							</view>
						</template>
					</uv-list-item>
				</uv-list>
			</view>
		</view>
		<Tabbar current-tab="userTab" />
	</view>
</template>
<script setup>
import { ref, computed, defineOptions } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import NavBar from '@/components/NavBar.vue';
import HomeCard from '@/components/HomeCard.vue';
import Tabbar from '@/components/Tabbar.vue';
import { isEmpty, to, checkLogin } from '@/utils';
import navBg from '@/static/home/home-bg.png';

import beianxinxi from '@/static/home/beianxinxi.png';
import wodepingjia from '@/static/home/wodepingjia.png';
import wodeyuyue from '@/static/home/wodeyuyue.png';

defineOptions({
	options: {
		styleIsolation: 'shared',
	},
});
const userInfo = ref(null);

const menus = ref([
	{
		name: '备案信息',
		desc: '完善个人信息',
		label: 'record',
		icon: 'beianxinxi',
		color: '#FDA062',
		iconName: beianxinxi,
	},
	{
		name: '我的评价',
		desc: '查看我的历史评价',
		label: 'evaluate',
		icon: 'pingjia',
		color: '#67B5F9',
		iconName: wodepingjia,
	},
	// {
	// 	name: '我的问卷',
	// 	desc: '查看历史问卷调查',
	// 	label: 'questionnaire',
	// 	icon: 'wodewenjuan',
	// 	color: '#4ACF9E',
	// },
	{
		name: '我的预约',
		desc: '查看我的预约',
		label: 'reservation',
		icon: 'wodeyuyue',
		color: '#FC668B',
		iconName: wodeyuyue,
	},
]);

const handleRoute = (type) => {
	const routeMap = {
		record: '/pages/subpackage/record/record',
		evaluate: '/pages/subpackage/evaluate/evaluate',
		questionnaire: '/pages/subpackage/questionnaire/questionnaire',
		reservation: '/pages/subpackage/reservation/reservation',
	};
	const route = routeMap[type];
	checkLogin.checkAuthInfo(() => {
		if (route) {
			uni.navigateTo({ url: route });
		}
	});
};

const handleOnShow = () => {
	// 可以在这里获取和更新用户信息
	const auth = uni.getStorageSync('b2cAuth');
	if (isEmpty(auth)) {
		userInfo.value = null;
		return;
	}
	userInfo.value = auth;
};
const safeInsetBottom = ref(0);
onBeforeMount(() => {
	const systemInfo = uni.getSystemInfoSync();
	// #ifdef MP-WEIXIN
	safeInsetBottom.value = systemInfo.safeAreaInsets.bottom + 51;
	// #endif
});

onShow(() => {
	// 可以在这里获取和更新用户信息
	handleOnShow();
});
</script>
<style lang="scss">
.user {
	min-height: 100vh;
	.user-info-wrap {
		padding: 10rpx 16px;
		position: relative;
		z-index: 9999;
		.no-user-info {
			background: rgba(255, 255, 255, 0.5);
		}
	}
	.entry-wrapper {
		margin: 0 16px;
		margin-top: 20rpx;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 20rpx;
		overflow: hidden;
		.uv-line {
			display: none;
		}
		.uv-list-item__container {
			padding-right: 0 !important;
		}
		.uv-list-item__container {
			padding-right: 0 !important;
		}
		.service-row-icon {
			width: 55rpx;
			height: 55rpx;
			border-radius: 50%;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
			&.record {
				font-size: 38rpx;
				background: linear-gradient(to bottom, #ff6168, #fe8489);
			}
			&.evaluate {
				background: linear-gradient(to bottom, #67b9e0, #54d2d8);
			}
			&.reservation {
				background: linear-gradient(to bottom, #f9a556, #fabf8d);
			}
		}
	}
	.menus-wrapper {
		position: relative;
		width: 100%;
		padding-right: 12px;
		background-color: #fff;
		// #ifdef H5
		padding-right: 0;
		// #endif
		.uv-icon-wrapper {
			padding-right: 15px !important;
		}
	}
	.menus-item {
		width: 100%;
		height: 160rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 20rpx;
		color: white;
		padding: 20rpx;
		box-sizing: border-box;
		&.record {
			background: #fda062;
		}
		&.evaluate {
			background: #67b5f9;
		}
		&.questionnaire {
			background: #4acf9e;
		}
		&.reservation {
			background: #fc668b;
		}
		.menus-icon {
			width: 45px;
			height: 45px;
			background: white;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.menus-name {
			font-size: 17px;
		}
		.menus-desc {
			margin-top: 18rpx;
		}
	}
}
</style>
