<template>
	<view class="psychological-card page-gap">
		<view
			class="card-content psychological-test flex flex-center flex-between"
		>
			<image
				src="@/static/home/xinliceping.png"
				mode="aspectFit"
				style="width: 100rpx; height: 100rpx"
			/>
			<view class="list-wrapper">
				<view class="label">心理测评</view>
				<view class="desc">心理健康状况测评</view>
			</view>
		</view>
		<view class="card-content questionnaire flex flex-center flex-between">
			<image
				src="@/static/home/wenjuandiaocha.png"
				mode="aspectFit"
				style="width: 100rpx; height: 100rpx"
			/>
			<view class="list-wrapper flex-col flex-between">
				<view class="label">问卷调查</view>
				<view class="desc">健康状态调研问卷</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup></script>
<style lang="scss" scoped>
.psychological-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20rpx;
	.card-content {
		flex: 1;
		background: white;
		border-radius: 20rpx;
		padding: 30rpx 10rpx 30rpx 0;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
	.list-wrapper {
		flex: 1;
	}
	.psychological-test {
		background: linear-gradient(91deg, #68d7aa 0%, #5dc396 99%);
	}
	.questionnaire {
		background: linear-gradient(90deg, #5ea7f8 0%, #4e94f6 100%);
	}
	.label {
		color: #ffffff;
		font-size: 28rpx;
	}
	.desc {
		color: #ffffff;
		font-size: 22rpx;
		margin-top: 10rpx;
	}
}
</style>
