<template>
	<view class="publicize">
		<view class="title">
			{{ detail?.wzbt }}
		</view>
		<view class="time">
			{{ detail?.fbrq }}
			<text class="author">{{ detail?.zuozhe }}</text>
		</view>
		<view class="content">
			<view class="material-list">
				<view v-for="media in materialList">
					<image
						v-if="isImage(media.thumbnail_full_path)"
						:src="media.thumbnail_full_path"
						mode="widthFix"
						class="artical-img"
						style="width: 100%; border-radius: 10rpx"
					/>
					<video
						v-else-if="isVideo(media.DownloadUrl)"
						:src="media.DownloadUrl"
						autoplay
						controls
						style="
							width: 100%;
							max-height: 400rpx;
							border-radius: 10rpx;
						"
					/>
				</view>
			</view>
			<view v-html="detail?.content"></view>
		</view>
	</view>
</template>
<script setup>
import { ref } from 'vue';
import educationHook from '@/hooks/education';
import parseHtml from '@/utils/html-paser';
import { isJSON } from '@/utils';
// import Video from '@/components/Video.vue';

// 去掉 figure 节点本身，保留其子节点（如图片）
const unwrapFigure = (nodes = []) =>
	nodes.flatMap((node) => {
		const children = node.children
			? unwrapFigure(node.children)
			: undefined;
		if (node.name === 'figure') return children || [];
		return [children ? { ...node, children } : node];
	});

// 初始化图片样式：块级、居中、不超出容器
const initialStyle = (nodes = []) =>
	nodes.map((node) => {
		if (node.name === 'img') {
			const attrs = node.attrs || {};
			return {
				...node,
				attrs: {
					...attrs,
					style: `display:block;margin:0 auto;max-width:100%;${attrs.style || ''}`,
				},
			};
		}
		return node.children
			? { ...node, children: initialStyle(node.children) }
			: node;
	});

const { getDetail } = educationHook();
const detail = ref(null);

const rowid = ref('');
// 素材列表
const materialList = ref([]);

onLoad(async (options) => {
	rowid.value = options.rowid || '';
	if (options.rowid) {
		detail.value = await getDetail(rowid.value);
		if (detail.value) {
			// 提取素材列表
			if (isJSON(detail.value.wztwsc)) {
				materialList.value = JSON.parse(detail.value.wztwsc);
			}
			detail.value.content = initialStyle(
				unwrapFigure(parseHtml(detail.value.wznr)),
			);
		}
		console.log('result', detail.value);
	}
});

const isImage = (url) => {
	const result = /\.(jpg|jpeg|png|gif|bmp|webp)/i.test(url);
	return result;
};

const isVideo = (url) => {
	return /\.(mp4|avi|mov|wmv|flv|mkv)/i.test(url);
};
</script>
<style lang="scss">
.publicize {
	padding: 20rpx 20rpx 40rpx;
	background: #fff;
	min-height: 100vh;
	.title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.time {
		font-size: 24rpx;
		color: #888;
		margin-bottom: 30rpx;
	}
	.author {
		margin-left: 20rpx;
		color: #2a82e4;
	}
	.content {
		.content-paragraph {
			view {
				margin-top: 20rpx;
			}
		}
		.content-item {
			margin-bottom: 30rpx;
			.content-title {
				font-size: 28rpx;
				font-weight: bold;
				margin-bottom: 15rpx;
			}
			.content-text {
				font-size: 24rpx;
				line-height: 1.5;
				color: #555;
			}
		}
	}
}
</style>
