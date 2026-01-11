<template>
	<view class="reservation">
		<view class="reservation-wrapper">
			<ReservationItem />
			<ReservationItem :status="1" />
			<ReservationItem :status="2" />
			<ReservationItem :status="3" />
			<ReservationItem :status="1" />
			<ReservationItem :status="2" />
			<ReservationItem />
			<ReservationItem :status="3" />
			<ReservationItem />
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import ReservationItem from '@/components/ReservationItem.vue';
import { isEmpty } from '@/utils';

const loadStatus = ref('noMore');

const paddingBottom = ref(60);

const getData = () => {
	console.log('加载更多数据');
	setTimeout(() => {
		loadStatus.value = 'noMore';
	}, 1500);
};

const handleAppointment = () => {
	uni.navigateTo({
		url: '/pages/subpackage/appointment/appointment',
	});
};

onMounted(() => {
	const sysInfo = uni.getWindowInfo();
	const { safeAreaInsets } = sysInfo;
	if (isEmpty(safeAreaInsets)) return;
	paddingBottom.value = paddingBottom.value + safeAreaInsets.bottom;
});

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
.reservation {
	padding: 13px;
	position: relative;
	background: white;
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
