<template>
	<view class="physical">
		<view class="physical-list">
			<template v-if="serviceType === 'tj'">
				<PhysicalItem
					v-for="(item, i) in tjbgList"
					:item="item"
					:key="i"
				/>
			</template>
			<template v-else>
				<PhysicalItemRecord
					v-for="(item, i) in list"
					:item="item"
					:key="i"
				/>
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
import { isEmpty, to } from '@/utils';

const { tjbgList, getList } = homeCardHook();
const { list: resultList, getData } = homeCardFee(false);

const serviceType = ref('');
const type = ref('');
const loadStatus = ref('nomore');

const list = ref([]);

const pageIndex = ref(1);
const pageSize = ref(10);
// 获取数据
const getPageData = async (isfresh) => {
	const [currentType, currentOrder] = type.value.split('_');
	let sorts = {};
	if (currentType) {
		if (currentType === 'time') {
			sorts = { ...sorts, sortId: 'bgrq' };
		}
	}
	if (currentOrder) {
		if (currentOrder === 'up') {
			sorts = { ...sorts, isAsc: false };
		} else {
			sorts = { ...sorts, isAsc: true };
		}
	}
	loadStatus.value = 'loading';
	if (isfresh) {
		pageIndex.value = 1;
	}
	const [err, res] = await to(
		getList({
			isfresh,
			pageIndex: pageIndex.value,
			pageSize: pageSize.value,
			sorts,
		}),
	);
	if (err) {
		loadStatus.value = 'nomore';
		return;
	}
	if (!isEmpty(res)) {
		const { total } = res;
		if (pageIndex.value * pageSize.value < Number(total)) {
			loadStatus.value = 'loadmore';
		} else {
			loadStatus.value = 'nomore';
		}
		pageIndex.value = pageIndex.value + 1;
		return;
	}
	loadStatus.value = 'nomore';
};

const service = ref([
	{ label: '体检报告', count: 0, name: 'tj' },
	{ label: '一般门诊', count: 0, name: 'mz' },
	{ label: '门诊慢病', count: 0, name: 'mzmb' },
	{ label: '住院', count: 0, name: 'zy' },
]);

onLoad((options) => {
	serviceType.value = options.type;
	getPageData();
	const option = service.value.find((item) => item.name === options.type);
	if (!isEmpty(option)) {
		uni.setNavigationBarTitle({ title: `${option.label}记录` });
	}
});

onPullDownRefresh(() => {
	getPageData(true).then(() => {
		uni.stopPullDownRefresh();
	});
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
}
</style>
