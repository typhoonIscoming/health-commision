<template>
	<view>
		<view v-if="list.length" class="psychoLogical card-radius page-gap">
			<Title title="心理测评"></Title>
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
	getData();
});
</script>
<style lang="scss">
.psychoLogical {
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
