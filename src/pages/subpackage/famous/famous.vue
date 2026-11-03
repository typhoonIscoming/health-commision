<template>
	<view class="famous-wrapper" :style="fontStyle">
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
					<text class="doctor-name">
						{{ item.ysxm }}
					</text>
					<text class="doctor-title">
						{{ item.zhicheng }}
					</text>
				</view>
				<view class="doctor-hospital">
					<text>
						{{ item.ssyyjg }}
					</text>

					<text v-if="item.szks"> | {{ item.szks }} </text>
				</view>
				<view
					class="doctor-desc"
					v-html="parseText(item.desc)"
				>
				</view>
			</view>
		</view>
		<uv-load-more :status="loadStatus" @loadmore="getDoctorData" />
	</view>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';

import doctorHook from '@/hooks/doctorHook';
import useFontSizeStore from '@/store/fontSize';

const fontSizeStore = useFontSizeStore();
const fontStyle = computed(() => fontSizeStore.fontStyle);

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
	.doctor-name {
		font-size: var(--app-font-size-title, 18px);
		color: #3d3d3d;
		font-weight: bold;
	}
	.doctor-title {
		margin-left: 10rpx;
		font-size: var(--app-font-size-text, 15px);
		color: #666;
	}
	.doctor-hospital {
		margin-top: 10rpx;
		font-size: var(--app-font-size-text, 15px);
		color: #3d3d3d;
	}
	.doctor-desc {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-top: 10rpx;
		color: #999999;
		font-size: var(--app-font-size-text, 15px);
		line-height: 1.6;
	}
}
</style>
