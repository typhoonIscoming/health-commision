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
		>
		</uv-action-sheet>
	</view>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { isEmpty } from '@/utils';

const paddingBottom = ref(60);
const model = ref({
	hospital: '',
});
const rules = ref({
	hospital: [{ required: true, message: '请选择医院' }],
});
const hospitalSelect = ref();

const hospitalList = ref([{ name: '第一人民医院' }, { name: '第二人民医院' }]);

const showSelect = () => {
	hospitalSelect.value?.open();
};
const handleSelect = (e) => {
	model.value.hospital = e.name;
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
