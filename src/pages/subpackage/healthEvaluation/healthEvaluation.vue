<template>
	<view class="health-evaluation">
		<view class="health-content">
			<view class="evaluation-item psychological" @click="handlePsycho">
				<view class="title">心理测评</view>
				<view class="subtitle">心理健康测评</view>
				<view class="btn-wrapper">
					<view class="evaluation-btn">
						<text class="btn-text" style="color: #279536">
							去测评
						</text>
						<uv-icon
							name="arrow-right"
							color="#279536"
							size="15"
						></uv-icon>
					</view>
				</view>
			</view>
			<view class="evaluation-item physical" @click="handlePhysical">
				<view class="title">体质自测</view>
				<view class="subtitle">中医体质自测</view>
				<view class="btn-wrapper">
					<view class="evaluation-btn">
						<text class="btn-text" style="color: #00aea2">
							去测评
						</text>
						<uv-icon
							name="arrow-right"
							color="#00AEA2"
							size="15"
						></uv-icon>
					</view>
				</view>
			</view>
			<view class="evaluation-item weight" @click="handleWeight">
				<view class="title">体重测评</view>
				<view class="subtitle">体重状况测评</view>
				<view class="btn-wrapper">
					<view class="evaluation-btn">
						<text class="btn-text" style="color: #519aec">
							去测评
						</text>
						<uv-icon
							name="arrow-right"
							color="#519AEC"
							size="15"
						></uv-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { onMounted } from 'vue';
import psychoLogicalHook from '@/hooks/psychoLogicalHook.js';
import { debounce, isEmpty } from '@/utils';

const { list, loading, getData } = psychoLogicalHook();

const handlePsycho = debounce(() => {
	if (loading.value) return;
	// 查找leixing字段中值为'心理测评'且时间ctime最新的项
	const item = list.value
		.sort((a, b) => b.ctime - a.ctime)
		.find((oItem) => oItem.leixing === '心理测评');
	if (list.value.length === 0 || isEmpty(item)) {
		uni.showToast({
			title: '暂无心理测评数据',
			icon: 'none',
		});
		return;
	}
	uni.navigateTo({
		url: `/pages/subpackage/thridParty/thridParty?url=${item.ymdz}&title=心理测评`,
	});
	console.log('心理测评点击', list.value);
});

const handlePhysical = debounce(() => {
	if (loading.value) return;
	const item = list.value
		.sort((a, b) => b.ctime - a.ctime)
		.find((oItem) => oItem.leixing.indexOf('体质') !== -1);
	if (list.value.length === 0 || isEmpty(item)) {
		uni.showToast({
			title: '暂无体质自测数据',
			icon: 'none',
		});
		return;
	}
	uni.navigateTo({
		url: `/pages/subpackage/thridParty/thridParty?url=${item.ymdz}&title=体质自测`,
	});
	console.log('体质自测点击');
});

const handleWeight = debounce(() => {
	if (loading.value) return;
	if (list.value.length === 0) {
		uni.showToast({
			title: '暂无体重测评数据',
			icon: 'none',
		});
		return;
	}
	const item = list.value
		.sort((a, b) => b.ctime - a.ctime)
		.find((oItem) => oItem.leixing.indexOf('体重') !== -1);
	if (isEmpty(item)) {
		uni.showToast({
			title: '暂无体重测评数据',
			icon: 'none',
		});
		return;
	}
	uni.navigateTo({
		url: `/pages/subpackage/thridParty/thridParty?url=${item.ymdz}&title=体重测评`,
	});
	console.log('体重测评点击');
});

onMounted(() => {
	getData();
});
</script>
<style lang="scss">
.health-evaluation {
	width: 100%;
	.health-content {
		padding: 10px;
	}
	.evaluation-item {
		padding: 20rpx 30rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 15rpx;
		border-radius: 20rpx;
		background-size: cover;
		&.psychological {
			// background: #c2f7ce;
			background: url('/static/user/psychological.png') no-repeat center
				center;
		}
		&.physical {
			// background: #bbf3f1;
			background: url('/static/user/physical.png') no-repeat center center;
		}
		&.weight {
			// background: #d0e3f9;
			background: url('/static/user/weight.png') no-repeat center center;
		}
		& + .evaluation-item {
			margin-top: 15px;
		}
		.btn-wrapper {
			overflow: hidden;
		}
		.evaluation-btn {
			display: flex;
			float: left;
			padding: 6rpx 20rpx;
			border-radius: 30rpx;
			align-items: center;
			background: white;
			box-shadow: -10px 0 10px rgba(255, 255, 255, 0.8);
			.btn-text {
				font-size: 24rpx;
			}
		}
		.title {
			font-weight: bold;
			font-size: 30rpx;
		}
		.subtitle {
			color: #3a383a;
		}
	}
}
</style>
