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
			<template v-if="serviceType === 'tj'">
				<PhysicalItem v-for="(item, i) in list" :item="item" :key="i" />
			</template>
			<template v-else>
				<PhysicalItemRecord v-for="(item, i) in list" :item="item" :key="i" />
			</template>
		</view>
		<uv-load-more :status="loadStatus" @loadmore="getPageData" />
	</view>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import PhysicalItem from '@/components/PhysicalItem.vue';
import PhysicalItemRecord from '@/components/PhysicalItemRecord.vue';
import { onPullDownRefresh, onReachBottom, onLoad } from '@dcloudio/uni-app';
import homeCardHook from '@/hooks/homeCard';
import homeCardFee from '@/hooks/homeCardFee';
import { isEmpty } from '@/utils';

const { tjbgList } = homeCardHook();
const { list: resultList, getData } = homeCardFee(false);

const serviceType = ref('');
const type = ref('');
const loadStatus = ref('noMore');

const list = ref([]);

watch(() => [tjbgList.value, resultList.value], (result) => {
	const tjList = result[0];
	if (serviceType.value === 'tj') {
		if (!isEmpty(tjList)) {
			list.value = tjList;
		}
	} else {
		const val = result[1];
		const current = val.find(item => item.name === serviceType.value);
		if (!isEmpty(current)) {
			list.value = current.list;
		}
	}
}, { deep: true, immediate: true })

const handleClick = (sortType) => {
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
const getPageData = () => {
	setTimeout(() => {
		loadStatus.value = 'noMore';
	}, 1500);
};

onLoad((options) => {
	serviceType.value = options.type;
	getData();
})

onPullDownRefresh(() => {
	setTimeout(() => {
		uni.stopPullDownRefresh();
	}, 1500);
});
onReachBottom(() => {
	if (loadStatus.value === 'noMore') {
		return;
	}
	loadStatus.value = 'loading';
	getPageData();
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
