<template>
	<view class="famous-wrapper">
		<view
			v-for="(item, i) in doctorList"
			:key="i"
			class="doctor-item flex"
			@click="handleClick(item)"
		>
			<view class="avatar-wrap">
				<image
					:src="item.avatar || '@/static/home/doctor-avatar.png'"
					mode="heightFix"
					class="doctor-avatar"
					style="height: 150rpx; border-radius: 20rpx"
				/>
			</view>
			<view class="doctor-detail">
				<view class="flex flex-center" style="white-space: nowrap">
					<text
						style="
							font-size: 32rpx;
							color: #3d3d3d;
							font-weight: bold;
						"
					>
						{{ item.name }}
					</text>
					<text style="margin-left: 10rpx; font-size: 26rpx">
						{{ item.type }}
					</text>
				</view>
				<view
					style="
						margin-top: 10rpx;
						font-size: 24rpx;
						color: #3d3d3d;
						font-size: 30rpx;
					"
				>
					<text>
						{{ item.hospital }}
					</text>
					|
					<text>
						{{ item.department }}
					</text>
				</view>
				<view style="margin-top: 10rpx; color: #999999">
					{{ item.skill }}
				</view>
			</view>
		</view>
		<uv-load-more :status="loadStatus" @loadmore="getData" />
	</view>
</template>
<script setup>
import { ref } from 'vue';

import doctorHook from '@/hooks/doctorHook';

const { doctorList } = doctorHook();

const loadStatus = ref('');

const getData = (fresh) => {
	if (loadStatus.value === 'noMore') {
		return;
	}
	loadStatus.value = 'loading';
	setTimeout(() => {
		loadStatus.value = 'noMore';
	}, 1000);
};

const handleClick = (item) => {
	uni.navigateTo({
		url: `/pages/subpackage/doctorDetail/doctorDetail?id=${item.id}`,
	});
};
</script>
<style lang="scss">
.famous-wrapper {
	padding: 20rpx;
	.doctor-item {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		& ~ .doctor-item {
			margin-top: 30rpx;
		}
	}
	.avatar-wrap {
		border-radius: 20rpx;
		overflow: hidden;
		margin-right: 30rpx;
		// background: #bce1ce;
		padding: 0;
		height: fit-content;
	}
	.doctor-detail {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
	}
}
</style>
