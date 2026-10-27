<template>
	<view class="appointment-content">
		<!-- <NavBar title="体检预约" :opacity="1" /> -->
		<view class="appointment-bg">
			<text style="font-size: 28rpx"> 请选择您要预约的医院及时间 </text>
		</view>
		<view style="padding: 20rpx">
			<uv-form
				labelPosition="top"
				labelWidth="auto"
				:model="model"
				:rules="rules"
				ref="form"
			>
				<uv-form-item label="" prop="name" :borderBottom="false">
					<view style="margin-bottom: 20rpx">
						<Title title="选择医院" />
					</view>

					<view class="hospital-wrapper">
						<view
							v-for="(item, i) in list"
							:key="i"
							class="hospital-item"
							:class="{ selected: currentIndex === i }"
							@click="handleSelectHospital(item)"
						>
							<view class="selected-icon">
								<uv-icon :name="selected" size="24" />
							</view>
							<view class="hospital-name gap-icon row flex">
								<uv-icon
									:name="hospitalIcon"
									size="20"
									color="#999999"
								></uv-icon>
								<text
									style="
										font-weight: bold;
										color: #3d3d3d;
										font-size: 30rpx;
									"
								>
									{{ item.name }}
								</text>
							</view>
							<view v-if="item.jgdz" class="hospital-address row">
								{{ item.jgdz }}
							</view>
							<view
								v-if="item.yydh"
								class="hospital-contact gap-icon flex align-center row"
							>
								<uv-icon
									:name="phoneIcon"
									size="20"
									color="#999999"
								></uv-icon>
								<text
									style="
										font-weight: bold;
										color: #58b384;
										margin-right: 30rpx;
									"
								>
									预约电话
								</text>
								<text
									style="
										color: #58b384;
										font-weight: bold;
										font-size: 28rpx;
									"
									@click.stop="handleCall(item.yydh)"
								>
									{{ item.yydh }}
								</text>
							</view>
						</view>
					</view>
				</uv-form-item>
				<uv-form-item
					v-if="currentList.length"
					prop="date"
					:borderBottom="false"
				>
					<view style="margin-bottom: 20rpx">
						<Title title="请选择预约日期" />
					</view>
					<view
						class="flex flex-wrap"
						style="flex-wrap: wrap; width: 100%"
					>
						<view
							class="item"
							v-for="(item2, index2) in currentList"
							:key="index2"
							style="white-space: nowrap"
							:class="{
								active: timeIndex === index2,
								disabled: !item2.num,
							}"
							@click="handleSelected(index2)"
						>
							<view class="item-wrap">
								<view class="item-content">
									<text class="item-date">
										{{ item2.date }}
									</text>
								</view>
								<view class="item-num-content">
									<text class="text"> 剩余: </text>
									<uv-count-to
										:startVal="0"
										:endVal="item2.num"
										:fontSize="15"
										:duration="1000"
										color="#999999"
									></uv-count-to>
								</view>
								<view class="selected-icon">
									<uv-icon :name="selected" size="24" />
								</view>
							</view>
						</view>
					</view>
				</uv-form-item>
			</uv-form>
			<view class="submit-wrap" style="margin-top: 20px">
				<uv-button
					type="primary"
					text="确定"
					:color="submitColor"
					shape="circle"
					@click="handleConfrim"
				></uv-button>
			</view>
			<AppointmentList :list="reservationList" :total="total" />
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { isEmpty, to, checkLogin } from '@/utils';
import appointmentHook from '@/hooks/appointment';
import { makeAppointment } from '@/api';
import constants from '@/utils/constants';
import Title from '@/components/Title.vue';
import AppointmentList from '@/components/AppointmentList.vue';
import selected from '@/static/user/selected.png';
import hospitalIcon from '@/static/card/hospital-icon.png';
import phoneIcon from '@/static/card/phone.png';
import reservationHook from '@/hooks/reservationHook';

const { reservationList, total, getList } = reservationHook();

const { hospitial, currentIndex, getHospitialDateList, getHospitial } =
	appointmentHook();

const model = ref({
	name: '',
	date: '',
});
const rules = ref({
	name: [{ required: true, message: '请选择医院' }],
	date: [{ required: true, message: '请选择日期' }],
});
const form = ref();
const appointmentRef = ref();
const pageIndex = ref(1);
const pageSize = ref(5);

const getReservationList = () => {
	getList({
		pageIndex: pageIndex.value,
		pageSize: pageSize.value,
		refresh: true,
	});
};

onMounted(() => {
	const userInfo = uni.getStorageSync('b2cAuth');
	console.log('userInfo', userInfo);
	if (isEmpty(userInfo)) {
		return;
	}
	getHospitial();
	getReservationList();
});

