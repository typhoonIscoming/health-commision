<template>
	<view class="Mall4j component-tabbar">
		<view class="tab-con">
			<view
				v-for="(item, index) in showTabBarList"
				:key="index"
				class="tab-item"
				@click="onSwitchTab(item)"
			>
				<!-- 文案 -->
				<text :class="{ active: currentTab === item.tabName }">
					{{ item.text }}
				</text>
			</view>
		</view>
	</view>
</template>

<script setup>
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
	},
	{
		text: '门诊预约',
		url: '/pages/tabBar/appointment/appointment',
		tabName: 'basket',
	},
	{
		text: '我的',
		url: '/pages/tabBar/user/user',
		tabName: 'user',
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

<style lang="scss" scoped>
.component-tabbar {
	line-height: normal;
	font-family: 'PingFang SC-Regular, PingFang SC';
	position: fixed;
	bottom: 0px;
	width: 100%;
	left: 0px;
	width: 100%;
	background-color: #f7f7fa;
	padding-bottom: var(--mall4j-safe-area-inset-bottom);
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	border-top: 1rpx solid #ceced1;
	z-index: 98;
	.tab-con {
		width: 100%;
		display: flex;
		.tab-item {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: center;
			height: 98rpx;

			> text {
				text-align: center;
				color: #333;
				font-size: 20rpx;
			}
			.active {
				color: var(--mall4j-color-primary);
			}

			.badge {
				position: absolute;
				top: 2rpx;
				right: 30rpx;
				background-color: var(--mall4j-color-primary);
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
