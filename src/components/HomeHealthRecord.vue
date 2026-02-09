<template>
	<view class="HomeHealthRecord page-gap">
		<TitleRow :title="title" />
		<view class="content flex">
			<view v-if="type === 'tj'" style="width: 100%">
				<view
					v-for="(item, i) in serviceList"
					:key="i"
					style="width: 100%"
				>
					<view
						v-if="type === 'tj'"
						class="service-item flex-col"
						:class="item.name"
						@click="handleRoute(item)"
					>
						<view class="label">{{ item.label }}</view>
						<view class="desc">
							<view v-if="item.name === 'tj'" class="row-val">
								共
								<text class="item-count">{{ item.count }}</text>
								份报告
							</view>
							<view
								v-else-if="item.name === 'mz'"
								class="row-val"
							>
								共
								<text class="item-count">{{ item.count }}</text>
								条记录
							</view>
							<view
								v-else-if="item.name === 'mzmb'"
								class="row-val"
							>
								共
								<text class="item-count">{{ item.count }}</text>
								条记录
							</view>
							<view
								v-else-if="item.name === 'zy'"
								class="row-val"
							>
								共
								<text class="item-count">{{ item.count }}</text>
								条记录
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="service-row" style="width: 100%">
				<uv-list>
					<uv-list-item
						v-for="(item, i) in serviceList"
						:key="i"
						clickable
						border
						show-arrow
						:thumb="item.icon"
						:title="item.label"
						@click="handleRoute(item)"
					>
						<template #header>
							<view class="service-row-icon" :class="item.name">
								<image
									:src="item.icon"
									mode="aspectFill"
									style="width: 30rpx; height: 30rpx"
								/>
							</view>
						</template>
						<template #footer>
							<view
								style="
									display: flex;
									align-items: center;
									justify-content: flex-end;
								"
							>
								<view class="row-val">
									共
									<text class="item-count">
										{{ item.count }}
									</text>
									条记录
								</view>
							</view>
						</template>
					</uv-list-item>
				</uv-list>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, watch } from 'vue';
import TitleRow from './Title.vue';
import { checkLogin } from '@/utils/index.js';
import homeCardHook from '../hooks/homeCard';
import homeCardFee from '../hooks/homeCardFee';

import zhuyuan from '@/static/card/zhuyuan.png';
import menzhen from '@/static/card/menzhen.png';
import manbing from '@/static/card/manbing.png';

const props = defineProps({
	title: {
		type: String,
		default: '健康服务记录',
	},
	type: {
		type: String,
		default: '',
	},
});

const { tjbgNum } = homeCardHook(true);
const { list: resultList } = homeCardFee(true);

const service = ref([
	{ label: '体检报告', count: 0, name: 'tj' },
	{ label: '一般门诊', count: 0, name: 'mz', icon: menzhen },
	{ label: '门诊慢病', count: 0, name: 'mzmb', icon: manbing },
	{ label: '住院', count: 0, name: 'zy', icon: zhuyuan },
]);
const serviceList = computed(() => {
	if (props.type === 'tj') {
		return [service.value[0]];
	}
	return service.value.slice(1);
});

watch(
	() => [tjbgNum.value, resultList.value],
	(list) => {
		service.value = service.value.map((item) => {
			if (item.name === 'tj') {
				return { ...item, count: list[0] };
			}
			const oItem = list[1].find((fItem) => fItem.name === item.name);
			return { ...item, count: oItem.count };
		});
	},
	{ deep: true, immediate: true },
);

const handleRoute = (item) => {
	checkLogin.checkAuthInfo(() => {
		uni.navigateTo({
			url: `/pages/subpackage/physicalExamination/physicalExamination?type=${item.name}`,
		});
	});
};
</script>
<style lang="scss">
.HomeHealthRecord {
	.content {
		width: 100%;
		flex-wrap: wrap;
		margin-top: 20rpx;
		justify-content: space-between;
		gap: 16px;
	}
	.service-item {
		height: 100px;
		padding: 20rpx;
		overflow: hidden;
		justify-content: center;
		border-radius: 20rpx;
		&.tj {
			// background: #e9effe url('../static/home/tj.png') no-repeat;
			background: #e9effe;
			background-size: contain;
			background-position: 100% 100%;
			width: 100%;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
			.label,
			.item-count {
				color: #307ef2;
			}
		}
		&.mz {
			// background: url('../static/home/mz.png') no-repeat;
			background: #67b5f9;
			background-size: cover;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
			.label,
			.row-val {
				color: #fff;
			}
			.item-count {
				// color: #cf7b4a;
				color: #fff;
			}
		}
		&.mzmb {
			background: url('../static/home/zy.png') no-repeat;
			background-size: cover;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
			.label,
			.item-count {
				color: #f340e9;
			}
		}
		&.zy {
			background: url('../static/home/jc.png') no-repeat;
			background-size: cover;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
			.label,
			.item-count {
				color: #59b47e;
			}
		}
		.label {
			font-size: 32rpx;
			font-weight: bold;
		}
		.desc {
			margin-top: 10rpx;
			min-height: 36rpx;
		}
		.row-val {
			color: #808080;
			font-size: 32rpx;
		}
		.item-count {
			margin: 0 10rpx;
			font-size: 32rpx;
			font-weight: bold;
		}
	}

	.service-row {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		border-radius: 20rpx;
		overflow: hidden;
		.uv-list-item__container {
			padding-right: 0 !important;
		}
		.service-row-icon {
			&.mz {
				background: #fa6e6b;
			}
			&.mzmb {
				background: #52b9ef;
			}
			&.zy {
				background: #fda658;
			}
		}
		.item-count {
			font-weight: bold;
			color: red;
			font-size: 30rpx;
		}
		.service-row-icon {
			border-radius: 50%;
			font-size: 0;
			width: 60rpx;
			height: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 20rpx;
		}
	}
}
</style>
