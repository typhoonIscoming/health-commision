<template>
	<view>
		<view v-if="list.length" class="education page-gap">
			<TitleRow title="健康宣教" />
			<view class="education-wrap"> </view>
		</view>
	</view>
</template>
<script setup>
import TitleRow from './Title.vue';
import educationHook from '../hooks/education';

const { list } = educationHook();
</script>
<style lang="scss">
.education {
	background: white;
	padding: 30rpx 0;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	border-radius: 20rpx;
}
</style>
