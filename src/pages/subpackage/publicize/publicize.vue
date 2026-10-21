<template>
	<view class="publicize">
		<view class="title">
			{{ detail?.wzbt }}
		</view>
		<view class="time">
			{{ detail?.fbrq }}
			<text class="author">{{ detail?.zuozhe }}</text>
		</view>
		<view class="content" v-html="detail?.content"></view>
	</view>
</template>
<script setup>
import { ref } from 'vue';
import educationHook from '@/hooks/education';
import parseHtml from '@/utils/html-paser';

const { getDetail } = educationHook();
const detail = ref(null);

const rowid = ref('');

onLoad(async (options) => {
	rowid.value = options.rowid || '';
	if (options.rowid) {
		detail.value = await getDetail(rowid.value);
		if (detail.value) {
			detail.value.content = parseHtml(detail.value.wznr);
		}
		// console.log('result', detail.value);
	}
});
</script>
<style lang="scss">
.publicize {
	padding: 20rpx 20rpx 40rpx;
	background: #fff;
	min-height: 100vh;
	.title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.time {
		font-size: 24rpx;
		color: #888;
		margin-bottom: 30rpx;
	}
	.author {
		margin-left: 20rpx;
		color: #2a82e4;
	}
	.content {
		.content-paragraph {
			view {
				margin-top: 20rpx;
			}
		}
		.content-item {
			margin-bottom: 30rpx;
			.content-title {
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 15rpx;
			}
			.content-text {
				font-size: 24rpx;
				line-height: 1.5;
				color: #555;
			}
		}
	}
}
</style>
