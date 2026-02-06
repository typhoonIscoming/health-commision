<template>
	<view>
		<view v-if="list.length" class="questionnaire page-gap">
			<Title title="问卷调查">
				<!-- <text style="color: #4a4a4a">更多</text> -->
			</Title>
			<view class="list-wrapper">
				<view
					v-for="(item, i) in list"
					:key="i"
					class="satisfaction-item"
					@click="handleClick(item)"
				>
					<view class="label">{{ item.ymmc }}</view>
					<view class="time">{{ item.utime }}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import Title from './Title.vue';
import psychoLogicalHook from '@/hooks/psychoLogicalHook';

const { list, getData } = psychoLogicalHook();

const handleClick = (item) => {
	if (item.ymdz) {
		uni.navigateTo({
			url: `/pages/subpackage/thridParty/thridParty?url=${item.ymdz}`,
		});
	}
};

onMounted(() => {
	getData('问卷调查');
});
</script>
<style lang="scss">
.questionnaire {
	// background: white;
	padding-top: 30rpx;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	border-radius: 20rpx;
	overflow: hidden;
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
				margin-bottom: 10rpx;
				font-size: 28rpx;
				font-weight: bold;
			}
		}
	}
}
</style>
