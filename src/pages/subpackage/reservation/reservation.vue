<template>
	<view class="reservation">
		<view class="reservation-wrapper">
			<ReservationItem v-for="(item, i) in reservationList" :key="i" :item="item" />
		</view>
		<uv-load-more :status="loadStatus" @loadmore="getData" />
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app';
import ReservationItem from '@/components/ReservationItem.vue';
import { isEmpty } from '@/utils';
import reservationHook from '@/hooks/reservationHook';

const { reservationList, getList } = reservationHook();

const loadStatus = ref('');

const paddingBottom = ref(60);

const pageIndex = ref(1);
const pageSize = ref(5);
const loading = ref(false);

const getData = (fresh) => {
	if (loadStatus.value === 'noMore') {
		return;
	}
	loading.value = true;
	loadStatus.value = 'loading'
	getList({
		pageIndex: pageIndex.value,
		pageSize: pageSize.value,
		refresh: !!fresh,
	}).then(res => {
		if (!isEmpty(res)) {
			const { total } = res;
			if (pageIndex.value * pageSize.value >= total) {
				loadStatus.value = 'noMore'
			} else {
				loadStatus.value = 'loadmore'
			}
			pageIndex.value = pageIndex.value + 1;
		} else {
			loadStatus.value = 'noMore'
		}
	}).finally(() => {
		loading.value = false;
		uni.stopPullDownRefresh();
	});
};

const handleAppointment = () => {
	uni.navigateTo({
		url: '/pages/subpackage/appointment/appointment',
	});
};

onMounted(() => {
	pageIndex.value = 1;
	getData();
	const sysInfo = uni.getWindowInfo();
	const { safeAreaInsets } = sysInfo;
	if (isEmpty(safeAreaInsets)) return;
	paddingBottom.value = paddingBottom.value + safeAreaInsets.bottom;
});


onPullDownRefresh(() => {
	pageIndex.value = 1;
	loadStatus.value = 'loadmore'
	getData(true)
});
onReachBottom(() => {
	getData();
});
</script>
<style lang="scss">
.reservation {
	padding: 13px;
	position: relative;
	background: white;
	min-height: 100vh;
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px 13px 0;
		background: #f8f8f8;
	}
}
</style>
