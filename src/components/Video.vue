<template>
	<video
		ref="videoRef"
		:src="src"
		:controls="controls"
		:show-play-btn="showPlayBtn"
		:show-center-play-btn="showCenterPlayBtn"
		class="artical-img"
		style="width: 100%; height: 100%; border-radius: 10rpx"
	/>
	<!-- @loadedmetadata="handleLoadMetaData" -->
</template>
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
	src: String,
	controls: {
		type: Boolean,
		default: false,
	},
	showPlayBtn: {
		type: Boolean,
		default: false,
	},
	showCenterPlayBtn: {
		type: Boolean,
		default: false,
	},
});

const videoRef = ref();

const videoHeight = ref(160);

const handleLoadMetaData = (event) => {
	const { width, height } = event.detail;
	const screenWidth = wx.getSystemInfoSync().windowWidth;
	const calculatedHeight = (height / width) * screenWidth;
	videoHeight.value = calculatedHeight;
};
onMounted(() => {
	videoRef.value?.stop();
});
</script>
