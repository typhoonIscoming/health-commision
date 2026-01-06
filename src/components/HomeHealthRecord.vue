<template>
	<view class="HomeHealthRecord card-radius page-gap">
		<Title title="健康服务记录" />
		<view class="content flex">
			<view
				v-for="(item, i) in service"
				:key="i"
				class="service-item card-radius flex-col"
				:class="item.name"
				@click="handleRoute(item)"
			>
				<view class="label">{{ item.label }}</view>
				<view class="desc">{{ item.desc }}</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref } from 'vue';
import Title from './Title.vue';
import { checkLogin } from '@/utils/index.js';

const service = ref([
	{ label: '体检记录', desc: '11次', name: 'tj' },
	{ label: '门诊记录', desc: '查看电子报告', name: 'mz' },
	{ label: '住院记录', desc: '', name: 'zy' },
	{ label: '检查记录', desc: '5次', name: 'jc' },
]);

const handleRoute = (item) => {
	if (item.name === 'tj') {
		uni.navigateTo({
			url: `/pages/subpackage/physicalExamination/physicalExamination?type=${item.name}`,
		});
		return;
	} else {
		checkLogin.checkAuthInfo(() => {
			uni.navigateTo({
				url: `/pages/subpackage/thridParty/thridParty?type=${item.name}`,
			});
		});
	}
};
</script>
<style lang="scss">
.HomeHealthRecord {
	background: white;
	padding: 30rpx 0;
	.content {
		width: 100%;
		padding: 0 12rpx;
		flex-wrap: wrap;
		margin-top: 20rpx;
		justify-content: space-between;
		gap: 10px;
	}
	.service-item {
		width: calc(50% - 5px);
		height: 100px;
		padding: 20rpx;
		overflow: hidden;
		justify-content: center;
		&.tj {
			background: url('../static/home/tj.png') no-repeat;
			background-size: cover;
		}
		&.mz {
			background: url('../static/home/mz.png') no-repeat;
			background-size: cover;
		}
		&.zy {
			background: url('../static/home/zy.png') no-repeat;
			background-size: cover;
		}
		&.jc {
			background: url('../static/home/jc.png') no-repeat;
			background-size: cover;
		}
		.label{
			font-size: 30rpx;
			font-weight: bold;
		}
		.desc{
			margin-top: 20rpx;
			min-height: 36rpx;
		}
	}
}
</style>