const list = computed(() => {
	const result = hospitial.value.map((item) => ({
		...item,
		text: item.name,
		value: item.rowid,
	}));
	console.log('list', result);
	return result;
});
const height = computed(() => {
	return uni.getSystemInfoSync().windowHeight - uni.upx2px(200);
});
const currentList = computed(() => {
	if (isEmpty(currentIndex.value)) return [];
	return list.value[currentIndex.value]?.children || [];
});
// 按钮颜色
const submitColor = computed(() => {
	if (isEmpty(model.value.name) || isEmpty(model.value.date)) {
		return '#95C2AB';
	}
	return '#58b384';
});

// 选择医院
const handleSelectHospital = (item) => {
	const index = list.value.findIndex((i) => i.value === item.rowid);
	if (currentIndex.value === index && currentList.value.length) return;
	currentIndex.value = index;
	timeIndex.value = null;
	const oItem = list.value[index];
	model.value.name = item.name;
	console.log('selected hospital:', item, oItem);
	getHospitialDateList(oItem);
};
// 选择的时间索引
const timeIndex = ref();
// 选择预约时间
const handleSelected = (index) => {
	const selected = currentList.value[index];
	if (!selected.num) {
		uni.showToast({ icon: 'none', title: '当天已预约完，请选择其他时间' });
		return;
	}
	if (timeIndex.value !== index) {
		timeIndex.value = index;
		model.value.date = selected.rowid;
	} else {
		timeIndex.value = null;
		model.value.date = null;
	}
};

const onSubmit = async (userInfo) => {
	const selectedHospital = list.value[currentIndex.value];
	const selectedTime = selectedHospital.children[timeIndex.value];
	if (isEmpty(selectedTime)) {
		uni.showToast({ icon: 'none', title: '请选择预约时间' });
		return;
	}
	const params = {
		row_id: selectedTime.rowid,
		ybbh: userInfo.ybbh,
		appKey: constants.appKey,
		sign: constants.sign,
	};
	const [err, res] = await to(makeAppointment(params));
	if (!isEmpty(err) || isEmpty(res)) {
		return;
	}
	const { code, msg } = res;
	if (code !== 'S200') {
		uni.showToast({ icon: 'none', title: msg || '预约失败' });
		return;
	}
	getHospitial();
	getReservationList();
	uni.showModal({
		title: '提交成功',
		content: `您已预约${selectedHospital.name}，预约时间为${selectedTime.date}，请等待机构人员确认后按时前往体检！`,
		showCancel: false,
		success: () => {
			appointmentRef.value?.refresh();
		},
	});
};
// 提交事件
const handleConfrim = () => {
	checkLogin.checkAuthInfo((userInfo) => {
		form.value.validate().then((valid) => {
			if (valid) {
				onSubmit(userInfo);
			}
		});
	});
};
const handleCall = (phone) => {
	if (!phone) return;
	uni.makePhoneCall({
		phoneNumber: phone,
	});
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
	.appointment-bg {
		height: 60rpx;
		background: linear-gradient(
			to right,
			#e1f5e9,
			#ebfae5 50%,
			#e7fadf 100%
		);
		color: #58b384;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: 40rpx 0;
	}
	.selected-icon {
		display: none;
		width: fit-content;
		height: fit-content;
		position: absolute;
		bottom: -2px;
		right: 0;
	}
	.item {
		width: 33.3%;
		padding: 6rpx;
		position: relative;
		&-wrap {
			// background: #53c21d;
			// background: rgb(87, 190, 173);
			background: #f5f5f5;
			border: 2px solid transparent;
			border-radius: 10rpx;
			padding: 5px;
			position: relative;
			overflow: hidden;
		}
		&.disabled {
			.item-wrap {
				background: #f5f5f5;
				border-color: transparent;
				&-content,
				&-num-content {
					.item-date {
						color: red;
					}
				}
			}
		}

		&.active {
			.item-wrap {
				border-color: #58b384;
			}
			.selected-icon {
				display: initial;
			}
		}
		&-num-content {
			margin-top: 10rpx;
		}
		&-content,
		&-num-content {
			text-align: center;
			.item-date {
				font-size: 34rpx;
				color: black;
				font-weight: bold;
			}
			.text {
				line-height: 48rpx;
				font-size: 28rpx;
				color: #999999;
				/* #ifndef APP-NVUE */
				word-break: break-all;
				/* #endif */
			}
		}
	}
	.gap {
		padding: 0 30rpx;
	}
	.uni-select__selector-item {
		line-height: 1.5;
		& ~ .uni-select__selector-item {
			margin-top: 30rpx;
		}
	}
	.flex {
		display: flex;
	}
	.gap-icon {
		gap: 10rpx;
	}
	.align-center {
		align-items: center;
	}
	.hospital-wrapper {
		.hospital-item {
			border-radius: 20rpx;
			background: #fff;
			box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
			padding: 20rpx;
			position: relative;
			border: 2px solid transparent;
			&.selected {
				border-color: #58b384;
				.selected-icon {
					display: initial;
				}
			}
		}
		.row {
			& + .row {
				margin-top: 10rpx;
			}
		}
		.hospital-name {
		}
	}
}
</style>
