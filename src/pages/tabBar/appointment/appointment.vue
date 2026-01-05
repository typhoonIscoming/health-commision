<template>
	<view class="appointment">
		<NavBar title="体检预约" />
		<Tabbar current-tab="appointment" />
		<view class="appointment-container">
			<view class="appointment-wrapper">
				<uv-form
					labelPosition="top"
					:model="model"
					:rules="rules"
					ref="form"
				>
					<uv-form-item
						label="选择医院"
						prop="hospital"
						borderBottom
						labelWidth="auto"
						@click="showSelect"
					>
						<uv-input
							v-model="model.hospital"
							border="none"
							readonly
							placeholder="请选择医院"
						>
						</uv-input>
						<template v-slot:right>
							<uv-icon name="arrow-right"></uv-icon>
						</template>
					</uv-form-item>
					<uv-form-item
						label="选择科室"
						prop="department"
						borderBottom
						labelWidth="auto"
						@click="showDepartmentSelect"
					>
						<uv-input
							v-model="model.department"
							border="none"
							readonly
							placeholder="请选择科室"
						>
						</uv-input>
						<template v-slot:right>
							<uv-icon name="arrow-right"></uv-icon>
						</template>
					</uv-form-item>
					<uv-form-item
						label="选择服务"
						prop="service"
						borderBottom
						labelWidth="auto"
						@click="showServiceSelect"
					>
						<uv-input
							v-model="model.service"
							border="none"
							readonly
							placeholder="请选择服务"
						>
						</uv-input>
						<template v-slot:right>
							<uv-icon name="arrow-right"></uv-icon>
						</template>
					</uv-form-item>
					<uv-form-item
						label="选择预约时间"
						prop="date"
						borderBottom
						labelWidth="auto"
						@click="showDateSelect"
					>
						<uv-input
							v-model="model.date"
							border="none"
							readonly
							placeholder="请选择预约时间"
						>
						</uv-input>
						<template v-slot:right>
							<uv-icon name="arrow-right"></uv-icon>
						</template>
					</uv-form-item>
				</uv-form>
			</view>
			<view class="footer">
				<!-- <uv-button type="primary" class="submit-btn" color="#0F62FB" text="提交"></uv-button> -->
				<view class="submit-btn">
					<view class="appointment-rest">剩余：120</view>
					<view class="submit-text">提交</view>
				</view>
			</view>
			<uv-action-sheet
				ref="hospitalSelect"
				:actions="hospitalList"
				title="请选择医院"
				@select="handleSelect"
			/>
			<uv-action-sheet
				ref="departmentSelect"
				:actions="departmentList"
				title="请选择科室"
				@select="handleSelectDepart"
			/>
			<uv-action-sheet
				ref="serviceSelect"
				:actions="serviceList"
				title="请选择科室"
				@select="handleSelectService"
			/>
			<uv-datetime-picker
				ref="datetimePicker"
				v-model="datetimePickerValue"
				mode="datetime"
				:maxDate="maxDate"
				:minDate="minDate"
				:filter="filterDate"
				@confirm="confirm"
			/>
		</view>
	</view>
</template>
<script setup>
import NavBar from '@/components/NavBar.vue';
import Tabbar from '@/components/Tabbar.vue';

import { ref, onMounted } from 'vue';
import { isEmpty, parseTime } from '@/utils';

// 一周后的日期
const getSevenDayLater = () => {
	const now = new Date();
	now.setHours(23, 59, 59, 999);
	const sevenDay = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
	return sevenDay
}
// 明天凌晨
const getTomorrow = () => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	// 添加一天
	const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
	return tomorrow
}

const paddingBottom = ref(60);
const model = ref({
	hospital: '',
	department: '',
	service: '',
	date: '',
});
const rules = ref({
	hospital: [{ required: true, message: '请选择医院' }],
	department: [{ required: true, message: '请选择科室' }],
	service: [{ required: true, message: '请选择服务' }],
});
// 弹窗的绑定时间
const datetimePickerValue = ref();
const hospitalSelect = ref();
const departmentSelect = ref();
const serviceSelect = ref();
const datetimePicker = ref();

const hospitalList = ref([{ name: '第一人民医院' }, { name: '第二人民医院' }]);
const departmentList = ref([{ name: '内科' }, { name: '体检科' }]);
const serviceList = ref([{ name: '体检' }]);

// 日期弹窗组件最大日期
const maxDate = ref(+new Date(getSevenDayLater()));
// 最小日期
const minDate = ref(+new Date(getTomorrow()));

const showSelect = () => {
	hospitalSelect.value?.open();
};
const handleSelect = (e) => {
	model.value.hospital = e.name;
};

// 打开科室弹窗
const showDepartmentSelect = () => {
	departmentSelect.value?.open();
};
// 选择科室
const handleSelectDepart = (e) => {
	model.value.department = e.name;
};

// 选择服务
const showServiceSelect = () => {
	serviceSelect.value?.open();
};
const handleSelectService = (e) => {
	model.value.service = e.name;
	
};

// 过滤时间
const filterDate = (type, options) => {
	// console.log('type', type, options)
	if (type === 'hour') {
		return options.filter((option) => option > 8 && option < 14)
	} else if (type === 'minute') {
		return options.filter((option) => option % 30 === 0)
	}
	return options
}

const showDateSelect = () => {
	datetimePicker.value?.open();
	if (model.value.date) {
		datetimePickerValue.value = model.value.date
	}
};
// 时间确认
const confirm = ({ value }) => {
	const result = parseTime(value);
	model.value.date = result;
};

onMounted(() => {
	const sysInfo = uni.getWindowInfo();
	const { safeAreaInsets } = sysInfo;
	if (isEmpty(safeAreaInsets)) return;
	paddingBottom.value = paddingBottom.value + safeAreaInsets.bottom;
});
</script>
<style lang="scss">
.appointment {
	padding: 13px;
	&-wrapper {
		.uv-line {
			display: none;
		}
		.uv-form-item {
			& ~ .uv-form-item {
				margin-top: 12px;
			}
		}
		.uv-form-item__body {
			padding: 0;
		}
		.uv-form-item__body__left {
			padding: 10px;
		}
		.uv-form-item__body__right {
			padding: 10px;
			background: white;
		}
	}
	.footer {
		padding-top: 20px;
		background: #f8f8f8;
		display: flex;
		justify-content: center;
		.submit-btn{
			width: 120px;
			height: 120px;
			border-radius: 50%;
			background: #609DFB;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: white;
            box-shadow: 0 4px 16px rgba(9, 137, 250, 0.3);
			.submit-text{
				font-size: 16px;
			}
			.appointment-rest{
				font-size: 17px;
			}
		}
	}
}
</style>
