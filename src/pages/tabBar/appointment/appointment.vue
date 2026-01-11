<template>
	<view class="appointment-content">
		<NavBar title="体检预约" :opacity="1" />
		<view
			style="
				height: 60rpx;
				background: #ecf5ff;
				color: #909193;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
			"
		>
			<text style="font-size: 28rpx"> 请选择您要预约的医院及时间 </text>
		</view>
		<uv-vtabs
			:chain="false"
			:list="list"
			:height="height"
			hdHeight="100rpx"
			barWidth="240rpx"
			@change="change"
		>
			<uv-vtabs-item>
				<view class="flex flex-wrap" style="flex-wrap: wrap">
					<view
						class="item"
						v-for="(item2, index2) in currentList"
						:key="index2"
						style="white-space: nowrap"
						:class="{
							active:
								hospitalIndex === currentIndex &&
								timeIndex === index2,
						}"
						@click="handleSelected(index2)"
					>
						<view class="item-content">
							<text class="item-date">{{ item2.date }}</text>
						</view>
						<view class="item-num-content">
							<text class="text"> 剩余: </text>
							<uv-count-to
								:startVal="0"
								:endVal="item2.num"
								:fontSize="17"
								:duration="1000"
							></uv-count-to>
						</view>
					</view>
				</view>
				<view class="gap">
					<view style="margin-top: 40rpx;width: 100%;"></view>
					<uv-gap bg-color="#f1f1f1" height="4"></uv-gap>
					<view style="margin-top: 40rpx;width: 100%;"></view>
					<uv-button type="primary" text="确定" @click="handleConfrim"></uv-button>
				</view>
			</uv-vtabs-item>
			
		</uv-vtabs>

		<Tabbar current-tab="appointment" />
	</view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import NavBar from '@/components/NavBar.vue';
import Tabbar from '@/components/Tabbar.vue';
import { isEmpty, to, checkLogin } from '@/utils';
import appointmentHook from '@/hooks/appointment';
import { makeAppointment } from '@/api';

const { hospitial, currentIndex, getHospitialDateList, getHospitial } = appointmentHook();

const getSevenDayLater = () => {
	const now = new Date();
	now.setHours(23, 59, 59, 999);
	let dateFormatPostcssSourceMap = (date) => {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	};
	let list = [];
	// 判断当前小时
	let startOffset = (new Date().getHours() >= 14) ? 1 : 0;
	for (let i = 0; i < 7; i++) {
		const tempDate = new Date(now.getTime() + (i + startOffset) * 24 * 60 * 60 * 1000);
		const temp = {
			date: dateFormatPostcssSourceMap(tempDate),
			num: Math.floor(Math.random() * 200) + 1,
		};
		list.push(temp);
	}
	return list;
};


const list = computed(() => {
	return hospitial.value.map((item) => ({
		...item,
	}))
});
const height = computed(() => {
	return uni.getSystemInfoSync().windowHeight - uni.upx2px(200);
});
const currentList = computed(() => {
	if (isEmpty(currentIndex.value)) return []
	return list.value[currentIndex.value]?.children || [];
});

const change = (index) => {
	console.log('当前选中tab索引：', index);
	if (index === currentIndex.value) {
		return
	}
	currentIndex.value = index;
	timeIndex.value = null;
	const item = list.value[index];
	getHospitialDateList(item)
};
// 选择的医院
const hospitalIndex = ref(0);
// 选择的时间索引
const timeIndex = ref();
// 选择预约时间
const handleSelected = (index2) => {
	timeIndex.value = index2;
	hospitalIndex.value = currentIndex.value;
};
// 提交事件
const handleConfrim = () => {
	checkLogin.checkAuthInfo(async(userInfo) => {
		if (isEmpty(timeIndex.value)) {
			uni.showToast({
				title: '请选择预约时间',
				icon: 'none',
			});
			return;
		}
		const selectedHospital = list.value[hospitalIndex.value];
		const selectedTime = selectedHospital.children[timeIndex.value];
		console.log('selectedTime', selectedTime)
		const params = {
			row_id: selectedTime.rowid,
			ybbh: userInfo.ybbh
		}
		const [err, res] = await to(makeAppointment(params));
		if (!isEmpty(err) || isEmpty(res)) {
			return
		}
		const { responseInfos } = res;
		if (responseInfos.code !== 'S200') {
			uni.showToast({ icon: 'none', title: responseInfos.msg || '预约失败' })
			return
		}
		getHospitial();
		uni.showModal({
			title: '预约成功',
			content: `您已成功预约${selectedHospital.name}，预约时间为${selectedTime.date}，请按时前往体检！`,
			showCancel: false,
		});
	})
	
};
</script>
<style lang="scss">
.appointment-content {
	position: relative;
	.header {
		padding: 30rpx;
		font-size: 30rpx;
		color: #333;
	}
	.item {
		width: 33%;
		padding: 10rpx;
		border: 2rpx solid transparent;
		&.active {
			background: #e6f0ff;
			border-color: #2a82e4;
			border-radius: 10rpx;
		}
		&-num-content{
			margin-top: 10rpx;
		}
		&-content, &-num-content {
			.item-date {
				font-size: 28rpx;
				color: #111;
			}
			.text {
				line-height: 48rpx;
				font-size: 24rpx;
				color: #111;
				/* #ifndef APP-NVUE */
				word-break: break-all;
				/* #endif */
			}
		}
	}
	.gap {
		padding: 0 30rpx;
	}
}
</style>
