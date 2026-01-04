<template>
	<view class="user">
		<NavBar title="我的" />
		<Background />
		<HomeCard :size="60" />
		<view class="entry-wrapper">
			<uv-cell-group>
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
			</uv-cell-group>
		</view>
		<Tabbar current-tab="user" />
	</view>
</template>
<script setup>
import { ref, computed, defineOptions } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import NavBar from '@/components/NavBar.vue';
import useLoginStore from '@/store/login';
import LoginWrapper from '@/components/LoginWrapper.vue';
import { uploadImage } from '@/api';
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
	height: 100vh;
	position: relative;
	.entry-wrapper {
		.uv-line {
			display: none;
		}
	}
}
</style>
