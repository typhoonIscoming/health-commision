<template>
	<view
		class="carousel"
		@touchstart="onTouchStart"
		@touchmove="onTouchMove"
		@touchend="onTouchEnd"
	>
		<view class="carousel-track">
			<view
				v-for="(item, idx) in list"
				:key="idx"
				class="carousel-item"
				:style="itemStyle(idx)"
				:data-active="idx === currentIndex ? true : null"
			>
				<slot :item="item" :index="idx">{{ item }}</slot>
			</view>
		</view>
		<view v-if="props.showIndicators" class="carousel-dots">
			<view
				v-for="(item, idx) in list"
				:key="'dot-' + idx"
				class="carousel-dot"
				:class="{ active: idx === currentIndex }"
			/>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
	list: {
		type: Array,
		required: true,
	},
	interval: {
		type: Number,
		default: 3000,
	},
	autoPlay: {
		type: Boolean,
		default: false,
	},
	showIndicators: {
		type: Boolean,
		default: true,
	},
});

const currentIndex = ref(0);
const timer = ref(null);
const startX = ref(0);
const deltaX = ref(0);
const isSwiping = ref(false);

const getWidth = () => {
	// #ifdef H5
	return window.innerWidth;
	// #endif
	// #ifndef H5
	// 兼容uni-app小程序端
	return uni.getSystemInfoSync().windowWidth;
	// #endif
};

const itemStyle = (idx) => {
	const translate =
		(idx - currentIndex.value) * 100 +
		(isSwiping.value ? (deltaX.value / getWidth()) * 100 : 0);
	return `transform: translateX(${translate}%); transition: ${
		isSwiping.value ? 'none' : 'transform 0.3s'
	}; width: 100%;`;
};

function startAutoPlay() {
	stopAutoPlay();
	timer.value = setInterval(() => {
		next();
	}, props.interval);
}

function stopAutoPlay() {
	if (timer.value) {
		clearInterval(timer.value);
		timer.value = null;
	}
}

function next() {
	currentIndex.value = (currentIndex.value + 1) % props.list.length;
}

function prev() {
	currentIndex.value =
		(currentIndex.value - 1 + props.list.length) % props.list.length;
}

function onTouchStart(e) {
	isSwiping.value = true;
	startX.value = e.touches[0].clientX;
	deltaX.value = 0;
	stopAutoPlay();
}

function onTouchMove(e) {
	if (!isSwiping.value) return;
	deltaX.value = e.touches[0].clientX - startX.value;
}

function onTouchEnd(e) {
	if (!isSwiping.value) return;
	const threshold = 50;
	if (deltaX.value > threshold) {
		prev();
	} else if (deltaX.value < -threshold) {
		next();
	}
	isSwiping.value = false;
	deltaX.value = 0;
	if (props.autoPlay) {
		startAutoPlay();
	}
}

onMounted(() => {
	if (props.autoPlay) {
		startAutoPlay();
	}
});

onBeforeUnmount(() => {
	stopAutoPlay();
});
</script>

<style scoped>
.carousel {
	position: relative;
	width: 100%;
	height: fit-content;
}
.carousel-track {
	position: relative;
	width: 100%;
	height: fit-content;
	padding-top: 100%;
	overflow-x: hidden;
}
.carousel-item {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	height: auto;
	box-sizing: border-box;
	/* 只显示当前卡片内容 */
	z-index: 1;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s;
}
.carousel-item[data-active] {
	opacity: 1;
	pointer-events: auto;
	z-index: 2;
}
.carousel-dots {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	transform: translateY(25px);
	/* display: none; */
}
.carousel-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #ccc;
	margin: 0 4px;
	transition: background 0.3s;
}
.carousel-dot.active {
	/* background: #007aff; */
	background: #ffffff;
}
</style>
