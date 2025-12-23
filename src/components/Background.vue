<template>
	<view class="page-bg">
		<view class="right-circle"></view>
		<view class="right-bottom-circle"></view>
		<view class="left-bottom-circle"></view>
	</view>
</template>
<style lang="scss">
.page-bg {
	height: 330px;
	width: 100%;
	background: linear-gradient(
		to bottom,
		rgb(131 168 234 / 0.6) 0%,
		rgba(15, 98, 251, 0) 80%
	);
	position: absolute;
	left: 0;
	top: 0;
	z-index: -1;
	overflow: hidden;
	// #ifdef H5
	z-index: 0;
	// #endif
	.right-circle {
		position: absolute;
		width: 220px;
		height: 220px;
		top: 0;
		right: 0;
		transform: translateX(20%) translateY(-20%);
		border-radius: 50%;
		overflow: hidden;
		background: radial-gradient(
			circle at center,
			#bbd1fa 0%,
			rgba(187, 209, 250, 0) 70%
		);
	}
	.left-bottom-circle,
	.right-bottom-circle {
		position: absolute;
		width: 140px;
		height: 140px;
		border-radius: 50%;
		overflow: hidden;
	}
	.right-bottom-circle {
		background: radial-gradient(
			circle at center,
			rgba(250, 217, 187, 0.5) 0%,
			rgba(187, 209, 250, 0) 80%
		);
		right: 0;
		bottom: 0;
	}
	.left-bottom-circle {
		left: 0;
		bottom: 10px;
		transform: translateX(-15%);
		background: radial-gradient(
			circle at center,
			rgba(222, 250, 187, 0.5) 0%,
			rgba(187, 209, 250, 0) 80%
		);
	}
}
</style>
