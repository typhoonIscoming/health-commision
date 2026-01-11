<template>
	<view class="physical-item">
		<view class="content-wrap flex">
			<view class="physical-icon">
				<image
					src="../static/home/ckbg.png"
					mode="aspectFill"
					style="width: 60rpx; height: 60rpx"
				/>
			</view>
			<view class="content-detail">
				<view class="physical-item-title flex-between">
					<view class="title">{{ info.bgmc }}</view>
					<uv-tags
						text="查看报告"
						type="warning"
						shape="circle"
						@click="handleRoute"
					></uv-tags>
				</view>
				<view class="physical-item-address"
				>
					体检机构：{{ info.tjyy }}
				</view>
				<view class="physical-item-address flex-between">
					<view>报告日期：{{ info.bgrq }}</view>
					<view>体检结果：{{ info.bgjgms }}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, defineProps, computed } from 'vue';
import { getReportUrl } from '@/api';
import { to, isEmpty } from '@/utils';

const props = defineProps({
	item: {
		type: Object,
		required: true,
	},
});

const info = computed(() => props.item);

const handleRoute = async () => {
	const params = { row_id: props.item.rowid };
	const [err, res] = await to(getReportUrl(params));
	if (!isEmpty(err) || isEmpty(res)) {
		uni.showToast({ icon: 'none', title: '获取体检报告失败' });
		return;
	}
	const path = decodeURIComponent(res.url);
	const match = path.match(/\.([a-zA-Z0-9]+)(?=[\?&]|$)/);
	const fileType = match ? match[1] : 'pdf';

	uni.downloadFile({
		url: path,
		fail: function (result) {
			console.log('下载文档异常', result);
		},
		success: function (result) {
			var filePath = result.tempFilePath;
			uni.openDocument({
				filePath: filePath,
				showMenu: true,
				fileType: fileType,
				success: function () {
					console.log('打开文档成功');
				},
			});
		},
	});
};
</script>
<style lang="scss">
.physical-item {
	padding: 20rpx;
	border-radius: 6px;
	background: #f5faff;
	margin-top: 20rpx;
	.content-detail {
		margin-left: 30rpx;
		flex: 1;
	}
	&-title {
		.title{
			font-size: 38rpx;
			font-weight: bold;
			flex: 1;
			word-break: break-all;
			margin-right: 20rpx;
		}
	}
	&-address {
		padding-top: 20rpx;
		color: #383838;
	}
	&-date {
		margin-top: 20rpx;
		justify-content: center;
	}
}
</style>
