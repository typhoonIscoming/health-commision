<template>
	<view class="user-card">
		<uv-modal ref="modal" :asyncClose="true" :showConfirmButton="false">
			<view class="card-content">
				<view class="user-info">
					<Carousel :list="list">
						<template #default="{ item }">
							<view
								v-if="item.name === 'detail'"
								class="swiper-item-content details"
							>
								<view class="top-wrap flex">
									<view class="left-wrap">
										<view class="title-wrap flex-center">
											<image
												src="../static/home/card.png"
												mode="aspectFill"
												style="
													width: 80rpx;
													height: 80rpx;
													border-radius: 50%;
												"
											></image>
											<text
												style="
													font-size: 32rpx;
													font-weight: bold;
													margin-left: 20rpx;
												"
											>
												医疗就诊卡
											</text>
										</view>
										<view class="row flex-center">
											<view class="label">姓名：</view>
											<view class="value">
												{{ userInfo?.name }}
											</view>
										</view>
										<view class="row flex-center">
											<view class="label">性别：</view>
											<view class="value">
												{{ userInfo?.sex || '女' }}
											</view>
										</view>
										<view class="row flex">
											<view class="label">单位：</view>
											<view class="value">
												{{
													userInfo?.yhdw ||
													'新疆维吾尔自治区商务厅'
												}}
											</view>
										</view>
										<view class="row flex">
											<view class="label">
												职级及年限：
											</view>
											<view class="value">
												{{
													userInfo?.zjnx || '10年以上'
												}}
											</view>
										</view>
										<view class="row flex-center">
											<view
												class="label"
												style="font-weight: bold"
											>
												身份证号：
											</view>
											<view
												class="value"
												style="font-weight: bold"
											>
												{{ userInfo?.car_id }}
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
								<view class="bottom-wrap flex-column">
									<view>新疆维吾尔自治区卫生健康委员会</view>
									<view>
										新疆维吾尔自治区保健委员会办公室
									</view>
								</view>
							</view>
							<view
								v-else-if="item.name === 'list'"
								class="swiper-item-content list"
							>
								<view class="table-wrap">
									<view class="table-row">
										<view class="table-cell name-cell">
											<text>医院名称</text>
										</view>
										<view class="table-cell phone-cell">
											<text>电话</text>
										</view>
									</view>
									<view
										class="table-row"
										v-for="row in hospital"
										:key="row"
									>
										<view class="table-cell name-cell">
											<text>{{ row.name }}</text>
										</view>
										<view
											class="table-cell phone-cell"
											@click="handleCall(row.phone)"
										>
											<text>{{ row.phone }}</text>
										</view>
									</view>
								</view>
							</view>
						</template>
					</Carousel>
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
import Carousel from './Carousel.vue';
import useHospital from '@/hooks/hospitalHook';

const { hospitalList } = useHospital();

const modal = ref();
const list = [
	{
		name: 'detail',
	},
	{
		name: 'list',
	},
];

const hospital = ref(hospitalList);

const userInfo = ref(null);

const handleOpen = () => {
	modal.value?.open();
};

const handleCall = (phone) => {
	if (!phone) return;
	uni.makePhoneCall({
		phoneNumber: phone,
	});
};

defineExpose({
	open() {
		handleOpen();
		const auth = uni.getStorageSync('b2cAuth');
		if (!auth) {
			userInfo.value = null;
			return;
		}
		userInfo.value = auth;
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
	.uv-popup {
		.uv-modal__content {
			position: relative;
			padding: 0% !important;
		}
	}

	.uv-popup__content {
		background: transparent !important;
		box-sizing: border-box;
		overflow: visible !important;
		width: 90% !important;
	}
	.uv-modal {
		// background: linear-gradient(to bottom, #d1e7ff 0%, #ffffff 100%);
		overflow: visible;
		width: 100% !important;
	}
	.uv-line {
		display: none;
	}
	.card-content {
		width: 100%;
		transform: translateY(-30%);
	}
	.swiper-item-content {
		border-radius: 30rpx;
		border: 1px solid #525252;
		background: white;
		overflow: hidden;
		&.details {
			height: 100%;
			display: flex;
			flex-direction: column;
			.top-wrap {
				flex: 1;
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
				background: #ffffff;
			}
			.bottom-wrap {
				display: flex;
				flex-direction: column;
				background: #63a639;
				justify-content: center;
				align-items: center;
				padding: 20rpx 0;
				color: white;
			}
		}
		&.list {
			height: 100%;
			padding: 20rpx;
		}
	}

	.close-wrap {
		position: absolute;
		right: 0;
		left: 0;
		bottom: 0;
		margin: auto;
		transform: translateY(200%);
		width: fit-content;
	}

	.swiper-item-content.list {
		background: #d2e9d3;
		.table-wrap {
			display: flex;
			flex-direction: column;
			gap: 0;
			border: 1px solid #525252;
			border-radius: 8rpx;
			overflow: hidden;
		}
		.table-row {
			display: flex;
			flex-direction: row;
			gap: 0;
			border-bottom: 1px solid #525252;
			&:last-child {
				border-bottom: none;
			}
		}
		.table-cell {
			flex: 1;
			padding: 5rpx 0;
			text-align: center;
			font-size: 26rpx;
			color: #333;
			border-right: 1px solid #525252;
			&:last-child {
				border-right: none;
			}
			&.phone-cell {
				flex: 0.8;
			}
			&.name-cell {
				text-align: left;
				padding-left: 10rpx;
			}
		}
	}
}
</style>
