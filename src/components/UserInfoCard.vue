<template>
	<view class="UserInfoCard" @click="handleDetail">
		<view class="title-wrap">
			<text style="color: #555643">新疆自治区卫生健康委员会</text>
			<view style="display: flex; align-items: center">
				<image
					src="@/static/home/logo.png"
					mode="heightFix"
					style="width: 30px; height: 30px; margin-right: 10rpx"
				/>
				<text style="font-size: 30rpx">电子健康卡</text>
			</view>
		</view>
		<view style="position: relative; height: 120px">
			<HomeCard />
			<!-- <view v-if="!userInfo" class="unlogin">
				<view class="circle-icon" @click="handleLogin">
					<uv-icon name="plus"></uv-icon>
				</view>
				<view style="margin-top: 10px; color: #0b0b0b">去登录</view>
			</view>
			<view v-else class="user-info">
				<view
					style="
						display: flex;
						flex-direction: column;
						justify-content: center;
						height: 100%;
					"
				>
					<view class="row">
						<view class="label">姓名：</view>
						<view class="value">{{ userInfo.name }}</view>
					</view>
					<view class="row">
						<view class="label">身份证号：</view>
						<view class="value">
							{{ formatIdCard(userInfo.car_id) }}
						</view>
					</view>
				</view>
				<view style="height: 100%">
					<image
						:src="userInfo.tx"
						mode="aspectFill"
						style="width: 80px; height: 100%"
					/>
				</view>
			</view> -->
		</view>
		<view class="card-bottom">中华人民共和国国家卫生委员会监制</view>
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
</script>
<style lang="scss">
.UserInfoCard {
	margin: 16px;
	padding: 10px;
	// background: #e3eab5 url('../static/home/card-bg.png') no-repeat;
	background: linear-gradient(134deg, #ffffff 0%, #dcf9ed 85%);
	background-size: contain;
	background-position-x: 50%;
	border-radius: 8px;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.title-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-bottom {
		text-align: center;
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
}
</style>
