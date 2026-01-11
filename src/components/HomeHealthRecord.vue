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
				<view class="desc">
					<view v-if="item.name === 'tj'" class="row-val">
						共<text class="item-count">{{ item.count }}</text>份报告
					</view>
					<view v-else-if="item.name === 'mz'" class="row-val">
						共<text class="item-count">{{ item.count }}</text>条记录
					</view>
					<view v-else-if="item.name === 'mzmb'" class="row-val">
						共<text class="item-count">{{ item.count }}</text>条记录
					</view>
					<view v-else-if="item.name === 'zy'" class="row-val">
						共<text class="item-count">{{ item.count }}</text>条记录
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, watch } from 'vue';
import Title from './Title.vue';
import { checkLogin } from '@/utils/index.js';
import homeCardHook from '../hooks/homeCard';
import homeCardFee from '../hooks/homeCardFee';

const { tjbgNum } = homeCardHook();
const resultList = homeCardFee();

const service = ref([
	{ label: '体检报告', count: 0, name: 'tj' },
	{ label: '一般门诊', count: 2, name: 'mz' },
	{ label: '门诊慢病', count: 3, name: 'mzmb' },
	{ label: '住院', count: 5, name: 'zy' },
]);

watch(() => [tjbgNum.value], (list) => {
	service.value = service.value.map(item => {
		if (item.name === 'tj') {
			return { ...item, count: list[0] }
		} else if (item.name === 'mz') {
			return { ...item, count: 3 }
		} else if (item.name === 'mzmb') {
			return { ...item, count: 3 }
		} else if (item.name === 'zy') {
			return { ...item, count: 3 }
		}
		return item
	})
}, { deep: true, immediate: true })

const handleRoute = (item) => {
	checkLogin.checkAuthInfo(() => {
		uni.navigateTo({
			url: `/pages/subpackage/physicalExamination/physicalExamination?type=${item.name}`
		});
	});
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
			.label, .item-count{
				color: #307EF2;
			}
		}
		&.mz {
			background: url('../static/home/mz.png') no-repeat;
			background-size: cover;
			.label, .item-count{
				color: #CF7B4A;
			}
		}
		&.mzmb {
			background: url('../static/home/zy.png') no-repeat;
			background-size: cover;
			.label, .item-count{
				color: #F340E9;
			}
		}
		&.zy {
			background: url('../static/home/jc.png') no-repeat;
			background-size: cover;
			.label, .item-count{
				color: #59B47E;
			}
		}
		.label{
			font-size: 38rpx;
			font-weight: bold;
		}
		.desc{
			margin-top: 30rpx;
			min-height: 36rpx;
		}
		.row-val{
			color: #808080;
			font-size: 30rpx;
		}
		.item-count{
			margin: 0 10rpx;
			font-size: 38rpx;
			font-weight: bold;
		}
	}
}
</style>
