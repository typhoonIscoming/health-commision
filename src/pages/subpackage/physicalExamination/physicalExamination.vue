<template>
	<view class="physical">
		<view class="physical-dropdown-wrapper">
			<view class="physical-dropdown flex-center flex-between">
				<view class="dropdown-item flex-center">
					<text>按时间倒序</text>
					<view
						class="sort-wrapper flex-col"
						@click="handleClick('time')"
					>
						<uv-icon
							name="arrow-up-fill"
							:color="arrowColor('time', 'up')"
							size="8"
						/>
						<uv-icon
							name="arrow-down-fill"
							:color="arrowColor('time', 'down')"
							size="8"
						/>
					</view>
				</view>
				<view class="dropdown-item flex-center">
					<text>服务时间</text>
					<view
						class="sort-wrapper flex-col"
						@click="handleClick('serviceTime')"
					>
						<uv-icon
							name="arrow-up-fill"
							size="8"
							:color="arrowColor('serviceTime', 'up')"
						/>
						<uv-icon
							name="arrow-down-fill"
							size="8"
							:color="arrowColor('serviceTime', 'down')"
						/>
					</view>
				</view>
			</view>
		</view>
		<view class="physical-list">
			<PhysicalItem v-for="i in 5" :key="i" />
		</view>
		<uv-load-more :status="loadStatus" @loadmore="getData" />
	</view>
</template>
<script setup>
import { ref } from 'vue';
import PhysicalItem from '@/components/PhysicalItem.vue';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

const type = ref('');
const loadStatus = ref('noMore');

const handleClick = (sortType) => {
	console.log('点击了排序', sortType);
	if (!type.value) {
		type.value = `${sortType}_down`;
		return;
	}
	const [currentType, currentOrder] = type.value.split('_');
	if (currentType === sortType) {
		type.value = `${sortType}_${currentOrder === 'down' ? 'up' : 'down'}`;
	} else {
		type.value = `${sortType}_down`;
	}
};
const arrowColor = (sortType, direction) => {
	if (!type.value) {
		return '#E5E5E5';
	}
	const [currentType, currentOrder] = type.value.split('_');
	if (currentType === sortType) {
		return currentOrder === direction ? '#0F62FB' : '#E5E5E5';
	} else {
		return '#E5E5E5';
	}
};
const getData = () => {
	console.log('加载更多数据');
	setTimeout(() => {
		loadStatus.value = 'noMore';
	}, 1500);
};

onPullDownRefresh(() => {
	console.log('下拉刷新数据');
	setTimeout(() => {
		uni.stopPullDownRefresh();
	}, 1500);
});
onReachBottom(() => {
	if (loadStatus.value === 'noMore') {
		return;
	}
	loadStatus.value = 'loading';
	getData();
});
</script>
<style lang="scss">
.physical {
	padding: 13px;
	&-dropdown-wrapper {
		padding: 20rpx;
		background: #fff;
		border-radius: 6px;
		.dropdown-item {
			flex: 1;
			justify-content: center;
			position: relative;
			&:nth-last-child(1) {
				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					height: 80%;
					width: 1px;
					background: #e5e5e5;
				}
			}
			.sort-wrapper {
				margin-left: 5px;
			}
		}
	}
}
</style>
