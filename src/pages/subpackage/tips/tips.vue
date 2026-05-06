<template>
	<view class="tips-page">
		<view class="notice-wrapper">
			<uv-notice-bar
				:text="text"
				:icon="false"
				bgColor="transparent"
				color="#58B384"
			></uv-notice-bar>
		</view>
		<view class="notice-content">
			<view class="notice-paragraph">
				<view class="notice-header">
					<text>【就诊前准备】</text>
				</view>
				<view class="notice-item dot">
					我们提供的是预约式服务，请致电保健基地医院的保健门诊提前预约，以避免等候。
				</view>
				<view class="notice-item dot">
					请携带医保卡、身份证等，以便办理相关手续。
				</view>
				<view class="notice-item dot">
					如有需要，请带上病历、检查报告和健康体检报告等相关资料。
				</view>
			</view>
			<view class="notice-paragraph">
				<view class="notice-header">
					<text>【就诊流程】</text>
				</view>
				<view class="notice-item number">
					1、到达保健基地医院后，请前往保健门诊就诊。
				</view>
				<view class="notice-item number">
					2、由保健基地医院的保健专家为您接诊。
				</view>
				<view class="notice-item number">
					3、如遇特殊情况，请及时向保健门诊医务人员咨询。
				</view>
			</view>
			<view class="notice-paragraph">
				<view class="notice-header">
					<text>【注意事项】</text>
				</view>
				<view class="notice-item dot">
					如有需要，请遵守医生的嘱咐，按时服药、复查等。
				</view>
				<view class="notice-item dot">
					就诊期间，请注意做好个人防护。
				</view>
				<view class="notice-item dot">
					如病情有变化或其他问题，请及时与医院取得联系。
				</view>
				<view class="notice-item dot">
					您可参加自治区保健委员会办公室组织的健康宣讲和健康咨询。
				</view>
			</view>
			<view
				class="notice-paragraph"
				style="line-height: 1.7; font-weight: bold"
			>
				以上是我们的温馨提示，希望能为您提供更好的医疗服务体验，如有疑问、需要帮助和意见建议，请随时与自治区保健委员会办公室联系。祝您健康！
			</view>
			<view
				class="notice-paragraph"
				style="line-height: 1.7; font-weight: bold"
			>
				自治区保健委员会办公室联系电话：
				<view>0991-8500292、8500406</view>
			</view>
			<view style="text-align: right; padding: 0px 10px">
				<view>自治区卫生健康委员会</view>
				<view>自治区保健委员会办公室</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const text = ref(
	'就医温馨提示：请您在就医前做好相关准备，携带好必要的证件和资料，遵守医院的相关规定，配合医护人员的工作，共同维护良好的就医环境。祝您就医顺利，身体健康！',
);
</script>
<style lang="scss" scoped>
.tips-page {
	.notice-wrapper {
		background: linear-gradient(to right, #e0f5e9, #e8f9de);
	}
	.notice-content {
		padding-bottom: 100rpx;
	}
	.notice-paragraph {
		padding: 10px;
		& ~ .notice-paragraph {
			margin-top: 10px;
		}
		.notice-header {
			font-size: 15px;
			margin-bottom: 10rpx;
		}
		.notice-item {
			color: #3d3d3d;
			line-height: 1.7;
			font-size: 13px;
			&.number {
				padding-left: 10rpx;
			}
			&.dot {
				padding-left: 40rpx;
				position: relative;
				&::before {
					content: '';
					position: absolute;
					left: 15rpx;
					top: 20rpx;
					width: 8rpx;
					height: 8rpx;
					background-color: #3d3d3d;
					border-radius: 50%;
				}
			}
		}
	}
}
</style>
