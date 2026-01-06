<template>
	<view class="user-card">
		<uv-modal ref="modal" :asyncClose="true" :showConfirmButton="false">
			<view class="card-content">
				<view class="user-info">
					<view class="user-avatar">
						<uv-avatar
							src="https://cdn.uviewui.com/uview/album/1.jpg"
							:size="100"
						></uv-avatar>
					</view>

					<view class="details">
						<view class="row flex-between">
							<text class="label">姓名：</text>
							<text class="value">张三</text>
						</view>
						<view class="row flex-between">
							<text class="label">身份证号：</text>
							<text class="value">123456789012345678</text>
						</view>
						<view class="row flex-between">
							<text class="label">卡片类型：</text>
							<text class="value">退休</text>
						</view>
						<view class="row flex-between">
							<text class="label">级别：</text>
							<text class="value">高级</text>
						</view>
					</view>
				</view>
				<view class="close-wrap">
					<uv-icon
						name="close-circle"
						color="white"
						size="40"
						@click="modal.close()"
					></uv-icon>
				</view>
			</view>
		</uv-modal>
	</view>
</template>
<script setup>
import { ref } from 'vue';
const modal = ref();
const handleOpen = () => {
	modal.value?.open();
};

defineExpose({
	open() {
		handleOpen();
	},
});
defineOptions({
	options: {
		styleIsolation: 'shared',
	},
});
</script>
<style lang="scss">
.user-card {
	.uv-popup__content {
		background: transparent !important;
		padding: 2px;
		box-sizing: border-box;
		border: 1px solid white;
		overflow: visible !important;
	}
	.uv-modal {
		background: linear-gradient(to bottom, #d1e7ff 0%, #ffffff 100%);
		overflow: visible;
	}
	.uv-modal__content {
		padding-top: 60px !important;
		position: relative;
	}
	.card-content {
		width: 100%;
	}
	.user-avatar {
		position: absolute;
		top: -50px;
		left: 50%;
		transform: translateX(-50%);
	}
	.details {
		.row {
			padding-top: 20rpx;
		}
		.label {
			color: #6a7b8f;
			font-weight: bold;
			font-size: 28rpx;
		}
		.value {
			font-size: 30rpx;
		}
	}
	.close-wrap {
		position: absolute;
		right: 0;
		left: 0;
		bottom: 0;
		margin: auto;
		transform: translateY(150%);
		width: fit-content;
	}
}
</style>
