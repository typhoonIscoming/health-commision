<template>
	<view
		class="doctor-wrap"
		:style="{
			'background-image': `url(${doctorBg})`,
			'background-size': 'contain',
		}"
	>
		<NavBar title="专家介绍" :bgImage="doctorBg">
			<template v-slot:left>
				<view class="flex flex-center" @click="uni.navigateBack()">
					<uv-icon name="arrow-left"></uv-icon>
				</view>
			</template>
		</NavBar>
		<!-- <view></view> -->
		<!-- <image
			:src="doctorBg"
			mode="widthFix"
			class="page-bg__base"
			:style="{
				position: 'absolute',
				top: `${0}px`,
				left: 0,
				width: '100%',
				zIndex: -1,
			}"
		/> -->
		<view class="doctor-avatar flex">
			<image
				:src="doctorDetail.avatar || doctorDetail.fakeAvatar"
				mode="aspectFit"
				class="doctor-avatar__img"
			/>
			<view class="doctor-detail" style="flex: 1">
				<view class="flex">
					<uv-tags
						:text="doctorDetail.zhicheng"
						plain
						shape="circle"
						size="mini"
						type="success"
					></uv-tags>
				</view>
				<view
					style="
						font-size: 32rpx;
						font-weight: bold;
						color: #222;
						margin-top: 20rpx;
					"
				>
					{{ doctorDetail.ysxm }}
				</view>
				<view style="margin-top: 20rpx; font-size: #222">
					{{ doctorDetail.szks }}
				</view>
				<view class="hospital-address">
					<uv-icon
						:name="hospitalIcon"
						size="20"
						color="#999999"
					></uv-icon>
					<text>{{ doctorDetail.ssyyjg }}</text>
				</view>
			</view>
		</view>
		<view class="doctor-good-at doctor-info">
			<view class="flex flex-center">
				<uv-icon :name="goodAt" size="28" color="#999999"></uv-icon>
				<text style="font-size: 32rpx; color: #58b384">擅长</text>
			</view>
			<view class="skill-content">
				<view> {{ doctorDetail.scly }} </view>
			</view>
		</view>
		<view
			v-if="doctorDetail.desc && doctorDetail.desc.length > 0"
			class="doctor-skill-at doctor-info"
		>
			<view class="flex flex-center">
				<uv-icon
					:name="doctorSkill"
					size="28"
					color="#999999"
				></uv-icon>
				<text style="font-size: 32rpx; color: #58b384">专家介绍</text>
			</view>
			<view class="skill-content">
				<view>
					{{ descriptions }}
					<!-- {{ doctorDetail.introduction }} -->
					<!-- <RichTextNode :nodes="doctorDetail.desc" /> -->
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import doctorHook from '@/hooks/doctorHook';
import { onLoad } from '@dcloudio/uni-app';
import NavBar from '@/components/NavBar.vue';
import RichTextNode from '@/components/RichTextNode.vue';
import doctorBg from '@/static/card/doctor-detail.png';
import doctorAvatar from '@/static/card/doctor.png';
import hospitalIcon from '@/static/card/hospital-icon.png';
import goodAt from '@/static/card/skill.png';
import doctorSkill from '@/static/card/doctor-skill.png';
import { computed } from 'vue';

const { doctorList, list, getData } = doctorHook();

const doctorDetail = ref({});
const descriptions = ref('');

const getDoctorDetail = (id) => {
	doctorDetail.value = list.value.find((item) => item.id == id);
	if (doctorDetail.value.desc.length) {
		// 递归将数组中的文字提取出来
		const extractText = (nodes) => {
			let result = '';
			nodes.forEach((node) => {
				if (node.text) {
					result += node.text;
				}
				if (node.children && node.children.length) {
					result += extractText(node.children);
				}
			});
			return result;
		};
		descriptions.value = extractText(doctorDetail.value.desc);
	}

	console.log('doctorDetail', doctorDetail.value, descriptions.value);
};

onLoad((options) => {
	const { id } = options;
	console.log('id', id);
	getData().then(() => {
		getDoctorDetail(id);
	});
});
</script>
<style lang="scss">
.doctor-wrap {
	padding-bottom: 20rpx;
	.doctor-avatar {
		padding: 40rpx 60rpx 0;
		gap: 10px;
		.doctor-detail {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.doctor-avatar__img {
			width: 240rpx;
			height: 320rpx;
		}
		.hospital-address {
			margin-top: 40rpx;
			font-size: 24rpx;
			color: #222;
			display: flex;
			align-items: center;
			font-weight: bold;
		}
	}
	.doctor-skill-at {
		margin-top: 20rpx;
	}
	.doctor-info {
		margin: 20rpx 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background: url('@/static/card/goodAtBg.png') no-repeat center;
		background-size: cover;
		.skill-content {
			margin-top: 20rpx;
			font-size: 28rpx;
			color: #3d3d3d;
			line-height: 1.5;
			background: white;
			border-radius: 20rpx;
			padding: 20rpx;
		}
	}
}
</style>
