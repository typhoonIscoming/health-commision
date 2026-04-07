<template>
	<view class="Mall4j component-tabbar">
		<view class="tab-con">
			<view
				v-for="(item, index) in showTabBarList"
				:key="index"
				:class="item.tabName"
				class="tab-item"
				@click="onSwitchTab(item)"
			>
				<view class="tab-icon">
					<!-- <uni-icons
						custom-prefix="iconfont"
						:type="`icon-${item.className}`"
						size="36rpx"
						:color="
							currentTab === item.tabName
								? 'rgb(87, 190, 173)'
								: '#999'
						"
					/> -->
					<uv-icon
						:name="
							currentTab === item.tabName
								? item.iconActive
								: item.icon
						"
						size="24"
					/>
				</view>
				<text
					class="tab-text"
					:class="{ active: currentTab === item.tabName }"
				>
					{{ item.text }}
				</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import home from '@/static/tabbar/home.png';
import homeActive from '@/static/tabbar/homeActive.png';
import appointment from '@/static/tabbar/yuyue.png';
import appointmentActive from '@/static/tabbar/yuyueActive.png';
import user from '@/static/tabbar/user.png';
import userActive from '@/static/tabbar/userActive.png';
defineProps({
	currentTab: {
		type: String,
		default: 'index',
	},
});

// 原始tab数据
const tabBarList = ref([
	{
		text: '首页',
		url: '/pages/tabBar/index/index',
		tabName: 'index',
		className: 'shouye',
		icon: home,
		iconActive: homeActive,
	},
	{
		text: '体检预约',
		url: '/pages/tabBar/appointment/appointment',
		tabName: 'appointment',
		className: 'yuyuetijian',
		icon: appointment,
		iconActive: appointmentActive,
	},
	{
		text: '我的',
		url: '/pages/tabBar/user/user',
		tabName: 'userTab',
		className: 'gerenzhongxin',
		icon: user,
		iconActive: userActive,
	},
]);

// 页面渲染的tab
const showTabBarList = ref([]);

// 切换页面
const onSwitchTab = (item) => {
	const pages = getCurrentPages();
	if (
		pages.length &&
		item.url.indexOf(pages[pages.length - 1].route) !== -1
	) {
		return;
	}
	uni.switchTab({
		url: item.url,
	});
};
// 主题
onMounted(async () => {
	initTabList();
});

// 生成底部tab
const initTabList = () => {
	// 获取主题配置修改tabbar栏图标
	const tempList = [];
	showTabBarList.value = [];

	for (let i = 0; i < tabBarList.value.length; i++) {
		const tabItem = tabBarList.value[i];
		tempList.push(tabItem);
	}
	showTabBarList.value = tempList;
};
</script>

<style lang="scss">
@import '@/uni.scss';

.component-tabbar {
	line-height: normal;
	font-family: 'PingFang SC-Regular, PingFang SC';
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100%;
	background-color: #f7f7fa;
	padding-bottom: env(safe-area-inset-bottom);
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	border-top: 1rpx solid #ceced1;
	z-index: 68;
	.tab-con {
		width: 100%;
		display: flex;
		flex-direction: row;
		.tab-item {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: center;
			height: 98rpx;
			width: 100%;
			> text {
				text-align: center;
				color: #999;
				font-size: 20rpx;
			}
			.active {
				color: rgb(87, 190, 173);
			}
			.tab-icon {
				font-size: 0;
			}
			.appointItem-wrap {
				margin: auto;
				width: 100rpx;
				height: 50rpx;
				transform: translateY(-120%);
				border-radius: 50rpx 50rpx 0 0;
				background-color: #f7f7fa;
				border: 1px solid #ceced1;
				border-bottom: 0;
				position: relative;
				display: flex;
				justify-content: center;
				&::before {
					content: '';
					display: block;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					margin: auto;
					height: 100rpx;
					width: 100rpx;
					border-radius: 50%;
				}
			}
			.appointItem {
				position: absolute;
				top: 3px;
				left: 0;
				right: 0;
				margin: auto;
				height: 80rpx;
				width: 80rpx;
				border-radius: 50%;
				background-color: #f7f7fa;
				z-index: 2;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.badge {
				position: absolute;
				top: 2rpx;
				right: 30rpx;
				background-color: $uni-primary-active-color;
				color: #fff;
				width: auto;
				height: 32rpx;
				line-height: 32rpx;
				border-radius: 32rpx;
				min-width: 32rpx;
				padding: 0 4rpx;
				font-size: 24rpx;
				text-align: center;
				white-space: nowrap;
				box-sizing: border-box;
			}
		}
	}
}
</style>
