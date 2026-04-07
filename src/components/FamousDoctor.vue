<template>
	<view class="famous-doctor page-gap">
		<Title title="名医风采">
			<view style="display: flex; align-items: center">
				<text style="color: #4a4a4a" @click="handleMore"> 更多 </text>
				<uv-icon name="arrow-right" size="15"></uv-icon>
			</view>
		</Title>
		<view class="card" style="padding-top: 30rpx">
			<scroll-view scroll-x enable-flex :show-scrollbar="false">
				<view class="scroll-content">
					<view
						class="doctor-item flex flex-col flex-center"
						v-for="(item, index) in doctor"
						:key="index"
					>
						<image
							:src="
								item.avatar || '@/static/home/doctor-avatar.png'
							"
							mode="aspectFit"
							class="doctor-avatar"
							style="width: 180rpx; height: 200rpx"
						/>
						<view class="avatar-bg"></view>
						<view
							style="
								margin-top: 10rpx;
								font-size: 28rpx;
								color: #4d9c73;
								max-width: 240rpx;
								white-space: nowrap;
							"
						>
							{{ item.name }}
						</view>
						<view
							style="
								margin-top: 10rpx;
								font-size: 24rpx;
								color: #898989;
							"
						>
							{{ item.type }}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import Title from './Title.vue';
import avatar from '@/static/card/doctor.png';

const doctor = ref([
	{ name: '热合曼', type: '心内科-主任医师', avatar: avatar },
	{ name: '热合曼.阿娜尔罕', type: '心内科-主任医师', avatar: avatar },
	{ name: '热合曼', type: '心内科-主任医师', avatar: avatar },
	{ name: '热合曼', type: '心内科-主任医师', avatar: avatar },
	{ name: '热合曼', type: '心内科-主任医师', avatar: avatar },
	{ name: '热合曼', type: '心内科-主任医师', avatar: avatar },
]);

const handleMore = () => {
	// uni.showToast({ icon: 'none', title: '敬请期待' });
	uni.navigateTo({
		url: '/pages/subpackage/famous/famous',
	});
};
</script>
<style lang="scss" scoped>
.famous-doctor {
	background: #ffffff;
	padding: 13px;
	border-radius: 20rpx;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	.scroll-content {
		display: flex;
		gap: 30rpx;
		width: fit-content;
		overflow-x: auto;
		.doctor-item {
			min-width: 200rpx;
			padding-top: 40rpx;
			position: relative;
			.doctor-avatar {
				position: absolute;
				z-index: 1;
				top: 0;
				left: 0;
				right: 0;
				margin: auto;
			}
			.avatar-bg {
				width: 90%;
				height: 160rpx;
				background: linear-gradient(
					180deg,
					rgba(88, 179, 132, 0.7) -26%,
					rgba(255, 255, 255, 0) 88%
				);
				border-radius: 20rpx;
			}
		}
	}
}
</style>
