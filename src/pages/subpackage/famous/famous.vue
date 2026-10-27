<template>
	<view class="famous-wrapper">
		<view
			v-for="(item, i) in list"
			:key="i"
			class="doctor-item flex"
			@click="handleClick(item)"
		>
			<view class="avatar-wrap">
				<image
					:src="item.avatar || '@/static/home/doctor-avatar.png'"
					mode="aspectFill"
					class="doctor-avatar"
					style="width: 160rpx; height: 200rpx; border-radius: 20rpx"
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
						{{ item.ysxm }}
					</text>
					<text style="margin-left: 10rpx; font-size: 26rpx">
						{{ item.zhicheng }}
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
						{{ item.ssyyjg }}
					</text>

					<text v-if="item.szks"> | {{ item.szks }} </text>
				</view>
				<view
					class="doctor-desc"
					style="margin-top: 10rpx; color: #999999"
					v-html="parseText(item.desc)"
				>
				</view>
			</view>
		</view>
		<uv-load-more :status="loadStatus" @loadmore="getDoctorData" />
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';

import doctorHook from '@/hooks/doctorHook';

const { doctorList, list, getData } = doctorHook();

const loadStatus = ref('');

const getDoctorData = (fresh) => {
	if (loadStatus.value === 'noMore') {
		return;
	}
	loadStatus.value = 'loading';
	getData().then(() => {
		loadStatus.value = 'noMore';
	});
};

const handleClick = (item) => {
	uni.navigateTo({
		url: `/pages/subpackage/doctorDetail/doctorDetail?id=${item.id}`,
	});
};

const parseText = (nodes) => {
	let result = '';
	nodes.forEach((node) => {
		if (node.text) {
			result += node.text;
		}
		if (node.children && node.children.length) {
			result += parseText(node.children);
		}
	});
	return result;
};

onMounted(() => {
	getDoctorData();
});
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
	.doctor-desc {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
</style>
