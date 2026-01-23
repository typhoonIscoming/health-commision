<template>
	<view class="reservation-item flex">
		<view class="left">
			<image
				src="../static/home/tjjl.png"
				mode="aspectFill"
				style="width: 60rpx; height: 60rpx"
			/>
		</view>
		<view class="right">
			<view class="row flex">
				<view class="title">体检机构名称：</view>
				<view class="value">{{ info.jgmc }}</view>
			</view>
			<view class="row flex">
				<view class="title">机构地址：</view>
				<view class="value">{{ info.jgdz }}</view>
			</view>

			<view class="row flex">
				<view class="title">预约日期：</view>
				<view class="value" style="font-size: 32rpx; font-weight: bold">
					{{ info.yyrq }}
				</view>
			</view>
			<view class="row flex">
				<view class="title">预约状态：</view>
				<view
					class="value"
					style="font-size: 36rpx; font-weight: bold"
					:class="{
						success: info.yyzt && info.yyzt.indexOf('成功') > -1,
						fail: info.yyzt && info.yyzt.indexOf('失败') > -1,
					}"
				>
					{{ info.yyzt }}
				</view>
			</view>
			<view v-if="info.yybz" class="row flex">
				<view class="title">备注：</view>
				<view class="value" style="font-size: 28rpx">
					{{ info.yybz }}
				</view>
			</view>
			<!-- <view class="row flex" style="align-items: center">
				<view class="title">预约号：</view>
				<view
					class="value"
					style="color: red; font-size: 38rpx; font-weight: bold"
				>
					{{ info.tjyyh }}
				</view>
			</view> -->
		</view>
	</view>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
	status: {
		type: Number,
		default: 0,
	},
	item: {
		type: Object,
		default: () => ({}),
	},
});
const info = computed(() => props.item);
</script>
<style lang="scss">
.reservation-item {
	padding: 20rpx;
	background: #f5faff;
	border-radius: 8px;
	margin-bottom: 20rpx;
	.row {
		margin-bottom: 20rpx;
		&:last-child {
			margin-bottom: 0;
		}
		.title {
			color: #808080;
			white-space: nowrap;
			width: 200rpx;
		}
		.value {
			word-break: break-all;
			flex: 1;
			&.success {
				color: #5ac725;
			}
			&.fail {
				color: rgb(228, 86, 86);
			}
		}
	}
	.right {
		flex: 1;
		margin-left: 20rpx;
	}
}
</style>
