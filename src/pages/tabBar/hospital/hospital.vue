<template>
	<view
		class="hospital-container"
		:style="{
			backgroundSize: '100% auto',
			backgroundRepeat: 'no-repeat',
			backgroundPositionY: `${0}px`,
			paddingBottom: `${safeInsetBottom + 20}px`,
		}"
	>
		<view class="page-gap hospital-item" v-for="(item, i) in list" :key="i">
			<view class="hospital-name flex align-center">
				<uv-icon
					:name="hospitalIcon"
					size="20"
					color="#999999"
				></uv-icon>
				<text
					style="font-weight: bold; color: #3d3d3d; font-size: 30rpx"
				>
					{{ item.title }}
				</text>
			</view>
			<view class="hospital-address">
				{{ item.address }}
			</view>
			<view class="hospital-contact flex align-center">
				<uv-icon :name="phoneIcon" size="15" color="#999999"></uv-icon>
				<text
					style="
						font-weight: bold;
						color: #58b384;
						margin: 0 30rpx 0 12rpx;
					"
				>
					预约电话
				</text>
				<text
					style="color: #58b384; font-weight: bold; font-size: 28rpx"
				>
					{{ item.phone }}
				</text>
			</view>
			<view v-if="item.doctors.length" class="hospital-doctor">
				<view class="doctor-list">
					<view
						v-for="(doctor, j) in item.doctors"
						:key="j"
						class="doctor-item flex align-center"
					>
						<text style="color: #3d3d3d; font-weight: bold">
							{{ doctor.name }}
						</text>
						<view
							style="color: #999999; margin-left: 20rpx; flex: 1"
						>
							{{ doctor.title }}
						</view>
						<view
							v-if="doctor.phone"
							class="doctor-contact flex align-center"
						>
							<uv-icon
								:name="phoneIcon2"
								size="13"
								color="#999999"
							></uv-icon>
							<text
								style="
									color: #3d3d3d;
									font-weight: bold;
									margin-left: 8px;
								"
							>
								{{ doctor.phone }}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<Tabbar currentTab="hospital" />
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tabbar from '@/components/Tabbar.vue';
import safeInset from '@/hooks/safeInset';
import hospitalIcon from '@/static/card/hospital-icon.png';
import phoneIcon from '@/static/card/phone.png';
import phoneIcon2 from '@/static/card/phone2.png';

const { safeInsetBottom } = safeInset();

const list = ref([
	{
		title: '医院名称',
		desc: '新疆维吾尔自治区人民医院',
		address: '新疆维吾尔自治区人民医院地址',
		phone: '0991-1234567',
		doctors: [
			{
				name: '张医生',
				department: '内科',
				title: '主任医师',
				phone: '0991-1234567',
			},
			{
				name: '王医生',
				department: '外科',
				title: '副主任医师',
				phone: '0991-1234567',
			},
		],
	},
	{
		title: '联系电话',
		desc: '0991-1234567',
		address: '新疆维吾尔自治区人民医院地址',
		phone: '0991-1234567',
		doctors: [
			{
				name: '李医生',
				department: '外科',
				title: '副主任医师',
			},
		],
	},
	{
		title: '联系地址',
		desc: '新疆维吾尔自治区人民医院地址',
		address: '新疆维吾尔自治区人民医院地址',
		phone: '0991-1234567',
		doctors: [
			{
				name: '王医生',
				department: '儿科',
				title: '主治医师',
			},
		],
	},
]);
</script>

<style lang="scss" scoped>
.hospital-container {
	min-height: 100vh;
	.hospital-item {
		background-color: #fff;
		padding: 10px;
		border-radius: 8px;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
		& ~ .hospital-item {
			margin-top: 20rpx;
		}
	}
	.hospital-name {
		gap: 10rpx;
		padding-left: 10px;
	}
	.hospital-address {
		margin: 10rpx 0;
		color: #999999;
		font-size: 28rpx;
		padding-left: 10px;
	}
	.hospital-contact {
		padding: 6px 10px;
		background-color: #eef7f2;
		border-radius: 8rpx;
	}
	.hospital-doctor {
		margin-top: 14rpx;
		padding: 0rpx 10px;
		background: #f7f7f7;
		border-radius: 8rpx;
		.doctor-item {
			padding: 20rpx 0;
			& ~ .doctor-item {
				border-top: 1px dashed #e5e5e5;
			}
		}
	}
}
</style>
