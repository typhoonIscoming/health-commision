<template>
	<view class="user">
		<NavBar title="我的" />
		<Background />
		<HomeCard :size="60" />
		<view class="entry-wrapper">
			<!-- <uv-cell-group>
				<uv-cell
					icon="setting"
					title="备案信息"
					:isLink="true"
					:cellStyle="cellStyle"
					@click="handleRoute('record')"
				></uv-cell>
				<uv-cell
					icon="heart"
					title="我的评价"
					:isLink="true"
					:cellStyle="cellStyle"
					@click="handleRoute('evaluate')"
				></uv-cell>
				<uv-cell
					icon="empty-news"
					title="我的问卷"
					:isLink="true"
					:cellStyle="cellStyle"
					@click="handleRoute('questionnaire')"
				></uv-cell>
				<uv-cell
					icon="clock"
					title="我的预约"
					:isLink="true"
					:cellStyle="cellStyle"
					@click="handleRoute('reservation')"
				></uv-cell>
			</uv-cell-group> -->
			<view class="menus-wrapper">
				<view
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
				</view>
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
import { to } from '@/utils';
import HomeCard from '@/components/HomeCard.vue';
import Tabbar from '@/components/Tabbar.vue';

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
	{
		name: '我的问卷',
		desc: '查看历史问卷调查',
		label: 'questionnaire',
		icon: 'wodewenjuan',
		color: '#4ACF9E',
	},
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
	if (route) {
		uni.navigateTo({ url: route });
	}
};
</script>
<style lang="scss">
.user {
	position: relative;
	.entry-wrapper {
		padding: 0 16px;
		.uv-line {
			display: none;
		}
	}
	.menus-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: space-between;
		position: relative;
		z-index: 9;
	}
	.menus-item {
		min-width: 48%;
		flex: 1;
		height: 180rpx;
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
