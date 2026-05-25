<template>
	<view class="UserInfoCard" @click="handleDetail">
		<view v-if="userInfo" class="title-wrap card-padding">
			<view style="display: flex; align-items: center">
				<image
					src="@/static/main/logo.png"
					mode="heightFix"
					style="width: 35px; height: 35px; margin-right: 10rpx"
				/>
				<text style="font-size: 30rpx">医疗就诊卡</text>
			</view>
			<view style="color: #999999; font-size: 24rpx">点击查看详情</view>
		</view>
		<image
			v-if="userInfo"
			src="@/static/main/card-bg.png"
			mode="widthFix"
			class="card-bg1"
		/>
		<image
			v-if="userInfo"
			src="@/static/main/card-bg2.png"
			mode="widthFix"
			class="card-bg2"
		/>
		<view
			class="user-info-wrap card-padding"
			:class="{ 'has-login': userInfo }"
		>
			<HomeCard v-if="!userInfo" theme="dark" />
			<view v-if="userInfo" class="detail-wrap flex">
				<view class="left-wrap">
					<view class="row flex-center">
						<view class="label">姓名：</view>
						<view class="value">{{ userInfo?.name }}</view>
					</view>
					<view class="row flex-center">
						<view class="label">性别：</view>
						<view class="value">{{ userInfo?.sex }}</view>
					</view>
					<view class="row flex-center">
						<view class="label" style="font-weight: bold">
							身份证号：
						</view>
						<view class="value" style="font-weight: bold">
							{{ handleIdCard(userInfo?.car_id) }}
						</view>
					</view>

					<!--姓名，性别，单位，身份证号，在职状态/退休状态-->
				</view>
				<view
					class="right-wrap flex-center"
					style="padding-right: 20rpx"
				>
					<image
						src="../static/main/people.png"
						mode="widthFix"
						style="width: 100% !important"
					></image>
				</view>
			</view>
		</view>
		<view v-if="userInfo" class="card-bottom">
			<view>新疆维吾尔自治区卫生健康委员会</view>
			<view>新疆维吾尔自治区保健委员会办公室</view>
		</view>
	</view>
</template>
<script setup>
import { ref } from 'vue';
import HomeCard from '@/components/HomeCard.vue';

const emits = defineEmits(['onClick']);

const userInfo = ref();

onShow(() => {
	const auth = uni.getStorageSync('b2cAuth');
	// console.log('user-info-card onshow', auth);
	if (!isEmpty(auth)) {
		userInfo.value = auth;
		return;
	}
});

const handleLogin = () => {
	uni.navigateTo({
		url: '/pages/subpackage/login/login',
	});
};

const formatIdCard = (idCard) => {
	if (!idCard) return '';
	if (idCard.length < 10) return idCard;
	// 显示前6位和后4位，中间6位用*替代
	const start = idCard.substring(0, 4);
	const end = idCard.substring(idCard.length - 4);
	return `${start}******${end}`;
};
const handleDetail = () => {
	if (isEmpty(userInfo.value)) {
		return;
	}
	emits('onClick');
};
const handleIdCard = (idCard) => {
	if (!idCard) return '';
	if (idCard.length < 10) return idCard;
	// 显示前6位和后4位，中间6位用*替代
	const start = idCard.substring(0, 4);
	const end = idCard.substring(idCard.length - 4);
	return `${start}******${end}`;
};
</script>
<style lang="scss">
.UserInfoCard {
	margin: 16px;
	// background: #e3eab5 url('../static/home/card-bg.png') no-repeat;
	background: linear-gradient(134deg, #ffffff 0%, #dcf9ed 85%);
	background-size: contain;
	background-position-x: 50%;
	border-radius: 8px;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;
	.card-padding {
		padding: 0 10px;
	}
	.card-bg1,
	.card-bg2 {
		width: 200rpx;
		height: 200rpx;
		position: absolute;
	}
	.card-bg1 {
		top: 0;
		left: 40%;
	}
	.card-bg2 {
		bottom: 0;
		left: 20%;
	}
	.user-info-wrap {
		position: relative;
		height: 120px;
		padding: 0 10px;
		background: linear-gradient(to bottom, #b5dfcd, #eaf4f0);
		&.has-login {
			display: flex;
			align-items: center;
			background: transparent;
		}
	}
	.title-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 10px;
	}

	.card-bottom {
		text-align: center;
		// color: #3d3d3d;
		color: #ffffff;
		background: #72a24a;
		padding: 5px 0;
	}

	.unlogin {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px 0;

		.circle-icon {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
			background: white;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.user-info {
		width: 100%;
		height: 100%;
		padding: 10px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.row {
			display: flex;
			align-items: center;

			.value {
				font-size: 32rpx;
			}

			& ~ .row {
				margin-top: 10px;
			}
		}
	}

	.detail-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		padding-bottom: 20rpx;
	}
	.left-wrap {
		flex: 1;
		height: 100%;
		padding: 20rpx 0 20rpx 20rpx;
		.row {
			padding-top: 20rpx;
		}
		.label {
			white-space: nowrap;
			// width: 160rpx;
		}
		.value {
			word-break: break-all;
			flex: 1;
		}
		.label,
		.value {
			color: #080708;
			font-size: 28rpx;
		}
	}
	.right-wrap {
		width: 200rpx;
	}
}
</style>
