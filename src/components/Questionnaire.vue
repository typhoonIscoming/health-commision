<template>
	<view class="questionnaire card-radius page-gap">
		<Title title="问卷调查">
			<text style="color: #4a4a4a">更多</text>
		</Title>
		<view class="list-wrapper">
			<view v-for="(item, i) in list" :key="i" class="satisfaction-item">
				<view class="label">{{ item.label }}</view>
				<view class="time">{{ item.time }}</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref } from 'vue';
import Title from './Title.vue';

const list = ref([
	{
		label: '第一人民医院张某三离休人员住院服务调查',
		time: '2025-11-29 10:30',
	},
	{
		label: '第一人民医院张某三离休人员住院服务调查',
		time: '2025-11-29 10:30',
	},
]);
</script>
<style lang="scss">
.questionnaire {
	background: white;
	padding-top: 30rpx;
	.list-wrapper {
		padding: 20rpx;
		.satisfaction-item {
			padding: 20rpx 0;
			& ~ .satisfaction-item {
				// margin-top: 20rpx;
				border-top: 1px solid #f0f0f0;
			}
			.time {
				color: #a6a6a6;
			}
			.label {
				margin-bottom: 20rpx;
				font-size: 28rpx;
				font-weight: bold;
			}
		}
	}
}
</style>
