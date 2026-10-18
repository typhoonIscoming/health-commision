<template>
	<web-view :src="pageUrl"></web-view>
</template>
<script setup>
import { onLoad } from '@dcloudio/uni-app';

const pageUrl = ref();

onLoad((options) => {
	if (options.url) {
		pageUrl.value = options.url;
	}
	if (options.title) {
		// uniapp设置页面tital
		uni.setNavigationBarTitle({
			title: options.title,
		});
	}
});
</script>
<style lang="scss"></style>
