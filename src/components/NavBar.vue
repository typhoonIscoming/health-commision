<template>
	<view class="navbar" :class="{ bgImage: !!bgImage }">
		<uv-navbar
			:bgColor="bgColor"
			placeholder
			:safeAreaInsetTop="true"
			fixed
			:imgMode="imgMode"
		>
			<template v-slot:left>
				<slot name="left"><text></text></slot>
			</template>
			<template v-slot:center>
				<slot name="center">
					<text class="nav-title">{{ title }}</text>
				</slot>
			</template>
			<template v-slot:right>
				<slot name="right" />
			</template>
		</uv-navbar>
	</view>
</template>
<script setup>
import { onMounted, ref, defineOptions, computed } from 'vue';
// #ifdef MP-WEIXIN
defineOptions({
	options: {
		styleIsolation: 'shared',
	},
});
// #endif

const props = defineProps({
	bgImage: {
		type: String,
		default: '',
	},
	bgColor: {
		type: String,
		default: '',
	},
	imgMode: {
		type: String,
		default: 'widthFix',
	},
	opacity: {
		type: Number,
		default: 1,
	},
	title: {
		type: String,
		default: '',
	},
});

const bgColor = computed(() => {
	if (props.bgImage) {
		return props.bgImage;
	} else if (props.bgColor) {
		return props.bgColor;
	}
	return `rgba(255,255,255,${props.opacity})`;
});

const safeAreaTop = ref(0);
const safeAreaRight = ref(94);

// 计算安全区域高度
const calculateSafeArea = () => {
	const sysInfo = uni.getWindowInfo();
	let menuButtonInfo = { left: 0 };
	// #ifdef MP-WEIXIN
	menuButtonInfo = uni.getMenuButtonBoundingClientRect();
	// #endif
	// 计算右侧安全距离
	safeAreaRight.value = sysInfo.windowWidth - menuButtonInfo.left;
	// 状态栏高度 + 导航栏高度(假设为44px)
	safeAreaTop.value = sysInfo.statusBarHeight + 44;
};

onMounted(() => {
	calculateSafeArea();
});
</script>
<style lang="scss" scoped>
.navbar {
	width: 100%;

	.nav-right {
		font-size: 28rpx;
		line-height: 1;
		margin-left: 5px;
		font-weight: 500;
		font-family: -webkit-pictograph;
		color: #2e2e2e;
	}
	&.bgImage {
		.uv-navbar__content {
			background: transparent !important;
		}
	}
	.nav-title {
		font-size: 16px;
	}
}
.uv-nav-slot {
	display: flex;
}
.uv-navbar__content__right {
	padding-right: 8px !important;
}
:deep(.uv-navbar--fixed) {
	overflow-y: hidden;
	z-index: 99 !important;
}
</style>
