<template>
	<view class="appointment-content">
		<NavBar title="体检预约" :opacity="1" />
		<view
			style="
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
			"
		>
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
					<view style="width: 100%">
						<view style="margin-bottom: 20rpx">
							<Title title="选择医院" />
						</view>
						<uni-data-select
							v-model="model.name"
							:localdata="list"
							@change="change"
						></uni-data-select>
					</view>
				</uv-form-item>
				<uv-form-item
					v-if="currentList.length"
					label="请选择预约日期"
					prop="date"
					:borderBottom="false"
				>
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
										:fontSize="17"
										:duration="1000"
										color="white"
									></uv-count-to>
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
					color="#95C2AB"
					shape="circle"
					@click="handleConfrim"
				></uv-button>
			</view>
		</view>

		<Tabbar current-tab="appointment" />
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import Tabbar from '@/components/Tabbar.vue';
import { isEmpty, to, checkLogin } from '@/utils';
import appointmentHook from '@/hooks/appointment';
import { makeAppointment } from '@/api';
import Title from '@/components/Title.vue';
import { onShow } from '@dcloudio/uni-app';

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

onMounted(() => {
	const userInfo = uni.getStorageSync('b2cAuth');
	if (isEmpty(userInfo)) {
		return;
	}
	getHospitial();
});

const list = computed(() => {
	const result = hospitial.value.map((item) => ({
		...item,
		text: item.name,
		value: item.rowid,
	}));
	return result;
});
const height = computed(() => {
	return uni.getSystemInfoSync().windowHeight - uni.upx2px(200);
});
const currentList = computed(() => {
	if (isEmpty(currentIndex.value)) return [];
	return list.value[currentIndex.value]?.children || [];
});

const change = (id) => {
	const index = list.value.findIndex((item) => item.value === id);
	currentIndex.value = index;
	timeIndex.value = null;
	const item = list.value[index];
	getHospitialDateList(item);
};
// 选择的医院
const hospitalIndex = ref(0);
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
	const selectedHospital = list.value[hospitalIndex.value];
	const selectedTime = selectedHospital.children[timeIndex.value];
	if (isEmpty(selectedTime)) {
		uni.showToast({ icon: 'none', title: '请选择预约时间' });
		return;
	}
	const params = {
		row_id: selectedTime.rowid,
		ybbh: userInfo.ybbh,
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
	uni.showModal({
		title: '提交成功',
		content: `您已预约${selectedHospital.name}，预约时间为${selectedTime.date}，请等待机构人员确认后按时前往体检！`,
		showCancel: false,
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
		width: 33.3%;
		padding: 6rpx;

		&-wrap {
			// background: #53c21d;
			background: rgb(87, 190, 173);
			border: 2rpx solid transparent;
			border-radius: 10rpx;
			padding: 5px;
		}
		&.disabled {
			.item-wrap {
				background: #c4c6c9;
				border-color: #c4c6c9;
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
				background: #2a82e4;
				border-color: #2a82e4;
			}
		}
		&-num-content {
			margin-top: 10rpx;
		}
		&-content,
		&-num-content {
			.item-date {
				font-size: 28rpx;
				color: white;
			}
			.text {
				line-height: 48rpx;
				font-size: 24rpx;
				color: white;
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
}
</style>
