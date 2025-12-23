<template>
	<view class="navbar">
		<uv-navbar
			:bgColor="`rgba(255,255,255,${opacity})`"
			:title="props.title"
			placeholder
			:safeAreaInsetTop="true"
		>
			<template v-slot:left><slot name="left" /></template>
		</uv-navbar>
	</view>
</template>
<script setup>
import { onMounted, ref, defineProps } from 'vue';

const props = defineProps({
	title: {
		type: String,
		default: '',
	},
	opacity: {
		type: [Number, String],
		default: 0,
	},
});

const safeAreaTop = ref(0);

// 计算安全区域高度
const calculateSafeArea = () => {
	const sysInfo = uni.getWindowInfo();
	// 状态栏高度 + 导航栏高度(假设为44px)
	safeAreaTop.value = sysInfo.statusBarHeight + 44;
};

onMounted(() => {
	calculateSafeArea();
});
</script>
<style lang="scss">
.navbar {
	width: 100%;
	background: transparent;
	position: relative;
	.uv-navbar--fixed {
		background: transparent;
	}
}
.uv-nav-slot {
	display: flex;
}
</style>
