<template>
	<view class="appointment" :style="{ paddingBottom: `${paddingBottom}px` }">
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
			</uv-form>
		</view>
		<view class="footer" :style="{ height: `${paddingBottom}px` }">
			<uv-button type="primary" color="#0F62FB" text="提交"></uv-button>
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
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { isEmpty } from '@/utils';

const paddingBottom = ref(60);
const model = ref({
	hospital: '',
	department: '',
	service: '',
});
const rules = ref({
	hospital: [{ required: true, message: '请选择医院' }],
	department: [{ required: true, message: '请选择科室' }],
	service: [{ required: true, message: '请选择服务' }],
});
const hospitalSelect = ref();
const departmentSelect = ref();
const serviceSelect = ref();

const hospitalList = ref([{ name: '第一人民医院' }, { name: '第二人民医院' }]);
const departmentList = ref([{ name: '内科' }, { name: '体检科' }]);
const serviceList = ref([{ name: '体检' }]);

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
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px 13px 0;
		background: #f8f8f8;
	}
}
</style>
