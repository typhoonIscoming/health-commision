<template>
	<video
		autoplay
		:src="src"
		controls
		class="artical-img"
		:style="{
			width: '100%',
			maxHeight: '300rpx',
			borderRadius: '10rpx',
		}"
	/>
	<!-- @loadedmetadata="handleLoadMetaData" -->
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
	src: String,
});

const videoHeight = ref(160);

const handleLoadMetaData = (event) => {
	const { width, height } = event.detail;
	const screenWidth = wx.getSystemInfoSync().windowWidth;
	const calculatedHeight = (height / width) * screenWidth;
	videoHeight.value = calculatedHeight;
};
</script>
