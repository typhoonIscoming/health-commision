<template>
	<view class="famous-wrapper">
		<view v-for="(item, i) in doctorList" :key="i" class="doctor-item flex">
			<view class="avatar-wrap">
				<image
					:src="item.avatar || '@/static/home/doctor-avatar.png'"
					mode="aspectFit"
					class="doctor-avatar"
					style="width: 150rpx; height: 150rpx"
				/>
			</view>
			<view class="doctor-detail">
				<view class="flex flex-center" style="white-space: nowrap">
					<text
						style="
							font-size: 32rpx;
							color: #3d3d3d;
							font-weight: bold;
						"
					>
						{{ item.name }}
					</text>
					<text style="margin-left: 10rpx; font-size: 26rpx">
						{{ item.type }}
					</text>
				</view>
				<view
					style="
						margin-top: 10rpx;
						font-size: 24rpx;
						color: #3d3d3d;
						font-size: 30rpx;
					"
				>
					<text>
						{{ item.hospital }}
					</text>
					|
					<text>
						{{ item.department }}
					</text>
				</view>
				<view style="margin-top: 10rpx; color: #999999">
					{{ item.skill }}
				</view>
			</view>
		</view>
		<uv-load-more :status="loadStatus" @loadmore="getData" />
	</view>
</template>
<script setup>
import { ref } from 'vue';
import doctorAvatar from '@/static/card/doctor.png';

const doctorList = ref([
	{
		name: '热合曼',
		type: '主任医师',
		avatar: doctorAvatar,
		hospital: '乌鲁木齐市人民医院',
		department: '皮肤科',
		// 擅长
		skill: '擅长：皮肤病的诊治，尤其是过敏性皮肤病、慢性湿疹、顽固性荨麻疹等疾病的诊治',
	},
	{
		name: '热合曼.阿娜尔罕',
		type: '心内科-主任医师',
		avatar: doctorAvatar,
		hospital: '乌鲁木齐市人民医院',
		department: '心内科',
		skill: '擅长：心血管疾病的诊治，尤其是高血压、冠心病、心律失常等疾病的诊治',
	},
	{
		name: '热合曼',
		type: '心内科-主任医师',
		avatar: doctorAvatar,
		hospital: '乌鲁木齐市人民医院',
		department: '心内科',
		skill: '擅长：心血管疾病的诊治，尤其是高血压、冠心病、心律失常等疾病的诊治',
	},
]);

const loadStatus = ref('');

const getData = (fresh) => {
	if (loadStatus.value === 'noMore') {
		return;
	}
	loadStatus.value = 'loading';
	setTimeout(() => {
		loadStatus.value = 'noMore';
	}, 1000);
};
</script>
<style lang="scss">
.famous-wrapper {
	padding: 20rpx;
	.doctor-item {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 20rpx;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		& ~ .doctor-item {
			margin-top: 30rpx;
		}
	}
	.avatar-wrap {
		border-radius: 20rpx;
		overflow: hidden;
		margin-right: 30rpx;
		background: #bce1ce;
		padding: 10rpx 0 5rpx;
	}
	.doctor-detail {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
	}
}
</style>
