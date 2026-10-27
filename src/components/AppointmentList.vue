<template>
	<view>
		<view v-if="list.length" class="appointment-list">
			<Title title="我的预约" />
			<view v-for="item in list" :key="item.id">
				<ReservationItem :item="item" :showHospital="false" />
			</view>
			<view v-if="total > 3" class="more-btn" @click="handleMoreClick">
				查看更多预约记录
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { isEmpty } from '@/utils';
import Title from '@/components/Title.vue';
import ReservationItem from '@/components/ReservationItem.vue';

defineProps({
	list: {
		type: Array,
		default: () => [],
	},
	total: {
		type: Number,
		default: 0,
	},
});

const handleMoreClick = () => {
	uni.navigateTo({
		url: '/pages/subpackage/reservation/reservation',
	});
};
</script>
<style lang="scss">
.appointment-list {
	margin-top: 100rpx;
	.more-btn {
		margin: 20rpx auto 40rpx;
		text-align: center;
		color: #007aff;
	}
}
</style>
