<template>
	<view class="user">
		<NavBar
			title="我的"
			bgColor="#09C3AD"
			:titleStyle="{ color: '#ffffff' }"
		/>
		<!-- <Background /> -->
		<HomeCard :size="60" />
		<view class="entry-wrapper">
			<view class="menus-wrapper">
				<!-- <view
					v-for="(item, i) in menus"
					:key="i"
					:class="item.label"
					class="menus-item"
					@click="handleRoute(item.label)"
				>
					<view class="menus-detail">
						<view class="menus-name">{{ item.name }}</view>
						<view class="menus-desc">{{ item.desc }}</view>
					</view>
					<view class="menus-icon">
						<uni-icons
							custom-prefix="iconfont"
							:type="`icon-${item.icon}`"
							:color="item.color"
							size="42rpx"
						/>
					</view>
				</view> -->
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
								class="service-row-icon iconfont"
								:class="`icon-${item.icon} ${item.label}`"
								style="margin-right: 20rpx"
							>
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
		<Tabbar current-tab="user" />
	</view>
</template>
<script setup>
import { ref, computed, defineOptions } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import NavBar from '@/components/NavBar.vue';
import useLoginStore from '@/store/login';
import Background from '@/components/Background.vue';
import HomeCard from '@/components/HomeCard.vue';
import Tabbar from '@/components/Tabbar.vue';
import { isEmpty, to, checkLogin } from '@/utils';

defineOptions({
	options: {
		styleIsolation: 'shared',
	},
});

const cellStyle = ref({
	background: 'white',
	paddingTop: '15px',
	paddingBottom: '15px',
	marginBottom: '20px',
});
const menus = ref([
	{
		name: '备案信息',
		desc: '完善个人信息',
		label: 'record',
		icon: 'beianxinxi',
		color: '#FDA062',
	},
	{
		name: '我的评价',
		desc: '查看我的历史评价',
		label: 'evaluate',
		icon: 'pingjia',
		color: '#67B5F9',
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
</script>
<style lang="scss">
.user {
	position: relative;
	.entry-wrapper {
		margin: 0 16px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 20rpx;
		padding: 16px 0;
		background: #ffffff;
		.uv-line {
			display: none;
		}
		.uv-list-item__container {
			padding-right: 0 !important;
		}
		.service-row-icon {
			// color: #09c3ad;
			width: 55rpx;
			height: 55rpx;
			border-radius: 50%;
			// border: 1px solid #e7e6e4;
			// border: 1px solid #09c3ad;
			// border: 1px dashed rgba(0, 0, 0, 0.25);
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
		// display: flex;
		// flex-wrap: wrap;
		// gap: 10px;
		// justify-content: space-between;
		position: relative;
		width: 100%;
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
