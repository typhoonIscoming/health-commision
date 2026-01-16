<template>
	<view class="satisfaction card-radius page-gap">
		<Title title="满意度调查">
		</Title>
		<view class="list-wrapper">
			<view class="satisfaction-item" @click="handleClick">
				<view style="display: flex;justify-content: space-between;">
					<view class="label">{{ worksheetInfo.name }}</view>
					<view style="display: flex;align-items: center;">
						<text style="color:#606266;margin-right: 10rpx">去填写</text>
						<uv-icon name="arrow-right" size="16"></uv-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import Title from './Title.vue';
import satisfactionHook from '@/hooks/satisfactionHook';

const { worksheetInfo, getWorksheet } = satisfactionHook();

const handleClick = () => {
	uni.navigateTo({
		url: '/pages/subpackage/questionnaire/questionnaire'
	})
}

onMounted(() => {
	getWorksheet()
})
</script>
<style lang="scss">
.satisfaction {
	background: white;
	padding-top: 30rpx;
	.list-wrapper {
		padding: 20rpx;
		.satisfaction-item {
			padding: 20rpx 0;
			& ~ .satisfaction-item {
				border-top: 1px solid #f0f0f0;
			}
			.time {
				color: #a6a6a6;
			}
			.label {
				font-size: 28rpx;
				font-weight: bold;
			}
		}
	}
}
</style>
