<template>
	<view>
		<view
			v-if="evaluteList.length"
			class="satisfaction card-radius page-gap"
		>
			<Title title="满意度调查"></Title>
			<view class="list-wrapper">
				<view
					v-for="(item, i) in evaluteList"
					:key="i"
					class="satisfaction-item"
					style="display: flex; justify-content: space-between"
					@click="handleClick(item)"
				>
					<!-- <view style="display: flex; justify-content: space-between">
						<view class="label">{{ worksheetInfo.name }}</view>
						<view style="display: flex; align-items: center">
							<text style="color: #606266; margin-right: 10rpx">
								去填写
							</text>
							<uv-icon name="arrow-right" size="16"></uv-icon>
						</view>
					</view> -->
					<view class="name">{{ item.jcjl }}</view>
					<view>去填报</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import Title from './Title.vue';
import satisfactionHook from '@/hooks/satisfactionHook';
import evaluteHook from '@/hooks/evaluteHook';

const { evaluteList, getData } = evaluteHook();

const { worksheetInfo, getWorksheet } = satisfactionHook();

const handleClick = (item) => {
	uni.navigateTo({
		url: `/pages/subpackage/questionnaire/questionnaire?id=${item.rowid}&type=edit`,
	});
};

onMounted(() => {
	getData({ pageSize: 5 });
});
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
